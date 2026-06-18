import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Home, Building2, KeyRound, LogOut } from "lucide-react";
import { useLogoutMutation } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { clearCredentials } from "../../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { FORM_TYPE_META } from "../../../utils/inquiryForm";
import { toast } from "../../Shared/ToastConfig";

const ICONS = {
  accommodation_requirement: Home,
  buy_property: Building2,
  sell_property: KeyRound,
  accommodation_listing: FileText,
};

const ACCOUNT_LABELS = { seeker: "Property Seeker", owner: "Property Owner", agent: "Agent / Broker" };

const FORM_ACCESS = {
  seeker: ["accommodation_requirement", "buy_property"],
  owner: ["accommodation_listing", "sell_property"],
  agent: ["accommodation_listing", "sell_property"],
};

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, authChecked } = useSelector((state) => state.customerAuth);
  const [logout] = useLogoutMutation();

  if (authChecked && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const allowedForms = user?.allowedForms || FORM_ACCESS[user?.accountType] || [];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // clear local state even if API fails
    }
    dispatch(clearCredentials());
    toast.success("Logged out");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.fullName || "User"}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {ACCOUNT_LABELS[user?.accountType] || user?.accountType} · {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Your Inquiry Forms</h2>
      {user?.accountType === "seeker" && (
        <p className="text-sm text-slate-500 mb-4">
          As a property seeker you can submit an <strong>Accommodation Requirement</strong> (public enquiry page) or a <strong>Buy Property</strong> inquiry below.
        </p>
      )}

      {allowedForms.length === 0 ? (
        <p className="text-slate-500">No forms available for your account type.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allowedForms.map((formType) => {
            const meta = FORM_TYPE_META[formType];
            const Icon = ICONS[formType] || FileText;
            if (!meta) return null;
            return (
              <Link
                key={formType}
                to={meta.path}
                className="block p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{meta.label}</h3>
                    <p className="text-sm text-slate-500 mt-1">{meta.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
