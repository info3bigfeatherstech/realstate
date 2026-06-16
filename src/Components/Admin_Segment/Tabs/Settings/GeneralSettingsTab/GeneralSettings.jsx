// src/tabs/Settings/GeneralSettingsTab/GeneralSettingsTab.jsx
import React, { useState } from "react";

const GeneralSettingsTab = () => {
  const [form, setForm] = useState({
    agencyName: "Real Estate Panel Pvt. Ltd.",
    supportEmail: "support@realestatepanel.com",
    contactNumber: "+91 98765 00000",
    address: "B-12, Sector 18, Noida, Uttar Pradesh, India",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">General Settings</h3>
        <p className="text-sm text-slate-500 mt-1">Update your agency's public information</p>
      </div>

      <div className="space-y-5 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Agency Name</label>
          <input
            type="text"
            value={form.agencyName}
            onChange={(e) => handleChange("agencyName", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Email</label>
          <input
            type="email"
            value={form.supportEmail}
            onChange={(e) => handleChange("supportEmail", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Number</label>
          <input
            type="tel"
            value={form.contactNumber}
            onChange={(e) => handleChange("contactNumber", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
          />
        </div>

        <div className="pt-2">
          <button className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;