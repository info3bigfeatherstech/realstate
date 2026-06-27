import React, { useState } from "react";
import { X, Copy, Check, Loader2 } from "lucide-react";
import { useGetPropertyShareUrlsQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/userSocialApi/userSocialApi";
import { toast } from "../../../Shared/ToastConfig";
const PLATFORM_ICONS = {
  facebook: "📘",
  instagram: "📸",
  youtube: "▶️",
  linkedin: "💼",
  twitter: "🐦",
  whatsapp: "💬",
  telegram: "✈️",
  other: "🔗",
};
const PLATFORM_COLORS = {
  facebook:
    "hover:bg-blue-50 text-[#1877F2] border-blue-100 hover:border-blue-200",
  instagram:
    "hover:bg-pink-50 text-[#E4405F] border-pink-100 hover:border-pink-200",
  youtube: "hover:bg-red-50 text-[#FF0000] border-red-100 hover:border-red-200",
  linkedin:
    "hover:bg-sky-50 text-[#0A66C2] border-sky-100 hover:border-sky-200",
  twitter:
    "hover:bg-slate-50 text-[#1DA1F2] border-slate-100 hover:border-slate-300",
  whatsapp:
    "hover:bg-green-50 text-[#25D366] border-green-100 hover:border-green-200",
  telegram:
    "hover:bg-blue-50 text-[#0088cc] border-blue-100 hover:border-blue-200",
  other:
    "hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300",
};
const PropertyShareModal = ({ isOpen, onClose, propertyId }) => {
  const { data, isLoading, isError } = useGetPropertyShareUrlsQuery(
    propertyId,
    { skip: !propertyId || !isOpen },
  );
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const shareData = data || {};
  const shareLinks = shareData.shareLinks || [];
  const propertyUrl = shareData.propertyUrl || "";
  const handleCopyLink = async () => {
    if (!propertyUrl) return;
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      toast.success("Property link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {" "}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 transform transition-all duration-300 scale-100 flex flex-col gap-5">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between pb-1">
          {" "}
          <h3 className="text-lg font-bold text-slate-800">
            {" "}
            Share Property{" "}
          </h3>{" "}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {" "}
            <X className="w-5 h-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Content */}{" "}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            {" "}
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />{" "}
            <span className="text-xs text-slate-400">
              Generating sharing links...
            </span>{" "}
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-sm text-slate-500">
            {" "}
            Failed to generate property share links. Please try again.{" "}
          </div>
        ) : shareLinks.length === 0 ? (
          <div className="text-center py-6 text-sm text-slate-500">
            {" "}
            No sharing platforms configured. Copy the direct link below.{" "}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {" "}
            {shareLinks.map((link) => {
              const colorClass =
                PLATFORM_COLORS[link.platform] || PLATFORM_COLORS.other;
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${colorClass}`}
                >
                  {" "}
                  <span className="text-2xl select-none">
                    {" "}
                    {link.icon || PLATFORM_ICONS[link.platform] || "🔗"}{" "}
                  </span>{" "}
                  <span className="text-xs font-semibold capitalize tracking-wide truncate max-w-full">
                    {" "}
                    {link.label}{" "}
                  </span>{" "}
                </a>
              );
            })}{" "}
          </div>
        )}{" "}
        {/* Direct Link Copy section */}{" "}
        {propertyUrl && (
          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-slate-100">
            {" "}
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {" "}
              Direct Link{" "}
            </span>{" "}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3">
              {" "}
              <input
                type="text"
                readOnly
                value={propertyUrl}
                className="w-full text-xs bg-transparent outline-none text-slate-600 font-mono select-all"
              />{" "}
              <button
                onClick={handleCopyLink}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${copied ? "bg-green-600 text-white border-green-600" : "bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50"}`}
              >
                {" "}
                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default PropertyShareModal;
