// src/tabs/LeadsTab.jsx
import React from "react";

const LeadsTab = () => {
  const mockLeads = [
    { id: 1, name: "Amit Sharma", phone: "+91 98765 43210", property: "Silicon Residency Villa", status: "New" },
    { id: 2, name: "Priya Patel", phone: "+91 87654 32109", property: "Grand Plaza Penthouse", status: "In Progress" },
    { id: 3, name: "Rohit Sen", phone: "+91 76543 21098", property: "Sea Breeze Apartment", status: "Contacted" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Customer Leads</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer">
          + Add New Lead
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Phone Number</th>
              <th className="px-6 py-4">Interested Property</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {mockLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-900">{lead.name}</td>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4 text-blue-600 font-medium">{lead.property}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    lead.status === "New"
                      ? "bg-blue-50 text-blue-700"
                      : lead.status === "In Progress"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-green-50 text-green-700"
                  }`}>
                    {lead.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTab;
