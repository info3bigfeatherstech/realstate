import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Loader2 } from "lucide-react";
import { useGoogleLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { getApiErrorMessage } from "../../Shared/ToastConfig";

const ACCOUNT_TYPES = Object.freeze([
  { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
  { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
  { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
]);

const isAuthSession = (result) =>
  Boolean(result && result.user && typeof result.accessToken === "string" && result.accessToken);

/**
 * Google Sign-In with mandatory first-time profile-type selection.
 *
 * Flow:
 * 1. User signs in with Google → backend verifies idToken
 * 2. Existing account → onAuthenticated immediately
 * 3. New account → show Seeker / Owner / Agent picker → complete with signupToken
 */
const GoogleAuthButton = ({
  onAuthenticated,
  lockedAccountType,
  disabled = false,
  text = "continue_with",
  onPendingChange, // NEW: notifies parent when the "choose profile type" card is showing so it can hide the email signup section underneath
}) => {
  const [googleLogin, { isLoading: isApiLoading }] = useGoogleLoginMutation();
  const [signupToken, setSignupToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const busy = disabled || submitting || isApiLoading;
  const needsProfileType = Boolean(signupToken);

  // Google's `width` prop needs a pixel number (not "100%"), so we measure
  // the wrapper's actual pixel width and feed it straight to GoogleLogin.
  // No CSS transform/scale here — GoogleLogin renders at exactly this
  // width, so it fills the container natively without any hack.
  const googleBtnWrapperRef = useRef(null);
  const [googleBtnWidth, setGoogleBtnWidth] = useState(320);

  useEffect(() => {
    const el = googleBtnWrapperRef.current;
    if (!el) return;
    const update = () => {
      const containerWidth = el.offsetWidth;
      if (containerWidth > 0) {
        setGoogleBtnWidth(Math.round(containerWidth));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const allowedTypes = useMemo(() => {
    if (!lockedAccountType) return ACCOUNT_TYPES;
    return ACCOUNT_TYPES.filter((type) => type.value === lockedAccountType);
  }, [lockedAccountType]);

  const resetPending = useCallback(() => {
    setSignupToken(null);
    setProfile(null);
    setSelectedType(null);
    onPendingChange?.(false); // NEW: tell parent the Google profile-picker is no longer showing
  }, [onPendingChange]);

  const deliverSession = useCallback(
    async (result) => {
      if (!isAuthSession(result)) {
        setError("Google sign-in returned an incomplete session. Please try again.");
        return;
      }
      onPendingChange?.(false); // NEW: session delivered, picker (if any) is done
      await onAuthenticated(result);
    },
    [onAuthenticated, onPendingChange]
  );

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      setError("Google did not return a credential. Please try again.");
      return;
    }

    setSubmitting(true);
    setError("");
    resetPending();

    try {
      const result = await googleLogin({ idToken }).unwrap();

      if (result?.requiresAccountType) {
        if (!result.signupToken) {
          setError("Could not start Google signup. Please try again.");
          return;
        }
        setSignupToken(result.signupToken);
        setProfile(result.profile || null);
        setSelectedType(lockedAccountType || null);
        onPendingChange?.(true); // NEW: profile-type card is now showing, parent should hide email form
        return;
      }

      await deliverSession(result);
    } catch (err) {
      setError(getApiErrorMessage(err, "Google login failed"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmAccountType = async () => {
    if (!signupToken) return;

    if (!selectedType) {
      setError("Please select Seeker, Owner, or Agent to continue.");
      return;
    }

    if (lockedAccountType && selectedType !== lockedAccountType) {
      setError(`This signup requires the ${lockedAccountType} profile type.`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await googleLogin({
        signupToken,
        accountType: selectedType,
      }).unwrap();

      if (result?.requiresAccountType) {
        setError("Please choose your profile type to continue.");
        return;
      }

      resetPending();
      await deliverSession(result);
    } catch (err) {
      const status = err?.status;
      const message = getApiErrorMessage(err, "Could not complete Google signup");
      if (status === 401) {
        resetPending();
        setError(`${message} Please continue with Google again.`);
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return (
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
        Google login is not configured. Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in
        frontend env.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!needsProfileType && (
        <div
          ref={googleBtnWrapperRef}
          className={`w-full flex justify-center ${busy ? "pointer-events-none opacity-60" : ""}`}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign-in was cancelled or failed")}
            useOneTap={false}
            text={text}
            shape="rectangular"
            size="large"
            width={String(googleBtnWidth)}
            theme="outline"
            logo_alignment="center"
          />
        </div>
      )}

      {submitting && !needsProfileType && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Signing you in…
        </div>
      )}

      {needsProfileType && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">How do you want to use Mehta Estates?</p>
            <p className="text-xs text-slate-500 mt-1">
              {profile?.email
                ? `Signed in as ${profile.fullName || profile.email}. Choose one profile type to finish creating your account.`
                : "Choose one profile type to finish creating your Google account."}
            </p>
          </div>

          <div className="flex w-full bg-slate-100 border border-slate-200 rounded-full p-1 gap-1">
            {allowedTypes.map((type) => {
              const isSelected = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  disabled={busy}
                  onClick={() => setSelectedType(type.value)}
                  className={`flex-1 min-w-0 px-1.5 sm:px-2 py-2 rounded-full text-[11px] sm:text-xs font-semibold leading-tight transition-all duration-200 select-none ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  } ${busy ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="truncate sm:whitespace-normal block text-center">
                    {type.value === "agent" ? "Agent/Broker" : type.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={busy || !selectedType}
            onClick={handleConfirmAccountType}
            className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => {
              resetPending();
              setError("");
            }}
            className="w-full text-xs text-slate-500 hover:text-slate-700 py-1"
          >
            Use a different Google account
          </button>
        </div>
      )}

      {error ? <p className="text-xs text-center text-red-600">{error}</p> : null}
    </div>
  );
};

export default GoogleAuthButton;

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { Loader2 } from "lucide-react";
// import { useGoogleLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { getApiErrorMessage } from "../../Shared/ToastConfig";

// const ACCOUNT_TYPES = Object.freeze([
//   { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
//   { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
//   { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
// ]);

// const isAuthSession = (result) =>
//   Boolean(result && result.user && typeof result.accessToken === "string" && result.accessToken);

// /**
//  * Google Sign-In with mandatory first-time profile-type selection.
//  *
//  * Flow:
//  * 1. User signs in with Google → backend verifies idToken
//  * 2. Existing account → onAuthenticated immediately
//  * 3. New account → show Seeker / Owner / Agent picker → complete with signupToken
//  */
// const GoogleAuthButton = ({
//   onAuthenticated,
//   lockedAccountType,
//   disabled = false,
//   text = "continue_with",
//   onPendingChange, // NEW: notifies parent when the "choose profile type" card is showing so it can hide the email signup section underneath
// }) => {
//   const [googleLogin, { isLoading: isApiLoading }] = useGoogleLoginMutation();
//   const [signupToken, setSignupToken] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const busy = disabled || submitting || isApiLoading;
//   const needsProfileType = Boolean(signupToken);

//   // Google's `width` prop needs a pixel number (not "100%"), so measure the
//   // wrapper and feed it the real pixel width — this is what lets the button
//   // actually stretch full-width and lets logo_alignment="center" work.
//   const googleBtnScale = 1.3;
//   const googleBtnWrapperRef = useRef(null);
//   const [googleBtnWidth, setGoogleBtnWidth] = useState(320);

//   useEffect(() => {
//     const el = googleBtnWrapperRef.current;
//     if (!el) return;
//     const update = () => {
//       const containerWidth = el.offsetWidth;
//       if (containerWidth > 0) {
//         setGoogleBtnWidth(Math.round(containerWidth / googleBtnScale));
//       }
//     };
//     update();
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     return () => ro.disconnect();
//   }, []);

//   const allowedTypes = useMemo(() => {
//     if (!lockedAccountType) return ACCOUNT_TYPES;
//     return ACCOUNT_TYPES.filter((type) => type.value === lockedAccountType);
//   }, [lockedAccountType]);

//   const resetPending = useCallback(() => {
//     setSignupToken(null);
//     setProfile(null);
//     setSelectedType(null);
//     onPendingChange?.(false); // NEW: tell parent the Google profile-picker is no longer showing
//   }, [onPendingChange]);

//   const deliverSession = useCallback(
//     async (result) => {
//       if (!isAuthSession(result)) {
//         setError("Google sign-in returned an incomplete session. Please try again.");
//         return;
//       }
//       onPendingChange?.(false); // NEW: session delivered, picker (if any) is done
//       await onAuthenticated(result);
//     },
//     [onAuthenticated, onPendingChange]
//   );

//   const handleGoogleSuccess = async (credentialResponse) => {
//     const idToken = credentialResponse?.credential;
//     if (!idToken) {
//       setError("Google did not return a credential. Please try again.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     resetPending();

//     try {
//       const result = await googleLogin({ idToken }).unwrap();

//       if (result?.requiresAccountType) {
//         if (!result.signupToken) {
//           setError("Could not start Google signup. Please try again.");
//           return;
//         }
//         setSignupToken(result.signupToken);
//         setProfile(result.profile || null);
//         setSelectedType(lockedAccountType || null);
//         onPendingChange?.(true); // NEW: profile-type card is now showing, parent should hide email form
//         return;
//       }

//       await deliverSession(result);
//     } catch (err) {
//       setError(getApiErrorMessage(err, "Google login failed"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirmAccountType = async () => {
//     if (!signupToken) return;

//     if (!selectedType) {
//       setError("Please select Seeker, Owner, or Agent to continue.");
//       return;
//     }

//     if (lockedAccountType && selectedType !== lockedAccountType) {
//       setError(`This signup requires the ${lockedAccountType} profile type.`);
//       return;
//     }

//     setSubmitting(true);
//     setError("");

//     try {
//       const result = await googleLogin({
//         signupToken,
//         accountType: selectedType,
//       }).unwrap();

//       if (result?.requiresAccountType) {
//         setError("Please choose your profile type to continue.");
//         return;
//       }

//       resetPending();
//       await deliverSession(result);
//     } catch (err) {
//       const status = err?.status;
//       const message = getApiErrorMessage(err, "Could not complete Google signup");
//       if (status === 401) {
//         resetPending();
//         setError(`${message} Please continue with Google again.`);
//       } else {
//         setError(message);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   if (!clientId) {
//     return (
//       <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
//         Google login is not configured. Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in
//         frontend env.
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {!needsProfileType && (
//         <div
//           ref={googleBtnWrapperRef}
//           className={`w-full ${busy ? "pointer-events-none opacity-60" : ""}`}
//           style={{ overflow: "visible" }}
//         >
//           <div style={{ transform: `scale(${googleBtnScale})`, transformOrigin: "0 0" }}>
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={() => setError("Google sign-in was cancelled or failed")}
//               useOneTap={false}
//               text={text}
//               shape="rectangular"
//               size="large"
//               width={String(googleBtnWidth)}
//               theme="outline"
//               logo_alignment="center"
//             />
//           </div>
//         </div>
//       )}

//       {submitting && !needsProfileType && (
//         <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
//           <Loader2 className="w-4 h-4 animate-spin" />
//           Signing you in…
//         </div>
//       )}

//       {needsProfileType && (
//         <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//           <div>
//             <p className="text-sm font-semibold text-slate-800">How do you want to use Mehta Estates?</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {profile?.email
//                 ? `Signed in as ${profile.fullName || profile.email}. Choose one profile type to finish creating your account.`
//                 : "Choose one profile type to finish creating your Google account."}
//             </p>
//           </div>

//           <div
//             className={`grid grid-cols-1 gap-2 ${
//               allowedTypes.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-1"
//             }`}
//           >
//             {allowedTypes.map((type) => {
//               const isSelected = selectedType === type.value;
//               return (
//                 <button
//                   key={type.value}
//                   type="button"
//                   disabled={busy}
//                   onClick={() => setSelectedType(type.value)}
//                   className={`text-left p-3 rounded-lg border transition-all ${
//                     isSelected
//                       ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
//                       : "border-slate-200 bg-white hover:border-slate-300"
//                   } ${busy ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   <p className="text-sm font-semibold text-slate-800">{type.label}</p>
//                   <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             disabled={busy || !selectedType}
//             onClick={handleConfirmAccountType}
//             className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//             Continue
//           </button>

//           <button
//             type="button"
//             disabled={busy}
//             onClick={() => {
//               resetPending();
//               setError("");
//             }}
//             className="w-full text-xs text-slate-500 hover:text-slate-700 py-1"
//           >
//             Use a different Google account
//           </button>
//         </div>
//       )}

//       {error ? <p className="text-xs text-center text-red-600">{error}</p> : null}
//     </div>
//   );
// };

// export default GoogleAuthButton;
// import React, { useCallback, useMemo, useState } from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import { Loader2 } from "lucide-react";
// import { useGoogleLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { getApiErrorMessage } from "../../Shared/ToastConfig";

// const ACCOUNT_TYPES = Object.freeze([
//   { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
//   { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
//   { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
// ]);

// const isAuthSession = (result) =>
//   Boolean(result && result.user && typeof result.accessToken === "string" && result.accessToken);

// /**
//  * Google Sign-In with mandatory first-time profile-type selection.
//  *
//  * Flow:
//  * 1. User signs in with Google → backend verifies idToken
//  * 2. Existing account → onAuthenticated immediately
//  * 3. New account → show Seeker / Owner / Agent picker → complete with signupToken
//  */
// const GoogleAuthButton = ({
//   onAuthenticated,
//   lockedAccountType,
//   disabled = false,
//   text = "continue_with",
// }) => {
//   const [googleLogin, { isLoading: isApiLoading }] = useGoogleLoginMutation();
//   const [signupToken, setSignupToken] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [selectedType, setSelectedType] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const busy = disabled || submitting || isApiLoading;
//   const needsProfileType = Boolean(signupToken);

//   const allowedTypes = useMemo(() => {
//     if (!lockedAccountType) return ACCOUNT_TYPES;
//     return ACCOUNT_TYPES.filter((type) => type.value === lockedAccountType);
//   }, [lockedAccountType]);

//   const resetPending = useCallback(() => {
//     setSignupToken(null);
//     setProfile(null);
//     setSelectedType(null);
//   }, []);

//   const deliverSession = useCallback(
//     async (result) => {
//       if (!isAuthSession(result)) {
//         setError("Google sign-in returned an incomplete session. Please try again.");
//         return;
//       }
//       await onAuthenticated(result);
//     },
//     [onAuthenticated]
//   );

//   const handleGoogleSuccess = async (credentialResponse) => {
//     const idToken = credentialResponse?.credential;
//     if (!idToken) {
//       setError("Google did not return a credential. Please try again.");
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     resetPending();

//     try {
//       const result = await googleLogin({ idToken }).unwrap();

//       if (result?.requiresAccountType) {
//         if (!result.signupToken) {
//           setError("Could not start Google signup. Please try again.");
//           return;
//         }
//         setSignupToken(result.signupToken);
//         setProfile(result.profile || null);
//         setSelectedType(lockedAccountType || null);
//         return;
//       }

//       await deliverSession(result);
//     } catch (err) {
//       setError(getApiErrorMessage(err, "Google login failed"));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirmAccountType = async () => {
//     if (!signupToken) return;

//     if (!selectedType) {
//       setError("Please select Seeker, Owner, or Agent to continue.");
//       return;
//     }

//     if (lockedAccountType && selectedType !== lockedAccountType) {
//       setError(`This signup requires the ${lockedAccountType} profile type.`);
//       return;
//     }

//     setSubmitting(true);
//     setError("");

//     try {
//       const result = await googleLogin({
//         signupToken,
//         accountType: selectedType,
//       }).unwrap();

//       if (result?.requiresAccountType) {
//         setError("Please choose your profile type to continue.");
//         return;
//       }

//       resetPending();
//       await deliverSession(result);
//     } catch (err) {
//       const status = err?.status;
//       const message = getApiErrorMessage(err, "Could not complete Google signup");
//       if (status === 401) {
//         resetPending();
//         setError(`${message} Please continue with Google again.`);
//       } else {
//         setError(message);
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   if (!clientId) {
//     return (
//       <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
//         Google login is not configured. Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> in
//         frontend env.
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {!needsProfileType && (
//         <div className={`flex justify-center ${busy ? "pointer-events-none opacity-60" : ""}`}>
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => setError("Google sign-in was cancelled or failed")}
//             useOneTap={false}
//             text={text}
//             shape="rectangular"
//             size="large"
//             width="100%"
//             theme="outline"
//           />
//         </div>
//       )}

//       {submitting && !needsProfileType && (
//         <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
//           <Loader2 className="w-4 h-4 animate-spin" />
//           Signing you in…
//         </div>
//       )}

//       {needsProfileType && (
//         <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
//           <div>
//             <p className="text-sm font-semibold text-slate-800">How do you want to use Mehta Estates?</p>
//             <p className="text-xs text-slate-500 mt-1">
//               {profile?.email
//                 ? `Signed in as ${profile.fullName || profile.email}. Choose one profile type to finish creating your account.`
//                 : "Choose one profile type to finish creating your Google account."}
//             </p>
//           </div>

//           <div
//             className={`grid grid-cols-1 gap-2 ${
//               allowedTypes.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-1"
//             }`}
//           >
//             {allowedTypes.map((type) => {
//               const isSelected = selectedType === type.value;
//               return (
//                 <button
//                   key={type.value}
//                   type="button"
//                   disabled={busy}
//                   onClick={() => setSelectedType(type.value)}
//                   className={`text-left p-3 rounded-lg border transition-all ${
//                     isSelected
//                       ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
//                       : "border-slate-200 bg-white hover:border-slate-300"
//                   } ${busy ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   <p className="text-sm font-semibold text-slate-800">{type.label}</p>
//                   <p className="text-xs text-slate-500 mt-0.5">{type.desc}</p>
//                 </button>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             disabled={busy || !selectedType}
//             onClick={handleConfirmAccountType}
//             className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
//             Continue
//           </button>

//           <button
//             type="button"
//             disabled={busy}
//             onClick={() => {
//               resetPending();
//               setError("");
//             }}
//             className="w-full text-xs text-slate-500 hover:text-slate-700 py-1"
//           >
//             Use a different Google account
//           </button>
//         </div>
//       )}

//       {error ? <p className="text-xs text-center text-red-600">{error}</p> : null}
//     </div>
//   );
// };

// export default GoogleAuthButton;
