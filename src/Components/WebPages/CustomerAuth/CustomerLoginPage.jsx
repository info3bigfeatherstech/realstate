import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, LogIn, Building2, Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { setCustomerCredentials } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { useDispatch } from "react-redux";
import { toast, getApiErrorMessage } from "../../Shared/ToastConfig";
import { getReturnUrl } from "../../../utils/inquiryFormDraft";
import GoogleAuthProvider from "./GoogleAuthProvider";
import GoogleAuthButton from "./GoogleAuthButton";

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-colors";

const labelCls = "text-xs font-semibold text-slate-600 block mb-1.5";

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnUrl = getReturnUrl(searchParams, "/customer/dashboard");
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleFlowPending, setIsGoogleFlowPending] = useState(false);

  const finishLogin = async (result) => {
    if (!result?.user || !result?.accessToken) {
      toast.error("Login succeeded but session data was incomplete. Please try again.");
      return;
    }
    dispatch(setCustomerCredentials({ user: result.user, accessToken: result.accessToken }));
    toast.success("Login successful");
    navigate(returnUrl, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login({
        identifier: form.identifier.trim(),
        password: form.password,
      }).unwrap();
      await finishLogin(result);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Login failed"));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

  }, [])

  return (
    <GoogleAuthProvider>
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 sm:px-8 py-8 sm:py-9">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building2 className="w-6 h-6 text-blue-600 shrink-0" />
              <span className="text-base font-bold text-slate-800">Mehta Estates</span>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <LogIn className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-900">Log in to your account</h1>
            </div>
            <p className="text-sm text-slate-500 mb-7">
              Use your email or mobile number with your password.
            </p>

            <GoogleAuthButton
              onAuthenticated={finishLogin}
              disabled={isLoading}
              text="continue_with"
              onPendingChange={setIsGoogleFlowPending}
            />

            {!isGoogleFlowPending && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase tracking-wide">
                    <span className="bg-white px-3 text-slate-400 font-semibold">
                      or continue with email / mobile
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
                  <div>
                    <label className={labelCls}>Email or mobile</label>
                    <input
                      className={inputCls}
                      type="text"
                      required
                      autoComplete="nope"
                      placeholder="you@example.com or 10-digit mobile"
                      value={form.identifier}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          if (val.length <= 10) {
                            setForm({ ...form, identifier: val });
                          }
                        } else {
                          setForm({ ...form, identifier: val });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Password</label>
                    <div className="relative">
                      <input
                        className={`${inputCls} pr-10`}
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Log In
                  </button>
                </form>
              </>
            )}

            <p className="text-sm text-slate-500 text-center mt-7">
              New user?{" "}
              <Link
                to={
                  searchParams.get("returnUrl")
                    ? `/customer/signup?returnUrl=${searchParams.get("returnUrl")}`
                    : "/customer/signup"
                }
                className="text-blue-600 font-semibold hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            © {new Date().getFullYear()} Mehta Estates. All rights reserved.
          </p>
        </div>
      </div>
    </GoogleAuthProvider>
  );
};

export default CustomerLoginPage;

// import React, { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { Loader2, LogIn, Building2, Eye, EyeOff, ShieldCheck } from "lucide-react";
// import { useLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { setCustomerCredentials } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
// import { useDispatch } from "react-redux";
// import { toast, getApiErrorMessage } from "../../Shared/ToastConfig";
// import { getReturnUrl } from "../../../utils/inquiryFormDraft";
// import GoogleAuthProvider from "./GoogleAuthProvider";
// import GoogleAuthButton from "./GoogleAuthButton";

// const inputCls =
//   "w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-colors";

// const labelCls = "text-xs font-semibold text-slate-600 block mb-1.5";

// const CustomerLoginPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const returnUrl = getReturnUrl(searchParams, "/customer/dashboard");
//   const [login, { isLoading }] = useLoginMutation();
//   const [form, setForm] = useState({ identifier: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isGoogleFlowPending, setIsGoogleFlowPending] = useState(false);

//   const finishLogin = async (result) => {
//     if (!result?.user || !result?.accessToken) {
//       toast.error("Login succeeded but session data was incomplete. Please try again.");
//       return;
//     }
//     dispatch(setCustomerCredentials({ user: result.user, accessToken: result.accessToken }));
//     toast.success("Login successful");
//     navigate(returnUrl, { replace: true });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await login({
//         identifier: form.identifier.trim(),
//         password: form.password,
//       }).unwrap();
//       await finishLogin(result);
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, "Login failed"));
//     }
//   };

//   return (
//     <GoogleAuthProvider>
//       <div className="min-h-screen w-full flex bg-white">
//         <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex-col justify-between p-10 xl:p-14">
//           <div className="flex items-center gap-2">
//             <Building2 className="w-7 h-7 text-blue-400" />
//             <span className="text-lg font-bold tracking-tight">Mehta Estates</span>
//           </div>

//           <div className="space-y-6 max-w-sm">
//             <h2 className="text-3xl xl:text-4xl font-bold leading-tight">Welcome back.</h2>
//             <p className="text-slate-300 text-sm leading-relaxed">
//               Log in to manage your saved properties, inquiries, and account details.
//             </p>
//             <div className="flex items-start gap-2.5 text-sm text-slate-200 pt-2">
//               <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
//               Your data is secured and never shared without consent.
//             </div>
//           </div>

//           <p className="text-xs text-slate-400">
//             © {new Date().getFullYear()} Mehta Estates. All rights reserved.
//           </p>
//         </div>

//         <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 sm:py-14">
//           <div className="w-full max-w-md">
//             <div className="flex lg:hidden items-center gap-2 mb-8">
//               <Building2 className="w-6 h-6 text-blue-600" />
//               <span className="text-base font-bold text-slate-800">Mehta Estates</span>
//             </div>

//             <div className="flex items-center gap-2 mb-1.5">
//               <LogIn className="w-5 h-5 text-blue-600" />
//               <h1 className="text-2xl font-bold text-slate-900">Log in to your account</h1>
//             </div>
//             <p className="text-sm text-slate-500 mb-7">
//               Use your email or mobile number with your password.
//             </p>

//             <GoogleAuthButton
//               onAuthenticated={finishLogin}
//               disabled={isLoading}
//               text="continue_with"
//               onPendingChange={setIsGoogleFlowPending}
//             />

//             {!isGoogleFlowPending && (
//               <>
//                 <div className="relative my-6">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-slate-200" />
//                   </div>
//                   <div className="relative flex justify-center text-xs uppercase tracking-wide">
//                     <span className="bg-white px-3 text-slate-400 font-semibold">
//                       or continue with email / mobile
//                     </span>
//                   </div>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   <div>
//                     <label className={labelCls}>Email or mobile</label>
//                     <input
//                       className={inputCls}
//                       type="text"
//                       required
//                       autoComplete="username"
//                       placeholder="you@example.com or +91XXXXXXXXXX"
//                       value={form.identifier}
//                       onChange={(e) => setForm({ ...form, identifier: e.target.value })}
//                     />
//                   </div>
//                   <div>
//                     <label className={labelCls}>Password</label>
//                     <div className="relative">
//                       <input
//                         className={`${inputCls} pr-10`}
//                         type={showPassword ? "text" : "password"}
//                         required
//                         autoComplete="current-password"
//                         placeholder="Enter your password"
//                         value={form.password}
//                         onChange={(e) => setForm({ ...form, password: e.target.value })}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
//                         tabIndex={-1}
//                       >
//                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                       </button>
//                     </div>
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
//                   >
//                     {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                     Log In
//                   </button>
//                 </form>
//               </>
//             )}

//             <p className="text-sm text-slate-500 text-center mt-7">
//               New user?{" "}
//               <Link
//                 to={
//                   searchParams.get("returnUrl")
//                     ? `/customer/signup?returnUrl=${searchParams.get("returnUrl")}`
//                     : "/customer/signup"
//                 }
//                 className="text-blue-600 font-semibold hover:underline"
//               >
//                 Create account
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </GoogleAuthProvider>
//   );
// };

// export default CustomerLoginPage;
