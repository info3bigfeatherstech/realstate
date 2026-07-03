// src/Tabs/PropertiesTab/Shared/EditPropertyPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import PropertyFormBody from "./PropertyFormBody";
import {
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
  useUploadMediaMutation,
  useUploadDocumentMutation,
  useDeleteMediaMutation,
  useDeleteDocumentMutation,
} from "../../../Admin_Redux/PropertyApi/propertyApi";
import { normalizeListingTypeForSubmit, isSellListingType } from "../../../../../utils/listingType";
import {
  buildFullPropertyPayload,
  mapPropertyToFormBase,
  DOCUMENT_KEY_TO_TYPE,
  getPropertyRequiredFieldErrors,
} from "../../../../../utils/propertyFormPayload";
import { toast, formatApiErrorMessage } from "../../../../Shared/ToastConfig";

const EditPropertyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyId = searchParams.get("id");
  const dispatch = useDispatch();

  const { data: propertyData, isLoading: isLoadingProperty } = useGetPropertyByIdQuery(propertyId, {
    skip: !propertyId,
  });
  const [updateProperty] = useUpdatePropertyMutation();
  const [uploadMedia] = useUploadMediaMutation();
  const [uploadDocument] = useUploadDocumentMutation();
  const [deleteMedia] = useDeleteMediaMutation();
  const [deleteDocument] = useDeleteDocumentMutation();

  const [formData, setFormData] = useState(null);
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [docsToDelete, setDocsToDelete] = useState([]);

  const transformApiDataToForm = (property) => mapPropertyToFormBase(property);

  useEffect(() => {
    if (propertyData) {
      setFormData(transformApiDataToForm(propertyData));
    }
  }, [propertyData]);

  const handleChange = (field, value) => {
    // Track deleted or replaced media
    if (field.startsWith("images.")) {
      const type = field.split(".")[1];
      const originalMedia = propertyData?.media?.find(m => m.type === type);
      if (originalMedia && (value === null || value instanceof File)) {
        setMediaToDelete(prev => {
          if (!prev.includes(originalMedia._id)) {
            return [...prev, originalMedia._id];
          }
          return prev;
        });
      }
    }

    // Track deleted or replaced documents
    if (field.startsWith("documents.")) {
      const docKey = field.split(".")[1];
      const docType = DOCUMENT_KEY_TO_TYPE[docKey];
      const originalDoc = propertyData?.documents?.find(d => d.type === docType);
      if (originalDoc && (value === null || (value && value.file instanceof File))) {
        setDocsToDelete(prev => {
          if (!prev.includes(originalDoc._id)) {
            return [...prev, originalDoc._id];
          }
          return prev;
        });
      }
    }

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const buildUpdatePayload = () => {
    const listingType = normalizeListingTypeForSubmit(formData.listingType);
    const payload = buildFullPropertyPayload(
      { ...formData, listingType },
      { isSell: isSellListingType(formData.listingType) }
    );
    payload.status = propertyData?.status || "pending";
    return payload;
  };

  const uploadAllMedia = async (propertyId, images) => {
    for (const [type, file] of Object.entries(images)) {
      if (file && file instanceof File) {
        const mediaFormData = new FormData();
        mediaFormData.append("file", file);
        mediaFormData.append("type", type);
        mediaFormData.append("isMain", type === "exterior" ? "true" : "false");
        await uploadMedia({ id: propertyId, formData: mediaFormData }).unwrap();
      }
    }
  };

  const uploadAllDocuments = async (propertyId, documents) => {
    for (const [key, doc] of Object.entries(documents)) {
      if (doc && doc.file && doc.file instanceof File) {
        const docFormData = new FormData();
        docFormData.append("file", doc.file);
        docFormData.append("category", doc.category || "legal");
        docFormData.append("type", doc.type || key);
        await uploadDocument({ id: propertyId, formData: docFormData }).unwrap();
      }
    }
  };

  const handleUpdate = async () => {
    const validationError = getPropertyRequiredFieldErrors(formData);
    if (validationError) {
      toast.error(validationError, { autoClose: 5000 });
      return;
    }

    setIsUpdatingAll(true);
    try {
      // 1. Update text fields
      const payload = buildUpdatePayload();
      await updateProperty({ id: propertyId, ...payload }).unwrap();

      // 2. Delete old media/docs that were removed or replaced
      for (const mediaId of mediaToDelete) {
        await deleteMedia({ propertyId, mediaId }).unwrap();
      }
      for (const documentId of docsToDelete) {
        await deleteDocument({ propertyId, documentId }).unwrap();
      }

      // 3. Upload new media/docs
      if (formData.images && Object.keys(formData.images).length > 0) {
        await uploadAllMedia(propertyId, formData.images);
      }
      if (formData.documents && Object.keys(formData.documents).length > 0) {
        await uploadAllDocuments(propertyId, formData.documents);
      }

      setSearchParams({ tab: "properties" });
    } catch (err) {
      toast.error(formatApiErrorMessage(err, "Failed to update property"), { autoClose: 5000 });
    } finally {
      setIsUpdatingAll(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsUpdatingAll(true);
    try {
      // 1. Update text fields with status draft
      const payload = buildUpdatePayload();
      payload.status = "draft";
      await updateProperty({ id: propertyId, ...payload }).unwrap();

      // 2. Delete old media/docs that were removed or replaced
      for (const mediaId of mediaToDelete) {
        await deleteMedia({ propertyId, mediaId }).unwrap();
      }
      for (const documentId of docsToDelete) {
        await deleteDocument({ propertyId, documentId }).unwrap();
      }

      // 3. Upload new media/docs
      if (formData.images && Object.keys(formData.images).length > 0) {
        await uploadAllMedia(propertyId, formData.images);
      }
      if (formData.documents && Object.keys(formData.documents).length > 0) {
        await uploadAllDocuments(propertyId, formData.documents);
      }

      setSearchParams({ tab: "properties" });
    } catch (err) {
      toast.error(formatApiErrorMessage(err, "Failed to save draft"), { autoClose: 5000 });
    } finally {
      setIsUpdatingAll(false);
    }
  };

  const handleCancel = () => setSearchParams({ tab: "properties" });

  if (isLoadingProperty || !formData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mb-6 flex items-center gap-4">
        <button onClick={handleCancel} className="p-2 rounded-xl hover:bg-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Property</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Update the details below. All fields marked with <span className="text-red-500">*</span> are mandatory.
          </p>
        </div>
      </div>

      <div className="pb-28">
        <PropertyFormBody formData={formData} onChange={handleChange} mode="edit" />
      </div>

      <footer className="fixed bottom-0 left-64 right-0 h-20 bg-white border-t flex items-center justify-end gap-3 px-8 z-50">
        <button onClick={handleCancel} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <button onClick={handleSaveDraft} disabled={isUpdatingAll} className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50">
          {isUpdatingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save as Draft"}
        </button>
        <button onClick={handleUpdate} disabled={isUpdatingAll} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {isUpdatingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Property"}
        </button>
      </footer>
    </div>
  );
};

export default EditPropertyPage;
