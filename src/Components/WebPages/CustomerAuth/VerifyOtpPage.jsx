import React, { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { setCustomerCredentials } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { toast } from "../../Shared/ToastConfig";
import { getReturnUrl } from "../../../utils/inquiryFormDraft";

const inputCls =
  "w-full h-11 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-center tracking-[0.4em] font-mono text-lg";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const email = location.state?.email || "";
  const returnUrl =
    location.state?.returnUrl || getReturnUrl(searchParams, "/dashboard");
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email missing. Please sign up again.");
      navigate("/signup");
      return;
    }
    try {
      const result = await verifyOtp({ email, otp }).unwrap();
      dispatch(setCustomerCredentials({ user: result.user, accessToken: result.accessToken }));
      toast.success("Email verified! Welcome.");
      navigate(returnUrl, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOtp({ email }).unwrap();
      if (result?.devOtp) {
        toast.info(`Dev OTP (SMTP not configured): ${result.devOtp}`);
      } else {
        toast.success("OTP resent — check your email inbox and spam folder");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">Verify Email</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">Enter the 6-digit OTP sent to {email || "your email"}</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            className={inputCls}
            required
            maxLength={6}
            pattern="\d{6}"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
          />
          <button type="submit" disabled={isLoading} className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Verify & Login
          </button>
        </form>

        <button type="button" onClick={handleResend} disabled={isResending || !email} className="w-full mt-3 text-sm text-blue-600 font-semibold hover:underline disabled:opacity-50">
          {isResending ? "Sending..." : "Resend OTP"}
        </button>

        <p className="text-sm text-slate-500 text-center mt-6">
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
