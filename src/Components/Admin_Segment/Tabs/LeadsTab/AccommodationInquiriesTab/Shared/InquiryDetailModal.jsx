import React, { useEffect, useState } from "react";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import {
  useGetInquiryByIdQuery,
  useUpdateInquiryStatusMutation,
  useUpdateInquiryNotesMutation,
  useDeleteInquiryMutation,
} from "../../../../Admin_Redux/AccommodationInquiryApi/accommodationInquiryApi";
import { useGetUsersQuery } from "../../../../../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";
import InquiryStatusBadge from "./InquiryStatusBadge";
import { toast, getApiErrorMessage } from "../../../../../Shared/ToastConfig";
const ADMIN_STATUSES = ["new", "contacted", "converted", "lost", "closed"];
const DetailRow = ({ label, value }) => (
  <div>
    {" "}
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
      {label}
    </p>{" "}
    <p className="text-sm text-slate-700 mt-0.5">{value || "—"}</p>{" "}
  </div>
);
const InquiryDetailModal = ({ inquiryId, onClose, onDeleted }) => {
  const {
    data: inquiry,
    isLoading,
    isFetching,
  } = useGetInquiryByIdQuery(inquiryId, { skip: !inquiryId });
  const { data: users = [] } = useGetUsersQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateInquiryStatusMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteInquiryMutation();
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [inquirySource, setInquirySource] = useState("website");
  const [internalRemarks, setInternalRemarks] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  useEffect(() => {
    if (inquiry) {
      setStatus(inquiry.status || "new");
      setAdminNotes(inquiry.adminNotes || "");
      setPriority(inquiry.priority || "medium");
      setAssignedTo(inquiry.assignedTo?._id || inquiry.assignedTo || "");
      setInquirySource(inquiry.inquirySource || "website");
      setInternalRemarks(inquiry.internalRemarks || "");
      setFollowUpNotes(inquiry.followUpNotes || "");
    }
  }, [inquiry]);
  const handleSave = async () => {
    try {
      await updateStatus({
        id: inquiryId,
        status,
        priority,
        assignedTo: assignedTo || null,
        inquirySource,
        adminNotes,
        internalRemarks,
        followUpNotes,
      }).unwrap();
      toast.success("Inquiry updated successfully");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update inquiry"));
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
      toast.error(getApiErrorMessage(err, "Failed to delete inquiry"));
    }
  };
  if (!inquiryId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {" "}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {" "}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          {" "}
          <div>
            {" "}
            <h2 className="text-lg font-bold text-slate-800">
              Inquiry Details
            </h2>{" "}
            {inquiry?.inquiryRef && (
              <p className="text-xs text-slate-400 mt-0.5">
                {inquiry.inquiryRef}
              </p>
            )}{" "}
          </div>{" "}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100"
          >
            {" "}
            <X className="w-5 h-5 text-slate-500" />{" "}
          </button>{" "}
        </div>{" "}
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
              <div className="flex flex-wrap items-center gap-3">
                {" "}
                <InquiryStatusBadge status={inquiry.status} />{" "}
                {inquiry.priority && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${inquiry.priority === "high" ? "bg-red-50 text-red-700 border-red-200" : inquiry.priority === "medium" ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-green-50 text-green-700 border-green-200"}`}
                  >
                    {" "}
                    Priority:{" "}
                    {inquiry.priority === "high"
                      ? "High 🔴"
                      : inquiry.priority === "medium"
                        ? "Medium 🟠"
                        : "Low 🟢"}{" "}
                  </span>
                )}{" "}
                {inquiry.inquirySource && (
                  <span className="text-xs px-2.5 py-1 rounded-lg font-semibold border bg-slate-50 text-slate-600 border-slate-200">
                    {" "}
                    Source:{" "}
                    {inquiry.inquirySource
                      .replace(/_/g, " ")
                      .toUpperCase()}{" "}
                  </span>
                )}{" "}
                <span className="text-xs text-slate-400">
                  {" "}
                  Created {new Date(inquiry.createdAt).toLocaleString()}{" "}
                </span>{" "}
              </div>{" "}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {" "}
                <DetailRow label="Full Name" value={inquiry.fullName} />{" "}
                <DetailRow label="Mobile" value={inquiry.mobile} />{" "}
                <DetailRow label="Email" value={inquiry.email} />{" "}
                <DetailRow
                  label="Alt. Mobile"
                  value={inquiry.alternativeMobile}
                />{" "}
                <DetailRow
                  label="Requirement"
                  value={inquiry.requirementType}
                />{" "}
                <DetailRow label="Occupant Type" value={inquiry.occupantType} />{" "}
                <DetailRow
                  label="Gender Pref."
                  value={inquiry.genderPreference}
                />{" "}
                <DetailRow label="City" value={inquiry.location?.city} />{" "}
                <DetailRow label="Area" value={inquiry.location?.area} />{" "}
                <DetailRow
                  label="Landmark"
                  value={inquiry.location?.landmark}
                />{" "}
                <DetailRow
                  label="Monthly Budget"
                  value={inquiry.monthlyBudget}
                />{" "}
                <DetailRow
                  label="Move-in Priority"
                  value={inquiry.moveInPriority}
                />{" "}
                <DetailRow label="Property Type" value={inquiry.propertyType} />{" "}
                <DetailRow label="BHK" value={inquiry.bhkRequirement} />{" "}
                <DetailRow
                  label="Sharing Pref."
                  value={inquiry.sharingPreference}
                />{" "}
                <DetailRow
                  label="Tenant Type"
                  value={inquiry.tenantTypePreference}
                />{" "}
                <DetailRow label="Food" value={inquiry.foodPreference} />{" "}
                <DetailRow label="Pets" value={inquiry.petPreference} />{" "}
                <DetailRow label="Smoking" value={inquiry.smokingPreference} />{" "}
                <DetailRow label="Alcohol" value={inquiry.alcoholPreference} />{" "}
                <DetailRow
                  label="Furnishing"
                  value={inquiry.furnishingPreference}
                />{" "}
              </div>{" "}
              {inquiry.amenitiesRequired?.length > 0 && (
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Amenities
                  </p>{" "}
                  <div className="flex flex-wrap gap-1.5">
                    {" "}
                    {inquiry.amenitiesRequired.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                      >
                        {a}
                      </span>
                    ))}{" "}
                  </div>{" "}
                </div>
              )}{" "}
              {(inquiry.remarks || inquiry.message) && (
                <div className="space-y-3">
                  {" "}
                  {inquiry.remarks && (
                    <DetailRow label="Remarks" value={inquiry.remarks} />
                  )}{" "}
                  {inquiry.message && (
                    <DetailRow label="Message" value={inquiry.message} />
                  )}{" "}
                </div>
              )}{" "}
              {inquiry.attachments?.length > 0 && (
                <div>
                  {" "}
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    Attachments
                  </p>{" "}
                  <div className="space-y-1.5">
                    {" "}
                    {inquiry.attachments.map((att, i) => (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {" "}
                        {att.originalFileName || att.fileName} ({att.kind}){" "}
                      </a>
                    ))}{" "}
                  </div>{" "}
                </div>
              )}{" "}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                {" "}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Admin Action & Controls
                </p>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {" "}
                  {/* Status Dropdown */}{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Status
                    </label>{" "}
                    <select
                      className="mt-1 block w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {" "}
                      {ADMIN_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}{" "}
                    </select>{" "}
                  </div>{" "}
                  {/* Priority Dropdown */}{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Lead Priority
                    </label>{" "}
                    <select
                      className="mt-1 block w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {" "}
                      <option value="high">🔴 High</option>{" "}
                      <option value="medium">🟠 Medium</option>{" "}
                      <option value="low">🟢 Low</option>{" "}
                    </select>{" "}
                  </div>{" "}
                  {/* Assigned To Dropdown */}{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Assigned To (Staff)
                    </label>{" "}
                    <select
                      className="mt-1 block w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    >
                      {" "}
                      <option value="">Unassigned</option>{" "}
                      {(users || []).map((u) => (
                        <option key={u._id} value={u._id}>
                          {" "}
                          {u.name} ({u.role}){" "}
                        </option>
                      ))}{" "}
                    </select>{" "}
                  </div>{" "}
                  {/* Inquiry Source Dropdown */}{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Inquiry Source
                    </label>{" "}
                    <select
                      className="mt-1 block w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={inquirySource}
                      onChange={(e) => setInquirySource(e.target.value)}
                    >
                      {" "}
                      <option value="website">Website</option>{" "}
                      <option value="mobile_app">Mobile App</option>{" "}
                      <option value="whatsapp">WhatsApp</option>{" "}
                      <option value="phone_call">Phone Call</option>{" "}
                      <option value="walk_in">Walk-In</option>{" "}
                      <option value="facebook">Facebook</option>{" "}
                      <option value="instagram">Instagram</option>{" "}
                      <option value="google_ads">Google Ads</option>{" "}
                      <option value="referral">Referral</option>{" "}
                      <option value="broker">Broker</option>{" "}
                      <option value="other">Other</option>{" "}
                    </select>{" "}
                  </div>{" "}
                </div>{" "}
                {/* Textareas */}{" "}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Admin Notes (General)
                    </label>{" "}
                    <textarea
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                      rows={3}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      maxLength={2000}
                      placeholder="General internal notes..."
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Follow-up Notes
                    </label>{" "}
                    <textarea
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                      rows={3}
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                      maxLength={2000}
                      placeholder="Notes about last or next follow-up..."
                    />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <label className="text-xs font-semibold text-slate-500">
                      Team Comments / Internal Remarks
                    </label>{" "}
                    <textarea
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100"
                      rows={3}
                      value={internalRemarks}
                      onChange={(e) => setInternalRemarks(e.target.value)}
                      maxLength={2000}
                      placeholder="Team discussions, observations..."
                    />{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex justify-end">
                  {" "}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    {" "}
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}{" "}
                    Save Admin Changes{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </>
          ) : (
            <p className="text-center text-slate-500 py-8">Inquiry not found</p>
          )}{" "}
        </div>{" "}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
          {" "}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 px-4 rounded-lg border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center gap-1.5"
          >
            {" "}
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}{" "}
            Delete{" "}
          </button>{" "}
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            {" "}
            Close{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default InquiryDetailModal;
