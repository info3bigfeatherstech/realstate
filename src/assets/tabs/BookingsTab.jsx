// src/tabs/BookingsTab.jsx
import React from "react";

const BookingsTab = () => {
  const mockBookings = [
    { id: 1, client: "Amit Sharma", property: "Silicon Residency Villa", date: "June 12, 2026", time: "11:00 AM", status: "Scheduled" },
    { id: 2, client: "Priya Patel", property: "Grand Plaza Penthouse", date: "June 14, 2026", time: "03:30 PM", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Visits & Bookings</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer">
          + Schedule Visit
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-sm">
        {mockBookings.map((b) => (
          <div key={b.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/30">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{b.date} • {b.time}</span>
              <h4 className="font-bold text-slate-900 text-base mt-1">{b.property}</h4>
              <p className="text-slate-500 text-sm mt-0.5">Visitor: {b.client}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                b.status === "Scheduled" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
              }`}>
                {b.status}
              </span>
              <button className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsTab;
