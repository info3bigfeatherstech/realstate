import React, { useState } from "react";
import { Loader2, Search } from "lucide-react";
import {
  useGetCustomerStatsQuery,
  useGetCustomersQuery,
  useUpdateCustomerStatusMutation,
} from "../../../Admin_Redux/CustomerApi/customerAdminApi";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";

const ACCOUNT_LABELS = { seeker: "Seeker", owner: "Owner", agent: "Agent" };

const PublicCustomersTab = () => {
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: "", accountType: "" });
  const { data: stats } = useGetCustomerStatsQuery();
  const { data, isLoading } = useGetCustomersQuery(filters);
  const [updateStatus] = useUpdateCustomerStatusMutation();

  const customers = data?.customers || [];
  const meta = data?.meta;

  const toggleActive = async (id, isActive) => {
    try {
      await updateStatus({ id, isActive: !isActive }).unwrap();
      toast.success("Customer updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Update failed"));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Public Customers</h2>
        <p className="text-sm text-slate-500">Seekers, owners, and agents registered on the website</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase">Total</p>
          <p className="text-2xl font-bold">{stats?.totalCustomers ?? "—"}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase">Verified Active</p>
          <p className="text-2xl font-bold">{stats?.verifiedActive ?? "—"}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3 rounded-lg border text-sm"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <select className="h-10 px-3 rounded-lg border text-sm" value={filters.accountType} onChange={(e) => setFilters({ ...filters, accountType: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="seeker">Seeker</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Mobile</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Verified</th>
                <th className="text-left px-4 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">{c.fullName}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.mobile}</td>
                  <td className="px-4 py-3">{ACCOUNT_LABELS[c.accountType] || c.accountType}</td>
                  <td className="px-4 py-3">{c.emailVerified ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => toggleActive(c._id, c.isActive)} className={`px-2 py-1 rounded text-xs font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PublicCustomersTab;
