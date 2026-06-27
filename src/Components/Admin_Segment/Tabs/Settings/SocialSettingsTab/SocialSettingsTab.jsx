import React, { useState } from "react";
import { Plus, Edit2, Trash2, ShieldAlert, Loader2, Link2 } from "lucide-react";
import {
  useGetSocialLinksQuery,
  useToggleSocialLinkStatusMutation,
  useDeleteSocialLinkMutation,
} from "../../../Admin_Redux/AdminSocialApi/adminSocialApi";
import { toast } from "../../../../Shared/ToastConfig";
import AddEditSocialLinkModal, {
  PLATFORM_OPTIONS,
} from "./Shared/AddEditSocialLinkModal";

const PLATFORM_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  twitter: "Twitter",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  google: "Google Business / Maps",
  other: "Other",
};

const SocialSettingsTab = () => {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetSocialLinksQuery();
  const [toggleStatus, { isLoading: isToggling }] =
    useToggleSocialLinkStatusMutation();
  const [deleteSocialLink, { isLoading: isDeleting }] =
    useDeleteSocialLinkMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [linkToEdit, setLinkToEdit] = useState(null);

  const links = response || [];

  const handleAddClick = () => {
    setLinkToEdit(null);
    setModalOpen(true);
  };

  const handleEditClick = (link) => {
    setLinkToEdit(link);
    setModalOpen(true);
  };

  const handleToggleStatus = async (link) => {
    const nextStatus = link.isActive !== false ? false : true;
    try {
      await toggleStatus({ id: link._id, isActive: nextStatus }).unwrap();
      toast.success(
        `${PLATFORM_LABELS[link.platform] || link.platform} status updated to ${nextStatus ? "Active" : "Inactive"}`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = async (link) => {
    if (
      !window.confirm(
        `Are you sure you want to delete social link for "${PLATFORM_LABELS[link.platform] || link.platform}"?`,
      )
    ) {
      return;
    }
    try {
      await deleteSocialLink(link._id).unwrap();
      toast.success("Social link deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete social link");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <p className="text-sm">Failed to load social links configuration.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Sort links by displayOrder ascending
  const sortedLinks = [...links].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">
            Social Media Links Configuration
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage the social media platforms and sharing integrations across
            footer, contact pages, and properties sharing.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
      </div>

      {/* Social Links List */}
      {sortedLinks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-sm text-slate-400">
            No social media links configured yet.
          </p>
          <button
            onClick={handleAddClick}
            className="mt-3 px-4 py-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg transition-colors"
          >
            Create Your First Social Link
          </button>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                    Icon
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Display Label
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Target URL
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                    Order
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-28">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedLinks.map((link) => {
                  const platformOption = PLATFORM_OPTIONS.find(
                    (p) => p.value === link.platform,
                  );
                  return (
                    <tr
                      key={link._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="w-7 h-7 flex items-center justify-center">
                          {platformOption?.icon || "🔗"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 capitalize">
                        {PLATFORM_LABELS[link.platform] || link.platform}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {link.label || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1.5 max-w-[280px] truncate"
                        >
                          <Link2 className="w-3 h-3 shrink-0" /> {link.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 font-semibold font-mono">
                        {link.displayOrder}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(link)}
                          disabled={isToggling}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                            link.isActive !== false
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {link.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(link)}
                            className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Edit Link"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(link)}
                            disabled={isDeleting}
                            className="p-1 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                            title="Delete Link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {modalOpen && (
        <AddEditSocialLinkModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          linkToEdit={linkToEdit}
        />
      )}
    </div>
  );
};

export default SocialSettingsTab;
