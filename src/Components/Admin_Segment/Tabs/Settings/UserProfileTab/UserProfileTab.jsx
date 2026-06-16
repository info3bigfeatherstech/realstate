// src/tabs/Settings/UserProfileTab/UserProfileTab.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";

const UserProfileTab = () => {
  const user = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">User Profile</h3>
        <p className="text-sm text-slate-500 mt-1">Manage your admin account details</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md shadow-blue-200">
          {form.name ? form.name.charAt(0).toUpperCase() : "A"}
        </div>
        <div>
          <div className="font-semibold text-slate-800">{form.name || "Admin"}</div>
          <div className="text-xs text-blue-600 font-medium tracking-wider uppercase mt-1">
            {user?.role || "Super Admin"}
          </div>
        </div>
      </div>

      <div className="space-y-5 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div className="pt-2 flex gap-3">
          <button className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
            Save Changes
          </button>
          <button className="px-5 py-2.5 text-sm font-medium border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileTab;