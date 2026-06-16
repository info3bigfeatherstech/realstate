// src/tabs/DocumentsTab/UserKycTab/UserKycTab.jsx
import React, { useState } from "react";

const DOC_STATUSES = ["Pending", "Verified", "Rejected", "Expired"];

const STATUS_STYLES = {
  "Pending": "bg-amber-50 text-amber-600",
  "Verified": "bg-emerald-50 text-emerald-600",
  "Rejected": "bg-red-50 text-red-600",
  "Expired": "bg-slate-100 text-slate-500",
};

const MOCK_DOCS = [
  {
    id: "KYC0001",
    documentName: "Aadhaar Card",
    uploadedBy: "Rajesh Sharma",
    uploadedDate: "01 Jun 2026",
    status: "Verified",
    expiryDate: "—",
  },
  {
    id: "KYC0002",
    documentName: "PAN Card",
    uploadedBy: "Priya Patel",
    uploadedDate: "03 Jun 2026",
    status: "Pending",
    expiryDate: "—",
  },
  {
    id: "KYC0003",
    documentName: "Aadhaar Card",
    uploadedBy: "Amit Kumar",
    uploadedDate: "28 May 2026",
    status: "Rejected",
    expiryDate: "—",
  },
  {
    id: "KYC0004",
    documentName: "Passport",
    uploadedBy: "Neha Singh",
    uploadedDate: "15 Apr 2026",
    status: "Expired",
    expiryDate: "14 Apr 2026",
  },
];

const UserKycTab = () => {
  const [docs, setDocs] = useState(MOCK_DOCS);

  const handleStatusChange = (docId, newStatus) => {
    setDocs((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: newStatus } : doc))
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">User KYC</h3>
          <p className="text-sm text-slate-500 mt-1">Aadhaar, PAN and identity verification documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search by user, document..."
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64"
            />
          </div>
          <select className="px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100">
            <option>All Statuses</option>
            {DOC_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 pr-4 font-medium">Document Name</th>
              <th className="py-3 pr-4 font-medium">Uploaded By</th>
              <th className="py-3 pr-4 font-medium">Uploaded Date</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Expiry Date</th>
              <th className="py-3 pr-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                <td className="py-4 pr-4">
                  <div className="font-medium text-slate-800">{doc.documentName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">ID: {doc.id}</div>
                </td>
                <td className="py-4 pr-4 font-medium text-slate-700">{doc.uploadedBy}</td>
                <td className="py-4 pr-4 text-slate-500">{doc.uploadedDate}</td>
                <td className="py-4 pr-4">
                  <select
                    value={doc.status}
                    onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer ${STATUS_STYLES[doc.status] || "bg-slate-50 text-slate-600"}`}
                  >
                    {DOC_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-4 pr-4 text-slate-500">{doc.expiryDate}</td>
                <td className="py-4 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    <button title="View Document" className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button title="Download" className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                      </svg>
                    </button>
                    <button title="Verify / Reject" className="p-2 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button title="Request Renewal" className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserKycTab;