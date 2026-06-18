import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, Loader2, FileDown, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { toast } from "../../../../Shared/ToastConfig";
import { useGetConstantsQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import {
    useGetBuyPropertyInquiriesQuery,
    useGetBuyPropertyInquiryStatsQuery,
} from "../../../Admin_Redux/BuyPropertyInquiryApi/buyPropertyInquiryApi";
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
} from "../../../Admin_Redux/BuyPropertyInquiryApi/buyPropertyInquirySlice";
import InquiryStatusBadge from "../AccommodationInquiriesTab/Shared/InquiryStatusBadge";
import UnifiedInquiryDetailModal from "../Shared/UnifiedInquiryDetailModal";
import { downloadBuyPropertyTemplate } from "./downloadBuyPropertyTemplate";

// ─── Stat Card Component ──────────────────────────────────────────────
const StatCard = ({ label, value, color = "text-slate-800", isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-7 bg-slate-200 rounded w-3/4" />
            </div>
        );
    }
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value ?? 0}</p>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────
const BuyPropertyInquiriesTab = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.buyPropertyInquiry);
    const { data: constants, isLoading: constantsLoading } = useGetConstantsQuery();
    const { data: stats, isLoading: statsLoading } = useGetBuyPropertyInquiryStatsQuery();
    const { data, isLoading, isFetching } = useGetBuyPropertyInquiriesQuery(filters);

    const [selectedId, setSelectedId] = useState(null);
    const [localSearch, setLocalSearch] = useState(filters.search || "");
    const [isDownloading, setIsDownloading] = useState(false);

    const inquiries = data?.inquiries || [];
    const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };
    const c = constants || {};
    const breakdown = stats?.statusBreakdown || {};

    // ─── Handlers ──────────────────────────────────────────────────────
    const handleDownloadTemplate = async () => {
        setIsDownloading(true);
        try {
            await downloadBuyPropertyTemplate();
            toast.success("Buy Property form template downloaded");
        } catch (err) {
            toast.error(err?.message || "Failed to generate PDF template");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setSearch(localSearch));
    };

    const handleReset = () => {
        dispatch(resetFilters());
        setLocalSearch("");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= meta.totalPages) {
            dispatch(setPage(newPage));
        }
    };

    const handleLimitChange = (newLimit) => {
        dispatch(setLimit(newLimit));
    };

    // ─── Render ──────────────────────────────────────────────────────
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Buy Property Inquiries</h3>
                    <p className="text-sm text-slate-500">
                        Print-friendly offline form with all fields and options (radio / checkbox format).
                    </p>
                </div>
                <button
                    onClick={handleDownloadTemplate}
                    disabled={isDownloading}
                    className="h-10 px-4 rounded-lg border border-blue-600 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                    {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <FileDown className="w-4 h-4" />
                    )}
                    Download Template
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total" value={stats?.totalInquiries} isLoading={statsLoading} />
                <StatCard label="New" value={breakdown.new} color="text-blue-600" isLoading={statsLoading} />
                <StatCard label="Contacted" value={breakdown.contacted} color="text-yellow-600" isLoading={statsLoading} />
                <StatCard label="Converted" value={breakdown.converted} color="text-green-600" isLoading={statsLoading} />
                <StatCard label="Lost" value={breakdown.lost} color="text-red-600" isLoading={statsLoading} />
                <StatCard label="Closed" value={breakdown.closed} color="text-gray-500" isLoading={statsLoading} />
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            placeholder="Search name, mobile, ref, city..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    >
                        <X className="w-4 h-4" />
                        Reset
                    </button>
                </form>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    <select
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={filters.status || ""}
                        onChange={(e) => dispatch(setStatus(e.target.value))}
                    >
                        <option value="">All Statuses</option>
                        {(c.ADMIN_INQUIRY_STATUSES || ["new", "contacted", "converted", "lost", "closed"]).map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={filters.requirementType || ""}
                        onChange={(e) => dispatch(setRequirementType(e.target.value))}
                    >
                        <option value="">All Requirements</option>
                        {(c.REQUIREMENT_TYPES || []).map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <select
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={filters.occupantType || ""}
                        onChange={(e) => dispatch(setOccupantType(e.target.value))}
                    >
                        <option value="">All Occupants</option>
                        {(c.OCCUPANT_TYPES || []).map((o) => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                        placeholder="City"
                        value={filters.city || ""}
                        onChange={(e) => dispatch(setCity(e.target.value))}
                    />

                    <select
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={filters.monthlyBudget || ""}
                        onChange={(e) => dispatch(setMonthlyBudget(e.target.value))}
                    >
                        <option value="">All Budgets</option>
                        {(c.MONTHLY_BUDGETS || []).map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>

                    <select
                        className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={filters.moveInPriority || ""}
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
                    <p className="text-center text-slate-400 py-16 text-sm">No buy property inquiries found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ref</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobile</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requirement</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inquiries.map((inq) => (
                                    <tr
                                        key={inq._id}
                                        className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                                        onClick={() => setSelectedId(inq._id)}
                                    >
                                        <td className="px-4 py-3 font-mono text-xs text-blue-600">{inq.inquiryRef}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{inq.contact?.fullName}</td>
                                        <td className="px-4 py-3 text-slate-600">{inq.contact?.mobile}</td>
                                        <td className="px-4 py-3 text-slate-600">{inq.formType?.replace(/_/g, " ")}</td>
                                        <td className="px-4 py-3 text-slate-600">{inq.payload?.budgetRange}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {[inq.location?.city, inq.location?.area].filter(Boolean).join(", ") || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{inq.payload?.priority}</td>
                                        <td className="px-4 py-3">
                                            <InquiryStatusBadge status={inq.status} />
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs">
                                            {new Date(inq.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedId(inq._id);
                                                }}
                                                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
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
                    <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-slate-200 gap-2">
                        <p className="text-xs text-slate-400">
                            Showing {(meta.page - 1) * meta.limit + 1}–
                            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                disabled={meta.page <= 1 || isFetching}
                                onClick={() => handlePageChange(meta.page - 1)}
                                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-slate-600">
                                {meta.page} / {meta.totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={meta.page >= meta.totalPages || isFetching}
                                onClick={() => handlePageChange(meta.page + 1)}
                                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <select
                                className="h-8 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                value={filters.limit}
                                onChange={(e) => handleLimitChange(Number(e.target.value))}
                            >
                                {[10, 20, 50].map((size) => (
                                    <option key={size} value={size}>{size} / page</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedId && (
                <UnifiedInquiryDetailModal
                    inquiryId={selectedId}
                    onClose={() => setSelectedId(null)}
                    onDeleted={() => setSelectedId(null)}
                    adminStatuses={c.ADMIN_INQUIRY_STATUSES}
                />
            )}
        </div>
    );
};

export default BuyPropertyInquiriesTab;