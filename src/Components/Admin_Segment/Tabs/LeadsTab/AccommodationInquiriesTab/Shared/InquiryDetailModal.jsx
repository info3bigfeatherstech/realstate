import React, { useEffect, useState } from "react";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useUpdateInquiryNotesMutation,
  useDeleteInquiryMutation,
} from "../../../../Admin_Redux/AccommodationInquiryApi/accommodationInquiryApi";
import InquiryStatusBadge from "./InquiryStatusBadge";
import { toast } from "../../../../../Shared/ToastConfig";

const ADMIN_STATUSES = ["new", "contacted", "converted", "lost", "closed"];

const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm text-slate-700 mt-0.5">{value || "—"}</p>
  </div>
);

const InquiryDetailModal = ({ inquiryId, onClose, onDeleted }) => {
  const { data: inquiry, isLoading, isFetching } = useGetInquiryByIdQuery(inquiryId, {
    skip: !inquiryId,
  });
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateInquiryStatusMutation();
  const [updateNotes, { isLoading: isUpdatingNotes }] = useUpdateInquiryNotesMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();

  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "new");
      setAdminNotes(inquiry.adminNotes || "");
    }
  }, [inquiry]);

  const handleStatusSave = async () => {
    try {
      await updateStatus({ id: inquiryId, status, adminNotes }).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleNotesSave = async () => {
    try {
      await updateNotes({ id: inquiryId, adminNotes }).unwrap();
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save notes");
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
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100">
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
              <div className="flex items-center gap-3">
                <InquiryStatusBadge status={inquiry.status} />
                <span className="text-xs text-slate-400">
                  Created {new Date(inquiry.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <DetailRow label="Full Name" value={inquiry.fullName} />
                <DetailRow label="Mobile" value={inquiry.mobile} />
                <DetailRow label="Email" value={inquiry.email} />
                <DetailRow label="Alt. Mobile" value={inquiry.alternativeMobile} />
                <DetailRow label="Requirement" value={inquiry.requirementType} />
                <DetailRow label="Occupant Type" value={inquiry.occupantType} />
                <DetailRow label="Gender Pref." value={inquiry.genderPreference} />
                <DetailRow label="City" value={inquiry.location?.city} />
                <DetailRow label="Area" value={inquiry.location?.area} />
                <DetailRow label="Landmark" value={inquiry.location?.landmark} />
                <DetailRow label="Monthly Budget" value={inquiry.monthlyBudget} />
                <DetailRow label="Move-in Priority" value={inquiry.moveInPriority} />
                <DetailRow label="Property Type" value={inquiry.propertyType} />
                <DetailRow label="BHK" value={inquiry.bhkRequirement} />
                <DetailRow label="Sharing Pref." value={inquiry.sharingPreference} />
                <DetailRow label="Tenant Type" value={inquiry.tenantTypePreference} />
                <DetailRow label="Food" value={inquiry.foodPreference} />
                <DetailRow label="Pets" value={inquiry.petPreference} />
                <DetailRow label="Smoking" value={inquiry.smokingPreference} />
                <DetailRow label="Alcohol" value={inquiry.alcoholPreference} />
                <DetailRow label="Furnishing" value={inquiry.furnishingPreference} />
              </div>

              {inquiry.amenitiesRequired?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {inquiry.amenitiesRequired.map((a) => (
                      <span key={a} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{a}</span>
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
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Attachments</p>
                  <div className="space-y-1.5">
                    {inquiry.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {att.originalFileName || att.fileName} ({att.kind})
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</label>
                    <select
                      className="mt-1 block h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {ADMIN_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleStatusSave}
                    disabled={isUpdatingStatus}
                    className="h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Status
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Admin Notes</label>
                  <textarea
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    maxLength={2000}
                    placeholder="Internal notes..."
                  />
                  <button
                    onClick={handleNotesSave}
                    disabled={isUpdatingNotes}
                    className="mt-2 h-9 px-4 rounded-lg border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isUpdatingNotes && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Notes
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-slate-500 py-8">Inquiry not found</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Delete
          </button>
          <button
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

export default InquiryDetailModal;
