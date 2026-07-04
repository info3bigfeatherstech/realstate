
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, UserPlus, Eye, EyeOff, Building2, CheckCircle2 } from "lucide-react";
import { useRegisterMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { setPendingVerificationEmail } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { useDispatch } from "react-redux";
import { toast, getApiErrorMessage } from "../../Shared/ToastConfig";
import { getReturnUrl } from "../../../utils/inquiryFormDraft";

const ACCOUNT_TYPES = [
  { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
  { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
  { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
];

const inputCls =
  "w-full h-11 px-3.5 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-colors";

const labelCls = "text-xs font-semibold text-slate-600 block mb-1.5";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnUrl = getReturnUrl(searchParams, "/customer/dashboard");
  const fromEnquiry = returnUrl.startsWith("/enquiry");

  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    accountType: fromEnquiry ? "seeker" : "seeker",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(form).unwrap();
      dispatch(setPendingVerificationEmail(form.email));
      if (result?.devOtp) {
        toast.info(`Dev OTP (SMTP not configured): ${result.devOtp}`);
      } else {
        toast.success("OTP sent to your email — check inbox and spam folder");
      }
      navigate("/customer/verify-otp", { state: { email: form.email, returnUrl } });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed"));
    }
  };

  const loginHref = searchParams.get("returnUrl")
    ? `/login?returnUrl=${searchParams.get("returnUrl")}`
    : "/customer/login";

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* LEFT BRAND PANEL — hidden on mobile/tablet, visible from lg up */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex-col justify-between p-10 xl:p-14">
        <div className="flex items-center gap-2">
          <Building2 className="w-7 h-7 text-blue-400" />
          <span className="text-lg font-bold tracking-tight">Mehta Estates</span>
        </div>

        <div className="space-y-6 max-w-sm">
          <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
            Find your next home, faster.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Create a free account to save listings, contact owners directly, and track
            your property inquiries in one place.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "Verified property listings",
              "Direct contact with owners & agents",
              "Track inquiries from your dashboard",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Mehta Estates. All rights reserved.
        </p>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 sm:py-14">
        <div className="w-full max-w-lg">
          {/* Mobile-only compact brand mark */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-base font-bold text-slate-800">Mehta Estates</span>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          </div>
          <p className="text-sm text-slate-500 mb-6">
            It only takes a minute. We'll send you a one-time code to verify your email.
          </p>

          {fromEnquiry && (
            <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5 mb-6">
              Register as <strong>Property Seeker</strong> to submit your accommodation inquiry.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  className={inputCls}
                  required
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  className={inputCls}
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Mobile</label>
                <input
                  className={inputCls}
                  type="tel"
                  required
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    className={`${inputCls} pr-10`}
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
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
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Register as</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {ACCOUNT_TYPES.map((type) => {
                  const isSelected = form.accountType === type.value;
                  const isDisabled = fromEnquiry && type.value !== "seeker";
                  return (
                    <label
                      key={type.value}
                      className={`relative flex flex-col gap-0.5 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                          ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                          : "border-slate-200 hover:border-slate-300"
                        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value={type.value}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => setForm({ ...form, accountType: type.value })}
                        className="sr-only"
                      />
                      <p className="text-sm font-semibold text-slate-800">{type.label}</p>
                      <p className="text-xs text-slate-500 leading-snug">{type.desc}</p>
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Sign Up & Send OTP
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-7">
            Already have an account?{" "}
            <Link to={loginHref} className="text-blue-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
// down code is working but upper code have some ui changes
// import React, { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
// import { useRegisterMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { setPendingVerificationEmail } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
// import { useDispatch } from "react-redux";
// import { toast, getApiErrorMessage } from "../../Shared/ToastConfig";
// import { getReturnUrl } from "../../../utils/inquiryFormDraft";

// const ACCOUNT_TYPES = [
//   { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
//   { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
//   { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
// ];

// const inputCls =
//   "w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const returnUrl = getReturnUrl(searchParams, "/customer/dashboard");
//   const fromEnquiry = returnUrl.startsWith("/enquiry");

//   const [register, { isLoading }] = useRegisterMutation();
//   const [showPassword, setShowPassword] = useState(false); // Eye toggle state added cleanly
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     mobile: "",
//     password: "",
//     accountType: fromEnquiry ? "seeker" : "seeker",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await register(form).unwrap();
//       dispatch(setPendingVerificationEmail(form.email));
//       if (result?.devOtp) {
//         toast.info(`Dev OTP (SMTP not configured): ${result.devOtp}`);
//       } else {
//         toast.success("OTP sent to your email — check inbox and spam folder");
//       }
//       navigate("/customer/verify-otp", { state: { email: form.email, returnUrl } });
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, "Registration failed"));
//     }
//   };

//   const loginHref = searchParams.get("returnUrl")
//     ? `/login?returnUrl=${searchParams.get("returnUrl")}`
//     : "/customer/login";

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
//       {/* Container max-width managed to beautifully look premium with the 2-column input rows */}
//       <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
//         <div className="flex items-center gap-2 mb-6">
//           <UserPlus className="w-6 h-6 text-blue-600" />
//           <h1 className="text-xl font-bold text-slate-800">Create Account</h1>
//         </div>

//         {fromEnquiry && (
//           <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
//             Register as <strong>Property Seeker</strong> to submit your accommodation inquiry.
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Inputs organized in beautiful 2-column grid rows */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Full Name</label>
//               <input className={inputCls} required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email</label>
//               <input className={inputCls} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Mobile</label>
//               <input className={inputCls} type="tel" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 XXXXXXXXXX" />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password</label>
//               <div className="relative">
//                 <input
//                   className={`${inputCls} pr-10`}
//                   type={showPassword ? "text" : "password"}
//                   required
//                   minLength={8}
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <img className="w-4 h-4 inline-block" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>" alt="eye" /> && <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Register As</label>
//             <div className="space-y-2">
//               {ACCOUNT_TYPES.map((type) => (
//                 <label
//                   key={type.value}
//                   className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.accountType === type.value ? "border-blue-600 bg-blue-50" : "border-slate-200"
//                     } ${fromEnquiry && type.value !== "seeker" ? "opacity-50" : ""}`}
//                 >
//                   <input
//                     type="radio"
//                     name="accountType"
//                     value={type.value}
//                     checked={form.accountType === type.value}
//                     disabled={fromEnquiry && type.value !== "seeker"}
//                     onChange={() => setForm({ ...form, accountType: type.value })}
//                     className="mt-1 accent-blue-600"
//                   />
//                   <div>
//                     <p className="text-sm font-semibold text-slate-800">{type.label}</p>
//                     <p className="text-xs text-slate-500">{type.desc}</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
//             {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//             Sign Up & Send OTP
//           </button>
//         </form>

//         <p className="text-sm text-slate-500 text-center mt-6">
//           Already have an account?{" "}
//           <Link to={loginHref} className="text-blue-600 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;

// import React, { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { Loader2, UserPlus } from "lucide-react";
// import { useRegisterMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { setPendingVerificationEmail } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
// import { useDispatch } from "react-redux";
// import { toast, getApiErrorMessage } from "../../Shared/ToastConfig";
// import { getReturnUrl } from "../../../utils/inquiryFormDraft";

// const ACCOUNT_TYPES = [
//   { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
//   { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
//   { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
// ];

// const inputCls =
//   "w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [searchParams] = useSearchParams();
//   const returnUrl = getReturnUrl(searchParams, "/dashboard");
//   const fromEnquiry = returnUrl.startsWith("/enquiry");

//   const [register, { isLoading }] = useRegisterMutation();
//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     mobile: "",
//     password: "",
//     accountType: fromEnquiry ? "seeker" : "seeker",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await register(form).unwrap();
//       dispatch(setPendingVerificationEmail(form.email));
//       if (result?.devOtp) {
//         toast.info(`Dev OTP (SMTP not configured): ${result.devOtp}`);
//       } else {
//         toast.success("OTP sent to your email — check inbox and spam folder");
//       }
//       navigate("/verify-otp", { state: { email: form.email, returnUrl } });
//     } catch (err) {
//       toast.error(getApiErrorMessage(err, "Registration failed"));
//     }
//   };

//   const loginHref = searchParams.get("returnUrl")
//     ? `/login?returnUrl=${searchParams.get("returnUrl")}`
//     : "/customer/login";

//   return (
//     <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
//       <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
//         <div className="flex items-center gap-2 mb-6">
//           <UserPlus className="w-6 h-6 text-blue-600" />
//           <h1 className="text-xl font-bold text-slate-800">Create Account</h1>
//         </div>

//         {fromEnquiry && (
//           <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
//             Register as <strong>Property Seeker</strong> to submit your accommodation inquiry.
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase">Full Name</label>
//             <input className={inputCls} required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
//             <input className={inputCls} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase">Mobile</label>
//             <input className={inputCls} type="tel" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 XXXXXXXXXX" />
//           </div>
//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
//             <input className={inputCls} type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Register As</label>
//             <div className="space-y-2">
//               {ACCOUNT_TYPES.map((type) => (
//                 <label
//                   key={type.value}
//                   className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.accountType === type.value ? "border-blue-600 bg-blue-50" : "border-slate-200"
//                     } ${fromEnquiry && type.value !== "seeker" ? "opacity-50" : ""}`}
//                 >
//                   <input
//                     type="radio"
//                     name="accountType"
//                     value={type.value}
//                     checked={form.accountType === type.value}
//                     disabled={fromEnquiry && type.value !== "seeker"}
//                     onChange={() => setForm({ ...form, accountType: type.value })}
//                     className="mt-1"
//                   />
//                   <div>
//                     <p className="text-sm font-semibold text-slate-800">{type.label}</p>
//                     <p className="text-xs text-slate-500">{type.desc}</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
//             {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//             Sign Up & Send OTP
//           </button>
//         </form>

//         <p className="text-sm text-slate-500 text-center mt-6">
//           Already have an account?{" "}
//           <Link to={loginHref} className="text-blue-600 font-semibold hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;
