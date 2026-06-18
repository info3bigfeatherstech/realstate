import React, { useState } from "react";
import { Loader2, Search, Trash2 } from "lucide-react";
import {
  useGetInquiryStatsQuery,
  useGetInquiriesQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} from "../../../Admin_Redux/InquiryApi/inquiryApi";
import { useGetConstantsQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { toast } from "../../../../Shared/ToastConfig";

const FORM_LABELS = {
  accommodation_requirement: "Accommodation Req.",
  accommodation_listing: "Accommodation Listing",
  buy_property: "Buy Property",
  sell_property: "Sell Property",
};

const AllInquiriesTab = () => {
  const { data: constants } = useGetConstantsQuery();
  const [filters, setFilters] = useState({ page: 1, limit: 20, search: "", formType: "", status: "" });
  const { data: stats } = useGetInquiryStatsQuery();
  const { data, isLoading, isFetching } = useGetInquiriesQuery(filters);
  const [updateInquiry] = useUpdateInquiryMutation();
  const [deleteInquiry] = useDeleteInquiryMutation();

  const inquiries = data?.inquiries || [];
  const meta = data?.meta;

  const handleStatusChange = async (id, status) => {
    try {
      await updateInquiry({ id, status }).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    try {
      await deleteInquiry(id).unwrap();
      toast.success("Inquiry deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">All Inquiries</h2>
        <p className="text-sm text-slate-500">Unified view across all inquiry form types</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-800">{stats?.totalInquiries ?? "—"}</p>
        </div>
        {(stats?.formTypeBreakdown || []).slice(0, 3).map((item) => (
          <div key={item.formType} className="bg-white border rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase">{FORM_LABELS[item.formType] || item.formType}</p>
            <p className="text-2xl font-bold text-slate-800">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm"
            placeholder="Search name, mobile, ref..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <select
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
          value={filters.formType}
          onChange={(e) => setFilters({ ...filters, formType: e.target.value, page: 1 })}
        >
          <option value="">All Form Types</option>
          {(constants?.INQUIRY_FORM_TYPES || []).map((t) => (
            <option key={t} value={t}>{FORM_LABELS[t] || t}</option>
          ))}
        </select>
        <select
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
        >
          <option value="">All Statuses</option>
          {(constants?.ADMIN_INQUIRY_STATUSES || []).map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Ref</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Mobile</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs">{inq.inquiryRef}</td>
                    <td className="px-4 py-3">{FORM_LABELS[inq.formType] || inq.formType}</td>
                    <td className="px-4 py-3">{inq.contact?.fullName}</td>
                    <td className="px-4 py-3">{inq.contact?.mobile}</td>
                    <td className="px-4 py-3 capitalize">{inq.submitterAccountType || "guest"}</td>
                    <td className="px-4 py-3">
                      <select
                        className="text-xs border rounded px-2 py-1"
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq._id, e.target.value)}
                      >
                        {(constants?.ADMIN_INQUIRY_STATUSES || []).map((s) => (
                          <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => handleDelete(inq._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!inquiries.length && (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No inquiries found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {meta && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-slate-500">
            <span>Page {meta.page} of {meta.totalPages} ({meta.total} total)</span>
            <div className="flex gap-2">
              <button type="button" disabled={meta.page <= 1 || isFetching} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
              <button type="button" disabled={meta.page >= meta.totalPages || isFetching} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllInquiriesTab;
