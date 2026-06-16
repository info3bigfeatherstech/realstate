// src/Tabs/SubscriptionsTab/PaymentsTab.jsx
import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Download, Filter, CreditCard, Wallet, Building2 } from "lucide-react";

// Demo Payments Data
const mockPayments = [
  {
    id: "PAY-001",
    userName: "Rajesh Sharma",
    userEmail: "rajesh@example.com",
    planName: "Professional Plan",
    amount: 2499,
    paymentDate: "2024-01-15",
    paymentMethod: "Credit Card",
    status: "success",
    invoiceUrl: "#",
  },
  {
    id: "PAY-002",
    userName: "Priya Patel",
    userEmail: "priya@example.com",
    planName: "Basic Plan",
    amount: 999,
    paymentDate: "2024-02-01",
    paymentMethod: "UPI",
    status: "success",
    invoiceUrl: "#",
  },
  {
    id: "PAY-003",
    userName: "Amit Kumar",
    userEmail: "amit@example.com",
    planName: "Enterprise Plan",
    amount: 9999,
    paymentDate: "2024-01-10",
    paymentMethod: "Net Banking",
    status: "success",
    invoiceUrl: "#",
  },
  {
    id: "PAY-004",
    userName: "Neha Singh",
    userEmail: "neha@example.com",
    planName: "Professional Plan",
    amount: 2499,
    paymentDate: "2024-02-15",
    paymentMethod: "Credit Card",
    status: "pending",
    invoiceUrl: "#",
  },
  {
    id: "PAY-005",
    userName: "Vikram Mehta",
    userEmail: "vikram@example.com",
    planName: "Basic Plan",
    amount: 999,
    paymentDate: "2024-03-01",
    paymentMethod: "UPI",
    status: "failed",
    invoiceUrl: "#",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PaymentMethodIcon = ({ method }) => {
  if (method === "Credit Card") return <CreditCard className="w-4 h-4" />;
  if (method === "UPI") return <Wallet className="w-4 h-4" />;
  return <Building2 className="w-4 h-4" />;
};

const PaymentsTab = () => {
  const [payments, setPayments] = useState(mockPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = search === "" || 
      payment.userName.toLowerCase().includes(search.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      payment.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalRevenue = payments.reduce((sum, p) => p.status === "success" ? sum + p.amount : sum, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Payment Transactions</h2>
        <p className="text-sm text-slate-500 mt-1">View all payment history and invoices</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Total Transactions</p>
          <p className="text-2xl font-bold text-slate-800">{payments.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Successful</p>
          <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === "success").length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold">Failed/Pending</p>
          <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status !== "success").length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
          />
        </div>

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer">
          <Filter className="w-4 h-4" />
          Date Range
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Transaction ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Payment Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs font-semibold text-slate-800">{payment.id}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-slate-800">{payment.userName}</p>
                      <p className="text-xs text-slate-400">{payment.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-slate-600">{payment.planName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-bold text-slate-800">₹{payment.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-slate-600">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <PaymentMethodIcon method={payment.paymentMethod} />
                      <span className="text-slate-600 text-xs">{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={payment.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === "success" && (
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 cursor-pointer" title="Download Invoice">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
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
            <span>Showing {filteredPayments.length} transactions</span>
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

export default PaymentsTab;