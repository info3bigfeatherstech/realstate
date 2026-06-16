import React from "react";

const STATUS_STYLES = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  closed: "bg-gray-100 text-gray-600",
  draft: "bg-slate-100 text-slate-500",
};

const InquiryStatusBadge = ({ status }) => {
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
  const style = STATUS_STYLES[status] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
};

export default InquiryStatusBadge;
