// src/tabs/Settings/ProfileSettings.jsx
import React from "react";

const ProfileSettings = () => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-slate-900">User Profile Settings</h4>
      <p className="text-slate-500 text-sm">Manage your personal account details.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
          <input
            type="text"
            defaultValue="Rajesh"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
          <input
            type="text"
            defaultValue="Kumar"
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
