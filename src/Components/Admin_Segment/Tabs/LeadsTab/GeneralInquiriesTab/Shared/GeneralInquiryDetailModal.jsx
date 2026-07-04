import React, { useEffect, useState } from "react";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} from "../../../../Admin_Redux/GeneralInquiryApi/generalInquiryApi";
import { toast, getApiErrorMessage } from "../../../../../Shared/ToastConfig";
const DetailRow = ({ label, value }) => (
  <div>
    {" "}
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
      {label}
    </p>{" "}
    <p className="text-sm text-slate-700 mt-0.5 break-words">
      {" "}
      {value === null || value === undefined || value === ""
        ? "—"
        : String(value)}{" "}
    </p>{" "}
  </div>
);
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
const GeneralInquiryDetailModal = ({ inquiryId, onClose, onDeleted }) => {
  const {
    data: inquiry,
    isLoading,
    isFetching,
  } = useGetInquiryByIdQuery(inquiryId, { skip: !inquiryId });
  const [updateInquiryStatus, { isLoading: isUpdating }] =
    useUpdateInquiryStatusMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();
  const [status, setStatus] = useState("new");
  const [adminNotes, setAdminNotes] = useState("");
  const statusOptions = ["new", "read", "contacted", "archived"];
  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "new");
      setAdminNotes(inquiry.adminNotes || "");
    }
  }, [inquiry]);
  const handleSave = async () => {
    try {
      await updateInquiryStatus({ id: inquiryId, status, adminNotes }).unwrap();
      toast.success("General inquiry updated successfully");
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update inquiry"));
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      await deleteInquiry(inquiryId).unwrap();
      toast.success("General inquiry deleted");
      onDeleted?.();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete inquiry"));
    }
  };
  if (!inquiryId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {" "}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          {" "}
          <div>
            {" "}
            <h2 className="text-lg font-bold text-slate-800">
              General Inquiry Details
            </h2>{" "}
            <p className="text-xs text-slate-400 mt-0.5">
              Manage user-submitted contact message
            </p>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {" "}
            <X className="w-5 h-5 text-slate-500" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {" "}
          {(isLoading || isFetching) && !inquiry ? (
            <div className="flex justify-center py-12">
              {" "}
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />{" "}
            </div>
          ) : inquiry ? (
            <>
              {" "}
              <div className="flex flex-wrap items-center gap-3 pb-2">
                {" "}
                <InquiryStatusBadge status={inquiry.status} />{" "}
                <span className="text-xs text-slate-400">
                  {" "}
                  Submitted on{" "}
                  {new Date(inquiry.createdAt).toLocaleString()}{" "}
                </span>{" "}
                {inquiry.source && (
                  <span className="text-xs text-slate-400 bg-slate-50 border px-2 py-0.5 rounded-md">
                    {" "}
                    Source: {inquiry.source.toUpperCase()}{" "}
                  </span>
                )}{" "}
              </div>{" "}
              {/* Grid of Details */}{" "}
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <DetailRow label="Full Name" value={inquiry.fullName} />{" "}
                <DetailRow
                  label="Contact Number"
                  value={inquiry.contactNumber}
                />{" "}
                <DetailRow label="Email" value={inquiry.email} />{" "}
                <DetailRow label="City" value={inquiry.city} />{" "}
                <div className="col-span-2">
                  {" "}
                  <DetailRow label="Subject" value={inquiry.subject} />{" "}
                </div>{" "}
              </div>{" "}
              {/* Message Block */}{" "}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                {" "}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Message
                </p>{" "}
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {inquiry.message}
                </p>{" "}
              </div>{" "}
              {/* Status Update section */}{" "}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                {" "}
                <div className="flex flex-wrap items-end gap-3">
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      {" "}
                      Update Status{" "}
                    </label>{" "}
                    <select
                      className="mt-1 block h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {" "}
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {" "}
                          {s.toUpperCase()}{" "}
                        </option>
                      ))}{" "}
                    </select>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                  >
                    {" "}
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}{" "}
                    Save Changes{" "}
                  </button>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {" "}
                    Admin Notes{" "}
                  </label>{" "}
                  <textarea
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    maxLength={2000}
                    placeholder="Add internal notes about this lead..."
                  />{" "}
                </div>{" "}
              </div>{" "}
            </>
          ) : (
            <p className="text-center text-slate-500 py-8">Inquiry not found</p>
          )}{" "}
        </div>{" "}
        {/* Footer */}{" "}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between bg-slate-50 rounded-b-xl">
          {" "}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
          >
            {" "}
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}{" "}
            Delete Inquiry{" "}
          </button>{" "}
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-100 bg-white transition-colors"
          >
            {" "}
            Close{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default GeneralInquiryDetailModal;
