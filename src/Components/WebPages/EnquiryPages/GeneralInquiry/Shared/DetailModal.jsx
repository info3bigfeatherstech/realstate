import React from "react";
import { CheckCircle2, X } from "lucide-react";
const DetailModal = ({ isOpen, onClose, inquiry }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {" "}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">
        {" "}
        {/* Header decoration */} <div className="h-2 bg-blue-600" />{" "}
        {/* Close Button */}{" "}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {" "}
          <X className="w-5 h-5" />{" "}
        </button>{" "}
        {/* Modal Content */}{" "}
        <div className="p-6 text-center">
          {" "}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-600 mb-4">
            {" "}
            <CheckCircle2 className="w-8 h-8" />{" "}
          </div>{" "}
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {" "}
            Inquiry Submitted!{" "}
          </h3>{" "}
          <p className="text-sm text-slate-500 mb-6">
            {" "}
            Thank you for reaching out. Our team will review your inquiry and
            contact you shortly.{" "}
          </p>{" "}
          {inquiry && (
            <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 mb-6 space-y-2">
              {" "}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {" "}
                Submission Info{" "}
              </p>{" "}
              <div className="grid grid-cols-3 text-xs">
                {" "}
                <span className="text-slate-500 col-span-1">Name:</span>{" "}
                <span className="font-semibold text-slate-800 col-span-2">
                  {inquiry.fullName}
                </span>{" "}
              </div>{" "}
              <div className="grid grid-cols-3 text-xs">
                {" "}
                <span className="text-slate-500 col-span-1">Status:</span>{" "}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 w-fit col-span-2">
                  {" "}
                  {inquiry.status || "new"}{" "}
                </span>{" "}
              </div>{" "}
              <div className="grid grid-cols-3 text-xs">
                {" "}
                <span className="text-slate-500 col-span-1">Date:</span>{" "}
                <span className="font-semibold text-slate-800 col-span-2">
                  {" "}
                  {inquiry.createdAt
                    ? new Date(inquiry.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}{" "}
                </span>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            {" "}
            Okay, got it{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default DetailModal;
