// src/tabs/ReportsTab/LeadConversionTab/LeadConversionTab.jsx
import React, { useState } from "react";

const DATE_RANGES = ["Today", "This Week", "This Month", "Custom Range"];

const MOCK_FUNNEL = [
  { stage: "New", count: 64, percent: 100 },
  { stage: "Contacted", count: 41, percent: 64 },
  { stage: "Site Visit Scheduled", count: 22, percent: 34 },
  { stage: "Negotiation", count: 11, percent: 17 },
  { stage: "Closed (Won)", count: 6, percent: 9 },
  { stage: "Closed (Lost)", count: 5, percent: 8 },
];

const STAGE_COLORS = {
  "New": "bg-blue-500",
  "Contacted": "bg-amber-500",
  "Site Visit Scheduled": "bg-purple-500",
  "Negotiation": "bg-orange-500",
  "Closed (Won)": "bg-emerald-500",
  "Closed (Lost)": "bg-red-500",
};

const LeadConversionTab = () => {
  const [dateRange, setDateRange] = useState("This Month");

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Lead Conversion Report</h3>
          <p className="text-sm text-slate-500 mt-1">Conversion funnel from new lead to closed deal</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {DATE_RANGES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {dateRange === "Custom Range" && (
            <>
              <input type="date" className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              <input type="date" className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100" />
            </>
          )}
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            CSV
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Report
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_FUNNEL.map((stage) => (
          <div key={stage.stage}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
              <span className="text-sm text-slate-500">{stage.count} leads · {stage.percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${STAGE_COLORS[stage.stage]}`}
                style={{ width: `${stage.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Leads</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">64</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Conversion Rate</div>
          <div className="text-2xl font-semibold text-emerald-600 mt-1">9.4%</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Avg. Days to Close</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">14</div>
        </div>
      </div>
    </div>
  );
};

export default LeadConversionTab;