// src/Components/Customer_Segment/Tabs/Profile/CustomerProfileTab.jsx
import React from "react";
import { useSelector } from "react-redux";
import { User, Mail, Phone, ShieldCheck, Building2, UserCheck } from "lucide-react";
import { CUSTOMER_ROLE_LABELS } from "../../CustomerRoles";

const CustomerProfileTab = () => {
  const { user } = useSelector((state) => state.customerAuth);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold text-slate-800">{user?.fullName || "Valued Customer"}</h1>
            <p className="text-sm text-slate-500">{CUSTOMER_ROLE_LABELS[user?.accountType] || user?.accountType}</p>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mt-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Account
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider text-xs text-slate-500">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Mobile Number</p>
                <p className="text-sm font-semibold text-slate-700">{user?.mobile || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider text-xs text-slate-500">
            System Identity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Type</p>
                <p className="text-sm font-semibold text-slate-700">
                  {CUSTOMER_ROLE_LABELS[user?.accountType] || user?.accountType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Account Status</p>
                <p className="text-sm font-semibold text-slate-700">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileTab;
