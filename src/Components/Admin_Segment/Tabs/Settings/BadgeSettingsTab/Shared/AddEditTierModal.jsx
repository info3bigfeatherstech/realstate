import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import {
  useAddBadgeTierMutation,
  useUpdateBadgeTierMutation,
} from "../../../../Admin_Redux/AdminBadgeApi/adminBadgeApi";
import { toast, getApiErrorMessage } from "../../../../../Shared/ToastConfig";
const AddEditTierModal = ({ isOpen, onClose, tierToEdit }) => {
  const [addBadgeTier, { isLoading: isAdding }] = useAddBadgeTierMutation();
  const [updateBadgeTier, { isLoading: isUpdating }] =
    useUpdateBadgeTierMutation();
  const [form, setForm] = useState({
    name: "",
    minDeals: 0,
    maxDeals: "",
    level: 1,
    color: "#22c55e",
    icon: "🌱",
    description: "",
  });
  useEffect(() => {
    if (tierToEdit) {
      setForm({
        name: tierToEdit.name || "",
        minDeals: tierToEdit.minDeals ?? 0,
        maxDeals: tierToEdit.maxDeals ?? "",
        level: tierToEdit.level ?? 1,
        color: tierToEdit.color || "#22c55e",
        icon: tierToEdit.icon || "🌱",
        description: tierToEdit.description || "",
      });
    } else {
      setForm({
        name: "",
        minDeals: 0,
        maxDeals: "",
        level: 1,
        color: "#22c55e",
        icon: "🌱",
        description: "",
      });
    }
  }, [tierToEdit, isOpen]);
  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.icon || !form.color) {
      toast.error("Please fill name, icon, and color fields");
      return;
    }
    const payload = {
      name: form.name.trim(),
      minDeals: Number(form.minDeals),
      maxDeals:
        form.maxDeals === "" || form.maxDeals === null
          ? null
          : Number(form.maxDeals),
      level: Number(form.level),
      color: form.color,
      icon: form.icon.trim(),
      description: form.description.trim(),
    };
    try {
      if (tierToEdit) {
        await updateBadgeTier({ level: tierToEdit.level, ...payload }).unwrap();
        toast.success("Badge tier updated successfully");
      } else {
        await addBadgeTier(payload).unwrap();
        toast.success("Badge tier created successfully");
      }
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to save badge tier"));
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      {" "}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300 scale-100">
        {" "}
        {/* Header */}{" "}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          {" "}
          <h3 className="text-base font-bold text-slate-800">
            {" "}
            {tierToEdit ? "Edit Badge Tier" : "Add New Badge Tier"}{" "}
          </h3>{" "}
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {" "}
            <X className="w-5 h-5" />{" "}
          </button>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {" "}
                Level <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input
                type="number"
                required
                disabled={!!tierToEdit}
                min={1}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white disabled:bg-slate-100 disabled:text-slate-400"
                value={form.level}
                onChange={(e) => handleChange("level", e.target.value)}
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {" "}
                Tier Name <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input
                type="text"
                required
                placeholder="e.g. Rookie"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {" "}
                Min Deals <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input
                type="number"
                required
                min={0}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                value={form.minDeals}
                onChange={(e) => handleChange("minDeals", e.target.value)}
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {" "}
                Max Deals{" "}
              </label>{" "}
              <input
                type="number"
                min={0}
                placeholder="Unlimited"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white"
                value={form.maxDeals}
                onChange={(e) => handleChange("maxDeals", e.target.value)}
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-3 gap-3 items-center">
            {" "}
            <div className="col-span-2">
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                {" "}
                Badge Icon (Emoji) <span className="text-red-500">*</span>{" "}
              </label>{" "}
              <input
                type="text"
                required
                maxLength={4}
                placeholder="e.g. 🏆"
                className="w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white text-center text-lg"
                value={form.icon}
                onChange={(e) => handleChange("icon", e.target.value)}
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 text-center">
                {" "}
                Color{" "}
              </label>{" "}
              <div className="flex justify-center">
                {" "}
                <input
                  type="color"
                  className="w-12 h-10 p-0.5 rounded-lg border border-slate-300 cursor-pointer bg-white"
                  value={form.color}
                  onChange={(e) => handleChange("color", e.target.value)}
                />{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              {" "}
              Description{" "}
            </label>{" "}
            <textarea
              placeholder="Describe benefits or requirements for this tier..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />{" "}
          </div>{" "}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4">
            {" "}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-100 bg-white transition-colors"
            >
              {" "}
              Cancel{" "}
            </button>{" "}
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {" "}
              {isAdding || isUpdating ? (
                <>
                  {" "}
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...{" "}
                </>
              ) : (
                "Save Tier"
              )}{" "}
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
export default AddEditTierModal;
