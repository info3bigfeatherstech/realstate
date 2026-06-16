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
  const [error, setError] = useState("");
  const [isUpdatingAll, setIsUpdatingAll] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [docsToDelete, setDocsToDelete] = useState([]);

  // Transform backend data to form format
  const transformApiDataToForm = (property) => {
    // Transform media array to images object
    const imagesObj = {};
    if (property.media && property.media.length > 0) {
      property.media.forEach((mediaItem) => {
        imagesObj[mediaItem.type] = mediaItem.url; // Store URL for preview
      });
    }

    // Map document type back to keys in the form
    const docKeysMap = {
      "Sale Deed": "saleDeed",
      "RERA Certificate": "reraCertificate",
      "Property Tax Receipt": "taxReceipt",
      "Electricity Bill": "electricityBill",
      "Occupancy Certificate": "occupancyCertificate",
      "Encumbrance Certificate": "encumbrance",
    };

    const documentsObj = {};
    if (property.documents && property.documents.length > 0) {
      property.documents.forEach((doc) => {
        const key = docKeysMap[doc.type];
        if (key) {
          documentsObj[key] = {
            file: null,
            url: doc.url,
            name: doc.originalFileName || doc.fileName,
            category: doc.category,
            type: doc.type,
          };
        }
      });
    }

    return {
      listingType: property.listingType || "",
      propertyType: property.propertyType || "",
      ownershipType: property.ownershipType || "Freehold",
      title: property.title || "",
      description: property.description || "",
      condition: property.condition || "Brand New",
      constructionStatus: property.constructionStatus || "Ready to Move",
      furnishing: property.furnishing || "Unfurnished",
      facing: property.facing || "North",
      areaValue: property.area?.value || "",
      price: property.price || "",
      bedrooms: property.bedrooms || "",
      bathrooms: property.bathrooms || "",
      floorNo: property.floorNo || "",
      totalFloors: property.totalFloors || "",
      flooringType: property.flooringType || "Marble",
      maintenance: property.maintenance || "",
      waterSupply: property.waterSupply || "Municipal Water",
      powerBackup: property.powerBackup || "No Backup",
      parkingType: property.parkingType || "No Parking",
      securityFeatures: property.securityFeatures || [],
      amenities: property.amenities || [],
      connectivity: property.connectivity || [],
      nearbyFacilities: property.nearbyFacilities || [],
      fullAddress: property.location?.fullAddress || "",
      city: property.location?.city || "",
      state: property.location?.state || "Maharashtra",
      pincode: property.location?.pincode || "",
      latitude: property.location?.latitude || "",
      longitude: property.location?.longitude || "",
      images: imagesObj,
      documents: documentsObj,
    };
  };

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
      const docKeysMap = {
        saleDeed: "Sale Deed",
        reraCertificate: "RERA Certificate",
        taxReceipt: "Property Tax Receipt",
        electricityBill: "Electricity Bill",
        occupancyCertificate: "Occupancy Certificate",
        encumbrance: "Encumbrance Certificate",
      };
      const docType = docKeysMap[docKey];
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
    setError("");
  };

  const buildUpdatePayload = () => {
    const payload = {
      listingType: formData.listingType,
      propertyType: formData.propertyType,
      ownershipType: formData.ownershipType,
      title: formData.title,
      description: formData.description,
      condition: formData.condition,
      constructionStatus: formData.constructionStatus,
      furnishing: formData.furnishing,
      facing: formData.facing,
      flooringType: formData.flooringType,
      area: { value: Number(formData.areaValue) || 0, unit: "sqft" },
      price: Number(formData.price) || 0,
      maintenance: Number(formData.maintenance) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      floorNo: Number(formData.floorNo) || 0,
      totalFloors: Number(formData.totalFloors) || 0,
      waterSupply: formData.waterSupply,
      powerBackup: formData.powerBackup,
      parkingType: formData.parkingType,
      securityFeatures: formData.securityFeatures,
      amenities: formData.amenities,
      connectivity: formData.connectivity,
      nearbyFacilities: formData.nearbyFacilities,
      location: {
        fullAddress: formData.fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
      },
    };

    if (formData.listingType === "For Sale" || formData.listingType === "BUY") {
      payload.saleDetails = { possessionStatus: "Immediate Possession", loanAvailability: "Available" };
    }

    if (formData.listingType === "For Rent" || formData.listingType === "PG") {
      payload.rentalDetails = {
        tenantTypeAllowed: ["Anyone"],
        occupationPreference: "No Restriction",
        rentalAgreementDuration: "11 Months",
        securityDeposit: "2 Months Rent",
        availability: "Immediate"
      };
    }

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
    if (!formData.listingType || !formData.propertyType || !formData.title || !formData.price || !formData.fullAddress || !formData.city) {
      setError("Please fill all required fields");
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
      setError(err.data?.message || "Failed to update property");
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
      setError(err.data?.message || "Failed to save draft");
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

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

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
