import React, { useState } from "react";
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Info,
  Check,
  Briefcase,
} from "lucide-react";
import {
  useGetEliteRolesQuery,
  useAddEliteRoleMutation,
  useUpdateEliteRoleMutation,
  useDeleteEliteRoleMutation,
} from "../../../Admin_Redux/EliteConfigApi/eliteConfigApi";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";

const ManageEliteRolesModal = ({ onClose, onRolesUpdated }) => {
  const { data: roles = [], isLoading, refetch } = useGetEliteRolesQuery();

  const [addRole, { isLoading: isAdding }] = useAddEliteRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateEliteRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteEliteRoleMutation();

  const [newRoleName, setNewRoleName] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [roleToDelete, setRoleToDelete] = useState(null);

  const notifyUpdated = () => {
    refetch();
    if (onRolesUpdated) onRolesUpdated();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newRoleName.trim();
    if (!trimmed) {
      toast.error("Please enter a role name");
      return;
    }
    try {
      await addRole(trimmed).unwrap();
      toast.success(`Role "${trimmed}" added successfully`);
      setNewRoleName("");
      notifyUpdated();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add role"));
    }
  };

  const handleStartEdit = (role) => {
    setEditingRole(role);
    setEditRoleName(role);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setEditRoleName("");
  };

  const handleSaveEdit = async () => {
    const trimmed = editRoleName.trim();
    if (!trimmed) {
      toast.error("Please enter a role name");
      return;
    }
    if (trimmed === editingRole) {
      handleCancelEdit();
      return;
    }
    try {
      await updateRole({ oldRole: editingRole, newRole: trimmed }).unwrap();
      toast.success(`Role updated to "${trimmed}"`);
      setEditingRole(null);
      setEditRoleName("");
      notifyUpdated();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update role"));
    }
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      await deleteRole(roleToDelete).unwrap();
      toast.success(`Role "${roleToDelete}" deleted successfully`);
      setRoleToDelete(null);
      notifyUpdated();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete role"));
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl border border-slate-150 overflow-hidden flex flex-col max-h-[90vh]">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manage Service Roles</h3>
                <p className="text-xs text-slate-400">
                  Add, edit, or remove elite service roles
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

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-slate-50/70 p-4.5 rounded-2xl border border-slate-150/50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Add New Role
              </h4>
              <form onSubmit={handleCreate} className="flex gap-3">
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. AC Repair, Mason, Gardener"
                  maxLength={50}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 font-medium text-slate-700"
                />
                <button
                  type="submit"
                  disabled={isAdding}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60 shrink-0"
                >
                  {isAdding ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Add Role
                </button>
              </form>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Configured Roles ({roles.length})
              </span>

              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-12 mt-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <Info className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-500 text-sm font-semibold">No roles configured</p>
                  <p className="text-slate-400 text-xs mt-1">
                    Add your first service role above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-3.5">
                  {roles.map((role) => (
                    <div
                      key={role}
                      className={`p-4 rounded-2xl border transition-all ${
                        editingRole === role
                          ? "border-purple-500 bg-purple-50/10 shadow-md"
                          : "border-slate-150/60 bg-white hover:border-slate-200"
                      }`}
                    >
                      {editingRole === role ? (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={editRoleName}
                            onChange={(e) => setEditRoleName(e.target.value)}
                            maxLength={50}
                            className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium text-slate-700"
                          />
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            disabled={isUpdating}
                            className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer text-xs font-bold flex items-center gap-1.5 disabled:opacity-60"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-bold text-slate-800 text-sm">{role}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(role)}
                              className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all cursor-pointer"
                              title="Edit Role"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setRoleToDelete(role)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              title="Delete Role"
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

          <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4.5 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {roleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Role</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{roleToDelete}</span>? This cannot be done
              if any providers are assigned to this role.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRoleToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageEliteRolesModal;
