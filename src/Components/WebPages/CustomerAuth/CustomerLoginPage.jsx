import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { useLoginMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { setCustomerCredentials } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { useDispatch } from "react-redux";
import { toast } from "../../Shared/ToastConfig";
import { getReturnUrl } from "../../../utils/inquiryFormDraft";

const inputCls =
  "w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const returnUrl = getReturnUrl(searchParams, "/dashboard");
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form).unwrap();
      dispatch(setCustomerCredentials({ user: result.user, accessToken: result.accessToken }));
      toast.success("Login successful");
      navigate(returnUrl, { replace: true });
    } catch (err) {
      if (err?.status === 403) {
        toast.error("Please verify your email first");
        navigate("/verify-otp", { state: { email: form.email, returnUrl } });
        return;
      }
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-6">
          <LogIn className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
            <input className={inputCls} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
            <input className={inputCls} type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Login
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          New user?{" "}
          <Link
            to={searchParams.get("returnUrl") ? `/signup?returnUrl=${searchParams.get("returnUrl")}` : "/signup"}
            className="text-blue-600 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
