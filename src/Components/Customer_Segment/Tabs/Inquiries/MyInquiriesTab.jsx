// src/Components/Customer_Segment/Tabs/Inquiries/MyInquiriesTab.jsx
import React, { useState } from "react";
import { useGetMyInquiriesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInquiryApi/customerInquiryApi";
import { FORM_TYPE_META } from "../../../../utils/inquiryForm";
import { Loader2, FileText, MapPin, Calendar, Clipboard, X } from "lucide-react";
import InquiryStatusBadge from "../../../Admin_Segment/Tabs/LeadsTab/AccommodationInquiriesTab/Shared/InquiryStatusBadge";

const MyInquiriesTab = () => {
  const [page, setPage] = useState(1);
  const { data = {}, isLoading, isFetching } = useGetMyInquiriesQuery({ page, limit: 10 });
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const inquiries = data?.inquiries || [];
  const meta = data?.meta || { totalPages: 1 };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Inquiry Submissions</h2>
          {isFetching && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
        </div>

        {inquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Clipboard className="w-5 h-5" />
            </div>
            <p className="text-slate-500 font-medium">No inquiries submitted yet.</p>
            <p className="text-slate-400 text-sm">Create an inquiry from the sidebar options to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Form / Requirement</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {inquiries.map((inq) => {
                  const formMeta = FORM_TYPE_META[inq.formType] || { label: inq.formType };
                  return (
                    <tr key={inq._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900 text-xs">
                        {inq.inquiryRef || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{formMeta.label}</div>
                        {inq.saveAsDraft && (
                          <span className="inline-block text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold mt-1">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{inq.location?.city || "N/A"}, {inq.location?.area || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(inq.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <InquiryStatusBadge status={inq.saveAsDraft ? "draft" : inq.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Page {page} of {meta.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Inquiry Full Details</h3>
                <p className="text-xs font-mono font-semibold text-slate-400 mt-0.5">
                  Ref: {selectedInquiry.inquiryRef || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600">
              {/* Header Info */}
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">
                    {FORM_TYPE_META[selectedInquiry.formType]?.label || selectedInquiry.formType}
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                </div>
                <div className="sm:ml-auto">
                  <InquiryStatusBadge status={selectedInquiry.saveAsDraft ? "draft" : selectedInquiry.status} />
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                  Personal & Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Full Name</span>
                    <span className="font-semibold text-slate-700">{selectedInquiry.contact?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Mobile Number</span>
                    <span className="font-semibold text-slate-700">{selectedInquiry.contact?.mobile}</span>
                  </div>
                  {selectedInquiry.contact?.email && (
                    <div>
                      <span className="text-xs text-slate-400 block">Email Address</span>
                      <span className="font-semibold text-slate-700">{selectedInquiry.contact.email}</span>
                    </div>
                  )}
                  {selectedInquiry.contact?.alternativeMobile && (
                    <div>
                      <span className="text-xs text-slate-400 block">Alt. Mobile</span>
                      <span className="font-semibold text-slate-700">{selectedInquiry.contact.alternativeMobile}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                  Preferred Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">City</span>
                    <span className="font-semibold text-slate-700">{selectedInquiry.location?.city || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Area</span>
                    <span className="font-semibold text-slate-700">{selectedInquiry.location?.area || "N/A"}</span>
                  </div>
                  {selectedInquiry.location?.landmark && (
                    <div>
                      <span className="text-xs text-slate-400 block">Landmark</span>
                      <span className="font-semibold text-slate-700">{selectedInquiry.location.landmark}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payload/Requirements Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                  Inquiry Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                  {Object.entries(selectedInquiry.payload || {}).map(([key, value]) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase());
                    
                    let renderedValue = "";
                    if (Array.isArray(value)) {
                      renderedValue = value.length > 0 ? value.join(", ") : "None";
                    } else if (typeof value === "object" && value !== null) {
                      renderedValue = `${value.value} ${value.unit || ""}`;
                    } else {
                      renderedValue = String(value || "N/A");
                    }

                    return (
                      <div key={key}>
                        <span className="text-xs text-slate-400 block">{formattedKey}</span>
                        <span className="font-semibold text-slate-700">{renderedValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remarks/Message */}
              {(selectedInquiry.remarks || selectedInquiry.message) && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
                    Remarks & Message
                  </h4>
                  <div className="space-y-3">
                    {selectedInquiry.remarks && (
                      <div>
                        <span className="text-xs text-slate-400 block">Remarks</span>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {selectedInquiry.remarks}
                        </p>
                      </div>
                    )}
                    {selectedInquiry.message && (
                      <div>
                        <span className="text-xs text-slate-400 block">Additional Details</span>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInquiriesTab;
