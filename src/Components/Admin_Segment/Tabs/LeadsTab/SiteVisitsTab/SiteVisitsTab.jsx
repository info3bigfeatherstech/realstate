// src/tabs/LeadsTab/SiteVisitsTab/SiteVisitsTab.jsx
import React, { useState } from "react";

const VISIT_STATUSES = ["Scheduled", "Completed", "Rescheduled", "Cancelled"];

const STATUS_STYLES = {
  "Scheduled": "bg-purple-50 text-purple-600",
  "Completed": "bg-emerald-50 text-emerald-600",
  "Rescheduled": "bg-amber-50 text-amber-600",
  "Cancelled": "bg-red-50 text-red-600",
};

const MOCK_VISITS = [
  {
    id: "VISIT0001",
    property: "3BHK Independent House, Whitefield",
    userName: "Arjun Verma",
    contact: "+91 98765 33333",
    leadType: "Buy",
    status: "Scheduled",
    date: "15 Jun 2026, 11:00 AM",
  },
  {
    id: "VISIT0002",
    property: "2BHK Sea View Apartment, Bandra",
    userName: "Rohit Mehta",
    contact: "+91 98765 11111",
    leadType: "Buy",
    status: "Completed",
    date: "10 Jun 2026, 03:30 PM",
  },
  {
    id: "VISIT0003",
    property: "1BHK Studio, Koramangala",
    userName: "Divya Nair",
    contact: "+91 98765 44444",
    leadType: "Rent",
    status: "Rescheduled",
    date: "13 Jun 2026, 05:00 PM",
  },
];

const SiteVisitsTab = () => {
  const [visits, setVisits] = useState(MOCK_VISITS);

  const handleStatusChange = (visitId, newStatus) => {
    setVisits((prev) =>
      prev.map((visit) => (visit.id === visitId ? { ...visit, status: newStatus } : visit))
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Site Visits</h3>
          <p className="text-sm text-slate-500 mt-1">Scheduled and completed property site visits</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search by user, property..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option>All Visits</option>
            {VISIT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 pr-4 font-medium">Property</th>
              <th className="py-3 pr-4 font-medium">User Name</th>
              <th className="py-3 pr-4 font-medium">Contact</th>
              <th className="py-3 pr-4 font-medium">Lead Type</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pr-4">
                  <div className="font-medium text-slate-800 max-w-xs">{visit.property}</div>
                  <div className="text-xs text-slate-400 mt-0.5">ID: {visit.id}</div>
                </td>
                <td className="py-4 pr-4 font-medium text-slate-700">{visit.userName}</td>
                <td className="py-4 pr-4 text-slate-500">{visit.contact}</td>
                <td className="py-4 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    visit.leadType === "Buy" ? "bg-indigo-50 text-indigo-600" : "bg-cyan-50 text-cyan-600"
                  }`}>
                    {visit.leadType}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <select
                    value={visit.status}
                    onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer ${STATUS_STYLES[visit.status] || "bg-slate-50 text-slate-600"}`}
                  >
                    {VISIT_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 pr-4 text-slate-500">{visit.date}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <button title="View Lead Details" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button title="Contact User" className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button title="Reschedule Site Visit" className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button title="Mark Closed" className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiteVisitsTab;