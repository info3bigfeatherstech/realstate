// src/tabs/AgentsTab.jsx
import React from "react";

const AgentsTab = () => {
  const mockAgents = [
    { id: 1, name: "Vikram Malhotra", email: "vikram@realstate.com", listings: 14, sales: "₹12 Cr" },
    { id: 2, name: "Ananya Deshmukh", email: "ananya@realstate.com", listings: 9, sales: "₹7.5 Cr" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800">Agent Directory</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all cursor-pointer">
          + Add New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {agent.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 truncate">{agent.name}</h4>
              <p className="text-slate-500 text-sm truncate">{agent.email}</p>
            </div>
            <div className="text-right space-y-1">
              <span className="text-xs text-slate-400 block">{agent.listings} Active Listings</span>
              <span className="text-sm font-bold text-slate-800 block">Sales: {agent.sales}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsTab;
