import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetInquiriesQuery,
  useGetInquiryStatsQuery,
} from "../../../Admin_Redux/GeneralInquiryApi/generalInquiryApi";
import {
  setPage,
  setLimit,
  setSearch,
  setStatus,
  resetFilters,
} from "../../../Admin_Redux/GeneralInquiryApi/generalInquirySlice";
import GeneralInquiryDetailModal from "./Shared/GeneralInquiryDetailModal";
const StatCard = ({
  label,
  value,
  color = "text-slate-800",
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
        {" "}
        <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />{" "}
        <div className="h-7 bg-slate-200 rounded w-3/4" />{" "}
      </div>
    );
  }
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      {" "}
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        {label}
      </p>{" "}
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value ?? 0}</p>{" "}
    </div>
  );
};
const InquiryStatusBadge = ({ status }) => {
  const styles = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    read: "bg-indigo-50 text-indigo-700 border-indigo-200",
    contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
    archived: "bg-slate-100 text-slate-700 border-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
    >
      {" "}
      {status ? status.toUpperCase() : "UNKNOWN"}{" "}
    </span>
  );
};
const GeneralInquiriesTab = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.generalInquiry);
  const { data: stats, isLoading: statsLoading } = useGetInquiryStatsQuery();
  const { data, isLoading, isFetching } = useGetInquiriesQuery(filters);
  const [selectedId, setSelectedId] = useState(null);
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const inquiries = data?.inquiries || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearch(localSearch));
  };
  const handleReset = () => {
    dispatch(resetFilters());
    setLocalSearch("");
  };
  return (
    <div className="p-6 space-y-6">
      {" "}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {" "}
        <div>
          {" "}
          <h3 className="text-lg font-semibold text-slate-800">
            General Inquiries
          </h3>{" "}
          <p className="text-sm text-slate-500">
            {" "}
            View and manage user-submitted general inquiries, contact forms, and
            support requests.{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
      {/* Stats Cards */}{" "}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {" "}
        <StatCard
          label="Total Inquiries"
          value={stats?.total}
          isLoading={statsLoading}
        />{" "}
        <StatCard
          label="New"
          value={stats?.new}
          color="text-blue-600"
          isLoading={statsLoading}
        />{" "}
        <StatCard
          label="Read"
          value={stats?.read}
          color="text-indigo-600"
          isLoading={statsLoading}
        />{" "}
        <StatCard
          label="Contacted"
          value={stats?.contacted}
          color="text-yellow-600"
          isLoading={statsLoading}
        />{" "}
        <StatCard
          label="Archived"
          value={stats?.archived}
          color="text-slate-500"
          isLoading={statsLoading}
        />{" "}
      </div>{" "}
      {/* Search & Filter Controls */}{" "}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
        {" "}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
          {" "}
          <div className="relative flex-1 min-w-[200px]">
            {" "}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />{" "}
            <input
              type="text"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
              placeholder="Search by name, contact, email, city or message..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />{" "}
          </div>{" "}
          <button
            type="submit"
            className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            {" "}
            Search{" "}
          </button>{" "}
          <button
            type="button"
            onClick={handleReset}
            className="h-10 px-4 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            {" "}
            <X className="w-4 h-4" /> Reset{" "}
          </button>{" "}
        </form>{" "}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {" "}
          <select
            className="h-9 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={filters.status || ""}
            onChange={(e) => dispatch(setStatus(e.target.value))}
          >
            {" "}
            <option value="">All Statuses</option>{" "}
            <option value="new">New</option> <option value="read">Read</option>{" "}
            <option value="contacted">Contacted</option>{" "}
            <option value="archived">Archived</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>{" "}
      {/* Main Table */}{" "}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {" "}
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-16">
            {" "}
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />{" "}
          </div>
        ) : inquiries.length === 0 ? (
          <p className="text-center text-slate-400 py-16 text-sm">
            No general inquiries found
          </p>
        ) : (
          <div className="overflow-x-auto">
            {" "}
            <table className="w-full text-sm">
              {" "}
              <thead>
                {" "}
                <tr className="bg-slate-50 border-b border-slate-200">
                  {" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Contact No.
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    City
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>{" "}
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>{" "}
                </tr>{" "}
              </thead>{" "}
              <tbody className="divide-y divide-slate-100">
                {" "}
                {inquiries.map((inq) => (
                  <tr
                    key={inq._id}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setSelectedId(inq._id)}
                  >
                    {" "}
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {" "}
                      {new Date(inq.createdAt).toLocaleDateString()}{" "}
                    </td>{" "}
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {inq.fullName}
                    </td>{" "}
                    <td className="px-4 py-3 text-slate-600">
                      {inq.contactNumber}
                    </td>{" "}
                    <td className="px-4 py-3 text-slate-600">
                      {inq.email || "—"}
                    </td>{" "}
                    <td className="px-4 py-3 text-slate-600">{inq.city}</td>{" "}
                    <td className="px-4 py-3 text-slate-700 truncate max-w-[150px]">
                      {inq.subject || "—"}
                    </td>{" "}
                    <td className="px-4 py-3">
                      <InquiryStatusBadge status={inq.status} />
                    </td>{" "}
                    <td className="px-4 py-3">
                      {" "}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(inq._id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="View Details"
                      >
                        {" "}
                        <Eye className="w-4 h-4" />{" "}
                      </button>{" "}
                    </td>{" "}
                  </tr>
                ))}{" "}
              </tbody>{" "}
            </table>{" "}
          </div>
        )}{" "}
        {/* Pagination Controls */}{" "}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            {" "}
            <p className="text-xs text-slate-400">
              {" "}
              Showing {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} of{" "}
              {meta.total}{" "}
            </p>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                disabled={meta.page <= 1}
                onClick={() => dispatch(setPage(meta.page - 1))}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                {" "}
                <ChevronLeft className="w-4 h-4" />{" "}
              </button>{" "}
              <span className="text-sm text-slate-600">
                {" "}
                {meta.page} / {meta.totalPages}{" "}
              </span>{" "}
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => dispatch(setPage(meta.page + 1))}
                className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                {" "}
                <ChevronRight className="w-4 h-4" />{" "}
              </button>{" "}
              <select
                className="h-8 px-2 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none"
                value={filters.limit}
                onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
              >
                {" "}
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
      {selectedId && (
        <GeneralInquiryDetailModal
          inquiryId={selectedId}
          onClose={() => setSelectedId(null)}
          onDeleted={() => setSelectedId(null)}
        />
      )}{" "}
    </div>
  );
};
export default GeneralInquiriesTab;
