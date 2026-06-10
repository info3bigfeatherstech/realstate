// src/tabs/AnalyticsTab.jsx
import React from "react";

const AnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800">Analytics Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Sales Volume</span>
          <span className="text-3xl font-extrabold text-slate-900 block mt-2">₹19.5 Cr</span>
          <span className="text-xs text-green-600 font-semibold block mt-1">↑ 12% vs last month</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Listings</span>
          <span className="text-3xl font-extrabold text-slate-900 block mt-2">42 Properties</span>
          <span className="text-xs text-slate-500 font-medium block mt-1">36 Sale • 6 Rent</span>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Conversion Rate</span>
          <span className="text-3xl font-extrabold text-slate-900 block mt-2">4.8%</span>
          <span className="text-xs text-green-600 font-semibold block mt-1">↑ 0.5% vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
