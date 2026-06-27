import React, { useState } from "react";
import { Plus, Edit2, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import {
  useGetBadgeConfigQuery,
  useToggleBadgeTierStatusMutation,
  useDeleteBadgeTierMutation,
} from "../../../Admin_Redux/AdminBadgeApi/adminBadgeApi";
import { toast } from "../../../../Shared/ToastConfig";
import AddEditTierModal from "./Shared/AddEditTierModal";
const BadgeSettingsTab = () => {
  const {
    data: config,
    isLoading,
    isError,
    refetch,
  } = useGetBadgeConfigQuery();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleBadgeTierStatusMutation();
  const [deleteTier, { isLoading: isDeleting }] = useDeleteBadgeTierMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [tierToEdit, setTierToEdit] = useState(null);
  const tiers = config?.tiers || [];
  const handleAddClick = () => {
    setTierToEdit(null);
    setModalOpen(true);
  };
  const handleEditClick = (tier) => {
    setTierToEdit(tier);
    setModalOpen(true);
  };
  const handleToggleStatus = async (tier) => {
    const nextStatus = tier.isActive === false ? true : false;
    try {
      await toggleStatus({ level: tier.level, status: nextStatus }).unwrap();
      toast.success(
        `Tier status updated to ${nextStatus ? "Active" : "Inactive"}`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update tier status");
    }
  };
  const handleDeleteClick = async (tier) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete tier "${tier.name}"?`,
      )
    ) {
      return;
    }
    try {
      await deleteTier(tier.level).unwrap();
      toast.success("Badge tier deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete badge tier");
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        {" "}
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />{" "}
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
        {" "}
        <ShieldAlert className="w-12 h-12 text-red-400" />{" "}
        <p className="text-sm">Failed to load badge configuration tiers.</p>{" "}
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          {" "}
          Retry{" "}
        </button>{" "}
      </div>
    );
  } // Sort tiers by level ascending const sortedTiers = [...tiers].sort((a, b) => a.level - b.level); return ( <div className="p-6 space-y-6"> {/* Title */} <div className="flex items-center justify-between border-b border-slate-100 pb-4"> <div> <h3 className="text-base font-bold text-slate-800">Badge Tier Configurations</h3> <p className="text-xs text-slate-400 mt-1"> Define loyalty badge levels, deal thresholds, color schemes, and rewards for agents. </p> </div> <button onClick={handleAddClick} className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer" > <Plus className="w-4 h-4" /> Add Badge Tier </button> </div> {/* Tiers List */} {sortedTiers.length === 0 ? ( <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl"> <p className="text-sm text-slate-400">No badge tiers defined yet.</p> <button onClick={handleAddClick} className="mt-3 px-4 py-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg transition-colors" > Create Your First Tier </button> </div> ) : ( <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white"> <div className="overflow-x-auto"> <table className="w-full text-sm"> <thead> <tr className="bg-slate-50 border-b border-slate-200"> <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">Level</th> <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Badge</th> <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tier Name</th> <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Min Deals</th> <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Max Deals</th> <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Theme Color</th> <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th> <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Status</th> <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Actions</th> </tr> </thead> <tbody className="divide-y divide-slate-100"> {sortedTiers.map((tier) => ( <tr key={tier._id || tier.level} className="hover:bg-slate-50/50 transition-colors"> <td className="px-4 py-3 text-center font-bold text-slate-800">{tier.level}</td> <td className="px-4 py-3 text-center text-2xl">{tier.icon}</td> <td className="px-4 py-3 font-semibold text-slate-700">{tier.name}</td> <td className="px-4 py-3 text-center text-slate-600 font-mono">{tier.minDeals}</td> <td className="px-4 py-3 text-center text-slate-600 font-mono"> {tier.maxDeals ?? "Unlimited"} </td> <td className="px-4 py-3"> <div className="flex items-center gap-2"> <span className="w-5 h-5 rounded-full border border-slate-200 block shrink-0" style={{ backgroundColor: tier.color }} /> <span className="text-xs text-slate-500 font-mono">{tier.color}</span> </div> </td> <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[200px]"> {tier.description || "—"} </td> <td className="px-4 py-3 text-center"> <button onClick={() => handleToggleStatus(tier)} disabled={isToggling} className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${tier.isActive !== false ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200" }`} > {tier.isActive !== false ? "Active" : "Inactive"} </button> </td> <td className="px-4 py-3"> <div className="flex items-center justify-center gap-2"> <button onClick={() => handleEditClick(tier)} className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" title="Edit Tier" > <Edit2 className="w-3.5 h-3.5" /> </button> <button onClick={() => handleDeleteClick(tier)} disabled={isDeleting} className="p-1 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40" title="Delete Tier" > <Trash2 className="w-3.5 h-3.5" /> </button> </div> </td> </tr> ))} </tbody> </table> </div> </div> )} {modalOpen && ( <AddEditTierModal isOpen={modalOpen} onClose={() => setModalOpen(false)} tierToEdit={tierToEdit} /> )} </div> );
};
export default BadgeSettingsTab;
