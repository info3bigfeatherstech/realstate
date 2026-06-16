// src/tabs/ReportsTab/UserActivityTab/UserActivityTab.jsx
import React, { useState } from "react";

const DATE_RANGES = ["Today", "This Week", "This Month", "Custom Range"];

const MOCK_USERS = [
  { user: "Rajesh Sharma", role: "Admin", lastLogin: "12 Jun 2026, 10:30 AM", actions: 142, listings: 24 },
  { user: "Priya Patel", role: "Agent", lastLogin: "12 Jun 2026, 09:15 AM", actions: 87, listings: 12 },
  { user: "Amit Kumar", role: "User", lastLogin: "11 Jun 2026, 06:42 PM", actions: 9, listings: 0 },
  { user: "Neha Singh", role: "Agent", lastLogin: "12 Jun 2026, 08:05 AM", actions: 56, listings: 18 },
];

const ROLE_STYLES = {
  "Admin": "bg-purple-50 text-purple-600",
  "Agent": "bg-blue-50 text-blue-600",
  "User": "bg-emerald-50 text-emerald-600",
};

const UserActivityTab = () => {
  const [dateRange, setDateRange] = useState("This Month");

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">User Activity Report</h3>
          <p className="text-sm text-slate-500 mt-1">Login activity and platform engagement by user</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Users</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">4</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Active Today</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">3</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Total Actions</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">294</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">New Listings</div>
          <div className="text-2xl font-semibold text-slate-800 mt-1">54</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 pr-4 font-medium">User</th>
              <th className="py-3 pr-4 font-medium">Role</th>
              <th className="py-3 pr-4 font-medium">Last Login</th>
              <th className="py-3 pr-4 font-medium">Actions</th>
              <th className="py-3 pr-4 font-medium">Listings</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((u) => (
              <tr key={u.user} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pr-4 font-medium text-slate-800">{u.user}</td>
                <td className="py-4 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_STYLES[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-4 pr-4 text-slate-500">{u.lastLogin}</td>
                <td className="py-4 pr-4 text-slate-500">{u.actions}</td>
                <td className="py-4 pr-4 text-slate-500">{u.listings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserActivityTab;