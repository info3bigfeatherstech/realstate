import React, { useEffect, useState } from "react";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} from "../../../Admin_Redux/InquiryApi/inquiryApi";
import InquiryStatusBadge from "../AccommodationInquiriesTab/Shared/InquiryStatusBadge";
import { toast } from "../../../../Shared/ToastConfig";

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm text-slate-700 mt-0.5 break-words">
      {value === null || value === undefined || value === "" ? "—" : String(value)}
    </p>
  </div>
);

const formatPayloadValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") {
    if (value.value !== undefined && value.unit !== undefined) {
      return `${value.value} ${value.unit}`;
    }
    return JSON.stringify(value);
  }
  return String(value);
};

const payloadLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const UnifiedInquiryDetailModal = ({ inquiryId, onClose, onDeleted, adminStatuses = [] }) => {
  const { data: inquiry, isLoading, isFetching } = useGetInquiryByIdQuery(inquiryId, {
    skip: !inquiryId,
  });
  const [updateInquiry, { isLoading: isUpdating }] = useUpdateInquiryMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();

  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const statusOptions =
    adminStatuses.length > 0
      ? adminStatuses
      : ["new", "contacted", "follow_up_required", "converted", "closed", "lost", "rejected"];

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "new");
      setAdminNotes(inquiry.adminNotes || "");
    }
  }, [inquiry]);

  const handleSave = async () => {
    try {
      await updateInquiry({ id: inquiryId, status, adminNotes }).unwrap();
      toast.success("Inquiry updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update inquiry");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      await deleteInquiry(inquiryId).unwrap();
      toast.success("Inquiry deleted");
      onDeleted?.();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete inquiry");
    }
  };

  if (!inquiryId) return null;

  const payload = inquiry?.payload || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Inquiry Details</h2>
            {inquiry?.inquiryRef && (
              <p className="text-xs text-slate-400 mt-0.5">{inquiry.inquiryRef}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {(isLoading || isFetching) && !inquiry ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : inquiry ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <InquiryStatusBadge status={inquiry.status} />
                <span className="text-xs text-slate-500 capitalize">
                  {inquiry.formType?.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-slate-400">
                  Created {new Date(inquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailRow label="Full Name" value={inquiry.contact?.fullName} />
                <DetailRow label="Mobile" value={inquiry.contact?.mobile} />
                <DetailRow label="Email" value={inquiry.contact?.email} />
                <DetailRow label="Alt. Mobile" value={inquiry.contact?.alternativeMobile} />
                <DetailRow label="City" value={inquiry.location?.city} />
                <DetailRow label="Area" value={inquiry.location?.area} />
                <DetailRow label="Landmark" value={inquiry.location?.landmark} />
                <DetailRow label="Address" value={inquiry.location?.address} />
              </div>

              {Object.keys(payload).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Form Details
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(payload).map(([key, value]) => (
                      <DetailRow
                        key={key}
                        label={payloadLabel(key)}
                        value={formatPayloadValue(value)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {(inquiry.remarks || inquiry.message) && (
                <div className="space-y-3">
                  {inquiry.remarks && <DetailRow label="Remarks" value={inquiry.remarks} />}
                  {inquiry.message && <DetailRow label="Message" value={inquiry.message} />}
                </div>
              )}

              {inquiry.attachments?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Attachments
                  </p>
                  <div className="space-y-1.5">
                    {inquiry.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {att.originalFileName || att.fileName} ({att.category || att.kind || "file"})
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Status
                    </label>
                    <select
                      className="mt-1 block h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Admin Notes
                  </label>
                  <textarea
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    maxLength={2000}
                    placeholder="Internal notes..."
                  />
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-slate-500 py-8">Inquiry not found</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedInquiryDetailModal;
