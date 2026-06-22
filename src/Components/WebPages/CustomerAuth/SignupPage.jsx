import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { useRegisterMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { setPendingVerificationEmail } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { useDispatch } from "react-redux";
import { toast } from "../../Shared/ToastConfig";
import { getReturnUrl } from "../../../utils/inquiryFormDraft";

const ACCOUNT_TYPES = [
  { value: "seeker", label: "Property Seeker", desc: "Looking to rent or buy" },
  { value: "owner", label: "Property Owner", desc: "Want to list or sell property" },
  { value: "agent", label: "Agent / Broker", desc: "List property on behalf of others" },
];

const inputCls =
  "w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnUrl = getReturnUrl(searchParams, "/dashboard");
  const fromEnquiry = returnUrl.startsWith("/enquiry");

  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false); // Eye toggle state added cleanly
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
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const loginHref = searchParams.get("returnUrl")
    ? `/login?returnUrl=${searchParams.get("returnUrl")}`
    : "/customer/login";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* Container max-width managed to beautifully look premium with the 2-column input rows */}
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Create Account</h1>
        </div>

        {fromEnquiry && (
          <p className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4">
            Register as <strong>Property Seeker</strong> to submit your accommodation inquiry.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inputs organized in beautiful 2-column grid rows */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Full Name</label>
              <input className={inputCls} required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Email</label>
              <input className={inputCls} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Mobile</label>
              <input className={inputCls} type="tel" required value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="+91 XXXXXXXXXX" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Password</label>
              <div className="relative">
                <input
                  className={`${inputCls} pr-10`}
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <img className="w-4 h-4 inline-block" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/><circle cx='12' cy='12' r='3'/></svg>" alt="eye" /> && <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Register As</label>
            <div className="space-y-2">
              {ACCOUNT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.accountType === type.value ? "border-blue-600 bg-blue-50" : "border-slate-200"
                    } ${fromEnquiry && type.value !== "seeker" ? "opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={type.value}
                    checked={form.accountType === type.value}
                    disabled={fromEnquiry && type.value !== "seeker"}
                    onChange={() => setForm({ ...form, accountType: type.value })}
                    className="mt-1 accent-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{type.label}</p>
                    <p className="text-xs text-slate-500">{type.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign Up & Send OTP
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link to={loginHref} className="text-blue-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

// import React, { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { Loader2, UserPlus } from "lucide-react";
// import { useRegisterMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
// import { setPendingVerificationEmail } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
// import { useDispatch } from "react-redux";
// import { toast } from "../../Shared/ToastConfig";
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
//       toast.error(err?.data?.message || "Registration failed");
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
