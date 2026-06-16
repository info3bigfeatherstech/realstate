// src/Tabs/SubscriptionsTab/ActiveSubscriptionsTab.jsx
import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, MoreVertical, Calendar, Clock, User, CreditCard, Download,XCircle  } from "lucide-react";

// Demo Active Subscriptions Data
const mockSubscriptions = [
  {
    id: 1,
    userName: "Rajesh Sharma",
    userEmail: "rajesh@example.com",
    planName: "Professional Plan",
    amount: 2499,
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    status: "active",
    autoRenew: true,
    paymentMethod: "Credit Card",
  },
  {
    id: 2,
    userName: "Priya Patel",
    userEmail: "priya@example.com",
    planName: "Basic Plan",
    amount: 999,
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    status: "active",
    autoRenew: true,
    paymentMethod: "UPI",
  },
  {
    id: 3,
    userName: "Amit Kumar",
    userEmail: "amit@example.com",
    planName: "Enterprise Plan",
    amount: 9999,
    startDate: "2024-01-10",
    endDate: "2025-01-10",
    status: "active",
    autoRenew: false,
    paymentMethod: "Net Banking",
  },
  {
    id: 4,
    userName: "Neha Singh",
    userEmail: "neha@example.com",
    planName: "Professional Plan",
    amount: 2499,
    startDate: "2024-02-15",
    endDate: "2024-05-15",
    status: "active",
    autoRenew: true,
    paymentMethod: "Credit Card",
  },
  {
    id: 5,
    userName: "Vikram Mehta",
    userEmail: "vikram@example.com",
    planName: "Basic Plan",
    amount: 999,
    startDate: "2024-03-01",
    endDate: "2024-04-01",
    status: "expiring_soon",
    autoRenew: true,
    paymentMethod: "UPI",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    expiring_soon: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.active}`}>
      {status === "expiring_soon" ? "Expiring Soon" : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ActiveSubscriptionsTab = () => {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [showRenewModal, setShowRenewModal] = useState(null);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = search === "" || 
      sub.userName.toLowerCase().includes(search.toLowerCase()) ||
      sub.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      sub.planName.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = selectedPlan === "" || sub.planName === selectedPlan;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filteredSubscriptions.length / rowsPerPage);
  const paginatedSubs = filteredSubscriptions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleRenew = (id) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, endDate: "2024-12-31", status: "active" } : sub
    ));
    setShowRenewModal(null);
  };

  const handleCancel = (id) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, autoRenew: false, status: "expiring_soon" } : sub
    ));
  };

  const getDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Active Subscriptions</h2>
        <p className="text-sm text-slate-500 mt-1">Manage all active user subscriptions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Total Active</p>
          <p className="text-2xl font-bold text-slate-800">{subscriptions.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{subscriptions.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-600">{subscriptions.filter(s => s.status === "expiring_soon").length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Auto-Renew Enabled</p>
          <p className="text-2xl font-bold text-blue-600">{subscriptions.filter(s => s.autoRenew).length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user or plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
          />
        </div>

        <select 
          value={selectedPlan} 
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          <option value="">All Plans</option>
          <option value="Basic Plan">Basic Plan</option>
          <option value="Professional Plan">Professional Plan</option>
          <option value="Enterprise Plan">Enterprise Plan</option>
        </select>
      </div>

      {/* Renew Modal */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Renew Subscription</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to renew this subscription for another year?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowRenewModal(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={() => handleRenew(showRenewModal)} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                Renew Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{sub.userName}</p>
                      <p className="text-xs text-slate-400">{sub.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-800">{sub.planName}</span>
                  </td>
                   <td className="px-4 py-4">
                    <span className="font-bold text-slate-800">₹{sub.amount.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">/mo</span>
                   </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Calendar className="w-3 h-3" />
                        {new Date(sub.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.endDate).toLocaleDateString()}
                      </div>
                      {getDaysLeft(sub.endDate) <= 7 && (
                        <span className="text-xs text-yellow-600 font-semibold">{getDaysLeft(sub.endDate)} days left</span>
                      )}
                    </div>
                   </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <StatusBadge status={sub.status} />
                      {sub.autoRenew && (
                        <span className="block text-xs text-green-600">Auto-renew ON</span>
                      )}
                    </div>
                   </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <CreditCard className="w-3 h-3" />
                      {sub.paymentMethod}
                    </div>
                   </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowRenewModal(sub.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 cursor-pointer"
                        title="Renew"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleCancel(sub.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        title="Cancel Auto-Renew"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Rows per page:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>Showing {filteredSubscriptions.length} subscriptions</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSubscriptionsTab;