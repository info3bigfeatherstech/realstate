import React, { useState } from "react";
import { Flame, Loader2, Eye, ShieldCheck, HelpCircle } from "lucide-react";
import { useGetPropertyFomoQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/userPropertyApi/userPropertyApi";
import { useUpdatePropertyMutation } from "../../../Admin_Redux/PropertyApi/propertyApi";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";
export default function FomoSettingsModal({
  property,
  onClose,
  onSaveSuccess,
}) {
  const {
    data: fomoData,
    isLoading: isFomoLoading,
    refetch: refetchFomo,
  } = useGetPropertyFomoQuery(property._id);
  const [updateProperty, { isLoading: isUpdating }] =
    useUpdatePropertyMutation();
  const [fomoEnabled, setFomoEnabled] = useState(
    property.fomoEnabled !== false,
  );
  const [fomoMockViewers, setFomoMockViewers] = useState(
    property.fomoMockViewers !== undefined && property.fomoMockViewers !== null
      ? property.fomoMockViewers
      : "",
  );
  const [fomoMockViews, setFomoMockViews] = useState(
    property.fomoMockViews !== undefined && property.fomoMockViews !== null
      ? property.fomoMockViews
      : "",
  );
  const handleSave = async () => {
    const payload = {
      id: property._id,
      fomoEnabled: fomoEnabled,
      fomoMockViewers:
        fomoMockViewers === "" ? null : parseInt(fomoMockViewers, 10),
      fomoMockViews: fomoMockViews === "" ? null : parseInt(fomoMockViews, 10),
    };
    try {
      await updateProperty(payload).unwrap();
      toast.success("FOMO settings updated successfully!");
      refetchFomo();
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update FOMO settings:", error);
      toast.error(getApiErrorMessage(error, "Failed to update FOMO settings"));
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm">
      {" "}
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border border-slate-150 animate-in fade-in zoom-in-95 duration-200">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          {" "}
          <div className="p-2.5 bg-amber-50 rounded-2xl">
            {" "}
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />{" "}
          </div>{" "}
          <div>
            {" "}
            <h3 className="text-lg font-bold text-slate-800">
              FOMO Configuration
            </h3>{" "}
            <p className="text-xs text-slate-400">
              Set real-time viewing statistics
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* Property Identity Card */}{" "}
        <div className="mb-5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
          {" "}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Target Listing
          </span>{" "}
          <h4 className="text-sm font-semibold text-slate-700 mt-1 truncate">
            {property.title}
          </h4>{" "}
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-mono">
            {" "}
            <span>ID: {property.listingId}</span>{" "}
            <span className="px-2 py-0.5 rounded bg-slate-200/60 text-slate-600 font-sans font-bold capitalize">
              {property.status}
            </span>{" "}
          </div>{" "}
        </div>{" "}
        {/* Toggle switch */}{" "}
        <div className="flex items-center justify-between mb-5 p-3.5 bg-slate-50/40 rounded-2xl border border-slate-100">
          {" "}
          <div>
            {" "}
            <span className="text-sm font-bold text-slate-700 block">
              Enable FOMO Alerts
            </span>{" "}
            <span className="text-[11px] text-slate-400 block max-w-[260px] mt-0.5 leading-normal">
              {" "}
              Display activity alerts to seekers on the property details
              page.{" "}
            </span>{" "}
          </div>{" "}
          <button
            type="button"
            onClick={() => setFomoEnabled(!fomoEnabled)}
            className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer shrink-0 ${fomoEnabled ? "bg-blue-600" : "bg-slate-200"}`}
          >
            {" "}
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${fomoEnabled ? "translate-x-5" : "translate-x-0"}`}
            />{" "}
          </button>{" "}
        </div>{" "}
        {fomoEnabled && (
          <div className="space-y-4 mb-6">
            {" "}
            <div className="flex items-center gap-1">
              {" "}
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Override Stats
              </span>{" "}
              <div className="group relative">
                {" "}
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />{" "}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-[10px] text-white rounded-lg shadow-lg z-50 text-center leading-normal">
                  {" "}
                  Leave blank to use actual dynamic views tracked by the
                  system.{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 gap-3.5">
              {" "}
              {/* Mock Viewers */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs font-semibold text-slate-600 block">
                  {" "}
                  Active Viewers{" "}
                </label>{" "}
                <input
                  type="number"
                  min="0"
                  placeholder="Dynamic"
                  value={fomoMockViewers}
                  onChange={(e) => setFomoMockViewers(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                />{" "}
              </div>{" "}
              {/* Mock Views */}{" "}
              <div className="space-y-1.5">
                {" "}
                <label className="text-xs font-semibold text-slate-600 block">
                  {" "}
                  Today's Views{" "}
                </label>{" "}
                <input
                  type="number"
                  min="0"
                  placeholder="Dynamic"
                  value={fomoMockViews}
                  onChange={(e) => setFomoMockViews(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all font-medium"
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {/* Real-time stats preview */}{" "}
        <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 border border-slate-100/50 space-y-2.5">
          {" "}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Live Activity Preview
          </span>{" "}
          {isFomoLoading ? (
            <div className="flex items-center justify-center py-6">
              {" "}
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />{" "}
            </div>
          ) : (
            <div className="space-y-2">
              {" "}
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                {" "}
                <span className="text-slate-500">
                  Active Viewers (last 30m)
                </span>{" "}
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  {" "}
                  {fomoEnabled && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}{" "}
                  {fomoMockViewers !== ""
                    ? `${fomoMockViewers} (Mocked)`
                    : fomoData?.activeViewers || 0}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                {" "}
                <span className="text-slate-500">Today's Views</span>{" "}
                <span className="font-bold text-slate-800">
                  {" "}
                  {fomoMockViews !== ""
                    ? `${fomoMockViews} (Mocked)`
                    : fomoData?.todayViews || 0}{" "}
                </span>{" "}
              </div>{" "}
              <div className="flex justify-between items-center text-sm">
                {" "}
                <span className="text-slate-500">
                  Total Views / Unique
                </span>{" "}
                <span className="font-bold text-slate-800">
                  {" "}
                  {fomoData?.totalViews || 0} /{" "}
                  {fomoData?.uniqueViews || 0}{" "}
                </span>{" "}
              </div>{" "}
              {fomoEnabled &&
                (fomoMockViewers !== "" || fomoData?.activeViewers > 0) && (
                  <div className="mt-3.5 p-2.5 bg-amber-50/60 rounded-xl text-xs font-semibold text-amber-700 border border-amber-100/50 flex items-start gap-1.5">
                    {" "}
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />{" "}
                    <span>
                      {" "}
                      Alert: "
                      {fomoMockViewers !== ""
                        ? `${fomoMockViewers} ${parseInt(fomoMockViewers, 10) === 1 ? "person is" : "people are"} viewing this property right now`
                        : fomoData?.activeViewersMessage}
                      "{" "}
                    </span>{" "}
                  </div>
                )}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Actions */}{" "}
        <div className="flex gap-3 justify-end">
          {" "}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-bold transition-all"
          >
            {" "}
            Cancel{" "}
          </button>{" "}
          <button
            type="button"
            onClick={handleSave}
            disabled={isUpdating}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 cursor-pointer text-xs font-bold shadow-md shadow-blue-500/10 transition-all"
          >
            {" "}
            {isUpdating ? "Saving..." : "Save Settings"}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
