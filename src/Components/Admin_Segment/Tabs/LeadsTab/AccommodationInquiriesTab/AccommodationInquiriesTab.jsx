import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, Eye, FileDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInquiriesQuery,
  useGetInquiryStatsQuery,
} from "../../../Admin_Redux/AccommodationInquiryApi/accommodationInquiryApi";
import {
  setPage,
  setLimit,
  setSearch,
  setStatus,
  setRequirementType,
  setOccupantType,
  setCity,
  setMonthlyBudget,
  setMoveInPriority,
  resetFilters,
} from "../../../Admin_Redux/AccommodationInquiryApi/accommodationInquirySlice";
import { useGetConstantsQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import InquiryStatusBadge from "./Shared/InquiryStatusBadge";
import InquiryDetailModal from "./Shared/InquiryDetailModal";
import { toast } from "../../../../Shared/ToastConfig";

const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color || "text-slate-800"}`}>{value ?? 0}</p>
  </div>
);

const AccommodationInquiriesTab = () => {
  const dispatch = useDispatch();
  const {
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
    requirementType: requirementTypeFilter,
    occupantType: occupantTypeFilter,
    city: cityFilter,
    monthlyBudget: budgetFilter,
    moveInPriority: moveInFilter,
    sortBy,
    sortOrder,
  } = useSelector((state) => state.accommodationInquiry);

  const { data: constants } = useGetConstantsQuery();
  const { data: stats, isLoading: statsLoading } = useGetInquiryStatsQuery();

  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter && { status: statusFilter }),
    ...(requirementTypeFilter && { requirementType: requirementTypeFilter }),
    ...(occupantTypeFilter && { occupantType: occupantTypeFilter }),
    ...(cityFilter && { city: cityFilter }),
    ...(budgetFilter && { monthlyBudget: budgetFilter }),
    ...(moveInFilter && { moveInPriority: moveInFilter }),
  };

  const { data, isLoading, isFetching } = useGetInquiriesQuery(queryParams);
  const inquiries = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const { downloadAccommodationInquiryTemplate } = await import(
        "./Shared/downloadAccommodationInquiryTemplate"
      );
      await downloadAccommodationInquiryTemplate(c);
      toast.success("Accommodation form template downloaded");
    } catch (err) {
      console.error("Template download failed:", err);
      toast.error("Failed to generate PDF template");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(localSearch));
  };

  const c = constants || {};
  const breakdown = stats?.statusBreakdown || {};

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Print-friendly offline form with all fields and options (radio / checkbox format).
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadTemplate}
          disabled={isDownloadingTemplate}
          className="h-10 px-4 rounded-lg border border-blue-600 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-50 flex items-center gap-2"
        >
          {isDownloadingTemplate ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          Download Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={statsLoading ? "…" : stats?.totalInquiries} />
        <StatCard label="New" value={breakdown.new} color="text-blue-600" />
        <StatCard label="Contacted" value={breakdown.contacted} color="text-yellow-600" />
        <StatCard label="Converted" value={breakdown.converted} color="text-green-600" />
        <StatCard label="Lost" value={breakdown.lost} color="text-red-600" />
        <StatCard label="Closed" value={breakdown.closed} color="text-gray-500" />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm"
              placeholder="Search name, mobile, ref, city..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold">
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch(resetFilters());
              setLocalSearch("");
            }}
            className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600"
          >
            Reset
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            value={statusFilter}
            onChange={(e) => dispatch(setStatus(e.target.value))}
          >
            <option value="">All Statuses</option>
            {(c.ADMIN_INQUIRY_STATUSES || ["new", "contacted", "converted", "lost", "closed"]).map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            value={requirementTypeFilter}
            onChange={(e) => dispatch(setRequirementType(e.target.value))}
          >
            <option value="">All Requirements</option>
            {(c.REQUIREMENT_TYPES || []).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            value={occupantTypeFilter}
            onChange={(e) => dispatch(setOccupantType(e.target.value))}
          >
            <option value="">All Occupants</option>
            {(c.OCCUPANT_TYPES || []).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <input
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs"
            placeholder="City"
            value={cityFilter}
            onChange={(e) => dispatch(setCity(e.target.value))}
          />
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            value={budgetFilter}
            onChange={(e) => dispatch(setMonthlyBudget(e.target.value))}
          >
            <option value="">All Budgets</option>
            {(c.MONTHLY_BUDGETS || []).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white"
            value={moveInFilter}
            onChange={(e) => dispatch(setMoveInPriority(e.target.value))}
          >
            <option value="">All Move-in</option>
            {(c.MOVE_IN_PRIORITIES || []).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-center text-slate-400 py-16 text-sm">No inquiries found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Ref</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Mobile</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Requirement</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Budget</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Location</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Move-in</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Created</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedId(inq._id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-blue-600">{inq.inquiryRef}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{inq.fullName}</td>
                    <td className="px-4 py-3 text-slate-600">{inq.mobile}</td>
                    <td className="px-4 py-3 text-slate-600">{inq.requirementType}</td>
                    <td className="px-4 py-3 text-slate-600">{inq.monthlyBudget}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {[inq.location?.city, inq.location?.area].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{inq.moveInPriority || "—"}</td>
                    <td className="px-4 py-3"><InquiryStatusBadge status={inq.status} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(inq._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => dispatch(setPage(meta.page - 1))}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600">
                {meta.page} / {meta.totalPages}
              </span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => dispatch(setPage(meta.page + 1))}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <select
                className="h-8 px-2 rounded-lg border border-slate-300 text-xs"
                value={limit}
                onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n} / page</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {selectedId && (
        <InquiryDetailModal
          inquiryId={selectedId}
          onClose={() => setSelectedId(null)}
          onDeleted={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default AccommodationInquiriesTab;
