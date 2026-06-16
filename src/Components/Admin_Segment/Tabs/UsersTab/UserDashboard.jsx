// src/tabs/Users/UserDashboard.jsx
import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { SETTINGS_REGISTRY } from "./settingsRegistry";

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sub-tab is stored in URL as ctab (child tab) parameter
  const activeSubTab = searchParams.get("ctab") || "allusers";

  const handleSubTabClick = (subId) => {
    // Keep parent tab in URL, only update child tab (ctab)
    setSearchParams({
      tab: "settings",
      ctab: subId,
    });
  };

  const activeConfig = USERS_REGISTRY.find((sub) => sub.id === activeSubTab) || USERS_REGISTRY[0];
  const SubComponent = activeConfig.component;

  return (
    <div className="space-y-6">
      {/* Horizontal Scroll bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        {USERS_REGISTRY.map((sub) => {
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => handleSubTabClick(sub.id)}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {sub.label}
            </button>
          );
        })}
      </div>

      {/* Render selected child component */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <Suspense fallback={<div className="py-10 text-center text-slate-400">Loading Configuration...</div>}>
          {SubComponent ? <SubComponent /> : <div>Component Not Configured</div>}
        </Suspense>
      </div>
    </div>
  );
};

export default UserDashboard;
