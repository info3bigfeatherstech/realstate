// src/tabs/LeadsTab/LeadsTab.jsx
import React, { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { LEADS_REGISTRY } from "./LeadsRegistry";

const LeadsTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSubTab = searchParams.get("ctab") || "allleads";

  const handleSubTabClick = (subId) => {
    setSearchParams({
      tab: "leads",
      ctab: subId,
    });
  };

  const activeConfig = LEADS_REGISTRY.find((sub) => sub.id === activeSubTab) || LEADS_REGISTRY[0];
  const SubComponent = activeConfig.component;

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap">
        {LEADS_REGISTRY.map((sub) => {
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
              {sub.badge && (
                <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">
                  {sub.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render selected component */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <SubComponent />
        </Suspense>
      </div>
    </div>
  );
};

export default LeadsTab;