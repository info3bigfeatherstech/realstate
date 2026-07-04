import React, { useState } from "react";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Info,
  Check,
  ShieldAlert,
  FolderHeart,
} from "lucide-react";
import {
  useGetInventoryCategoriesQuery,
  useCreateInventoryCategoryMutation,
  useUpdateInventoryCategoryMutation,
  useToggleInventoryCategoryStatusMutation,
  useDeleteInventoryCategoryMutation,
} from "../../../Admin_Redux/InventoryCategoryApi/inventoryCategoryApi";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";

export default function CategoryManagerModal({ onClose, onCategoriesUpdated }) {
  const {
    data: categoryData,
    isLoading,
    refetch,
  } = useGetInventoryCategoriesQuery({ limit: 100 });

  const [createCategory, { isLoading: isCreating }] =
    useCreateInventoryCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateInventoryCategoryMutation();
  const [toggleStatus] = useToggleInventoryCategoryStatusMutation();
  const [deleteCategory] = useDeleteInventoryCategoryMutation();

  // Local form state for Add Category
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      await createCategory({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
      }).unwrap();
      toast.success("Category created successfully!");
      setNewName("");
      setNewDescription("");
      refetch();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error(getApiErrorMessage(error, "Failed to create category"));
    }
  };

  const handleStartEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      toast.error("Please enter a category name");
      return;
    }
    try {
      await updateCategory({
        id,
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      }).unwrap();
      toast.success("Category updated successfully!");
      setEditingId(null);
      refetch();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (error) {
      console.error("Failed to update category:", error);
      toast.error(getApiErrorMessage(error, "Failed to update category"));
    }
  };

  const handleToggleStatus = async (category) => {
    if (category.isDefault) {
      toast.error("Cannot toggle status of default categories");
      return;
    }
    try {
      await toggleStatus({
        id: category._id,
        isActive: !category.isActive,
      }).unwrap();
      toast.success(
        `Category ${category.isActive ? "deactivated" : "activated"} successfully`
      );
      refetch();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error(getApiErrorMessage(error, "Failed to change category status"));
    }
  };

  const handleDelete = async (category) => {
    if (category.isDefault) {
      toast.error("Cannot delete default categories");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete category "${category.name}"?`
      )
    ) {
      return;
    }
    try {
      await deleteCategory(category._id).unwrap();
      toast.success("Category deleted successfully!");
      refetch();
      if (onCategoriesUpdated) onCategoriesUpdated();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error(getApiErrorMessage(error, "Failed to delete category"));
    }
  };

  const categories = categoryData?.data || [];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-150 overflow-hidden transform transition-all flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Manage Categories
              </h3>
              <p className="text-xs text-slate-400">
                Create and modify dynamic inventory categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Category Section */}
          <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-150/50">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Add New Category
            </h4>
            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Category Name (e.g. Electricals, Plumbing)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Description (Optional)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isCreating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Create Category
                </button>
              </div>
            </form>
          </div>

          {/* Categories List Section */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Configured Categories ({categories.length})
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Info className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm font-semibold">
                  No custom categories found
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Default categories are managed by the server.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className={`p-4 rounded-2xl border transition-all ${
                      editingId === category._id
                        ? "border-blue-500 bg-blue-50/10 shadow-md shadow-blue-500/5"
                        : "border-slate-150/60 bg-white hover:border-slate-200"
                    }`}
                  >
                    {editingId === category._id ? (
                      /* Edit Mode Form */
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Category Name
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-700"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-bold transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(category._id)}
                            disabled={isUpdating}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-bold shadow-md shadow-blue-500/10 transition-all flex items-center gap-1.5 disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal Display Card */
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-sm truncate">
                              {category.name}
                            </span>
                            {category.isDefault && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wider shrink-0">
                                System Default
                              </span>
                            )}
                            {!category.isActive && (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-bold uppercase tracking-wider shrink-0">
                                Inactive
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-xs text-slate-400 truncate max-w-[420px]">
                              {category.description}
                            </p>
                          )}
                        </div>
                        {/* Category Action Controls */}
                        <div className="flex items-center gap-3">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(category)}
                            disabled={category.isDefault}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed ${
                              category.isActive
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                category.isActive
                                    ? "translate-x-4"
                                    : "translate-x-0"
                              }`}
                            />
                          </button>
                          {/* Edit Button */}
                          <button
                            onClick={() => handleStartEdit(category)}
                            disabled={category.isDefault}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Edit Category"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(category)}
                            disabled={category.isDefault}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
