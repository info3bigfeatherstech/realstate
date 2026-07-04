// src/Tabs/UtilityServicesTab/Shared/EditEliteServiceModal.jsx
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import EliteServiceFormBody from "./EliteServiceFormBody";
import {
  useGetEliteServiceByIdQuery,
  useUpdateEliteServiceMutation,
} from "../../../Admin_Redux/EliteServiceApi/eliteServiceApi";
import { getApiErrorMessage } from "../../../../Shared/ToastConfig";

const EditEliteServiceModal = ({ serviceId, onClose, roles = [] }) => {
  const { data: serviceData, isLoading: isLoadingService } =
    useGetEliteServiceByIdQuery(serviceId, { skip: !serviceId });

  const [updateEliteService, { isLoading: isUpdating }] =
    useUpdateEliteServiceMutation();

  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");

  // Transform API response → form shape
  const transformToForm = (service) => ({
    role: service.role || "",
    providerName: service.providerName || "",
    address: service.address || "",
    primaryMobile: service.primaryMobile || "",
    // null from backend → empty string for the input
    secondaryMobile: service.secondaryMobile || "",
    status: service.status || "Available",
  });

  useEffect(() => {
    if (serviceData) {
      setFormData(transformToForm(serviceData));
    }
  }, [serviceData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const buildPayload = () => ({
    role: formData.role,
    providerName: formData.providerName.trim(),
    address: formData.address.trim(),
    primaryMobile: formData.primaryMobile.trim(),
    // empty string → null to match backend normalization
    secondaryMobile: formData.secondaryMobile.trim() || null,
    status: formData.status,
  });

  const validate = () => {
    if (!formData.role) return "Please select a service role.";
    if (!formData.providerName.trim()) return "Provider name is required.";
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.primaryMobile.trim()) return "Primary mobile is required.";
    return null;
  };

  const handleUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await updateEliteService({ id: serviceId, ...buildPayload() }).unwrap();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to update service provider."));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Edit Service Provider
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Update the details below. All fields marked with{" "}
                <span className="text-red-500">*</span> are mandatory.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          {/* Loading state — fetch in progress or form not yet populated */}
          {isLoadingService || !formData ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              {/* Form */}
              <div className="mt-5">
                <EliteServiceFormBody
                  formData={formData}
                  onChange={handleChange}
                  roles={roles}
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer font-semibold"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Update Provider"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditEliteServiceModal;