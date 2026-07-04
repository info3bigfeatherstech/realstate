// src/Tabs/PropertiesTab/Shared/AddPropertyPage.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import PropertyFormBody from "./PropertyFormBody";
import { isSellListingType, normalizeListingTypeForSubmit } from "../../../../../utils/listingType";
import { buildFullPropertyPayload, EMPTY_RENTAL_DETAILS, EMPTY_SALE_DETAILS, getPropertyRequiredFieldErrors } from "../../../../../utils/propertyFormPayload";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";
import {
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useUploadMediaMutation,
    useUploadDocumentMutation
} from "../../../Admin_Redux/PropertyApi/propertyApi";

const INITIAL_FORM = {
    listingType: "",
    propertyType: "",
    ownershipType: "",
    title: "",
    description: "",
    condition: "",
    constructionStatus: "",
    furnishing: "",
    facing: "",
    areaValue: "",
    price: "",
    roi: "",
    bedrooms: "",
    bathrooms: "",
    floorNo: "",
    totalFloors: "",
    flooringType: "",
    maintenance: "",
    waterSupply: "",
    powerBackup: "",
    parkingType: "",
    securityFeatures: [],
    amenities: [],
    connectivity: [],
    nearbyFacilities: [],
    fullAddress: "",
    city: "Delhi",
    state: "Delhi",
    pincode: "",
    latitude: "",
    longitude: "",
    rentalDetails: { ...EMPTY_RENTAL_DETAILS },
    saleDetails: { ...EMPTY_SALE_DETAILS },
    images: {},
    documents: {},
};

const AddPropertyPage = () => {
    const [, setSearchParams] = useSearchParams();
    const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
    const [updateProperty] = useUpdatePropertyMutation();
    const [uploadMedia] = useUploadMediaMutation();
    const [uploadDocument] = useUploadDocumentMutation();
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isUploading, setIsUploading] = useState(false);
    const [createdPropertyId, setCreatedPropertyId] = useState(null);

    const handleChange = (field, value) => {
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

    const buildPayload = () => {
        const listingType = normalizeListingTypeForSubmit(formData.listingType);
        const payload = buildFullPropertyPayload(
            { ...formData, listingType },
            { isSell: isSellListingType(formData.listingType) }
        );
        payload.status = "active";
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

    const handlePublish = async () => {
        const validationError = getPropertyRequiredFieldErrors(formData);
        if (validationError) {
            toast.error(validationError, { autoClose: 5000 });
            return;
        }

        setIsUploading(true);
        let propertyId = createdPropertyId;
        try {
            const payload = buildPayload();
            if (!propertyId) {
                const property = await createProperty(payload).unwrap();
                propertyId = property.data?._id || property._id;
                setCreatedPropertyId(propertyId);
            } else {
                await updateProperty({ id: propertyId, ...payload }).unwrap();
            }

            if (formData.images && Object.keys(formData.images).length > 0) {
                await uploadAllMedia(propertyId, formData.images);
            }

            if (formData.documents && Object.keys(formData.documents).length > 0) {
                await uploadAllDocuments(propertyId, formData.documents);
            }

            setCreatedPropertyId(null);
            setSearchParams({ tab: "properties" });
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to create property"), { autoClose: 5000 });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsUploading(true);
        let propertyId = createdPropertyId;
        try {
            const payload = buildPayload();
            payload.status = "draft";
            if (!propertyId) {
                const property = await createProperty(payload).unwrap();
                propertyId = property.data?._id || property._id;
                setCreatedPropertyId(propertyId);
            } else {
                await updateProperty({ id: propertyId, ...payload }).unwrap();
            }

            if (formData.images && Object.keys(formData.images).length > 0) {
                await uploadAllMedia(propertyId, formData.images);
            }

            if (formData.documents && Object.keys(formData.documents).length > 0) {
                await uploadAllDocuments(propertyId, formData.documents);
            }

            setCreatedPropertyId(null);
            setSearchParams({ tab: "properties" });
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to save draft"), { autoClose: 5000 });
        } finally {
            setIsUploading(false);
        }
    };

    const isLoading = isCreating || isUploading;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => setSearchParams({ tab: "properties" })} className="p-2 rounded-xl hover:bg-white transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Property</h1>
                    <p className="text-sm text-slate-500">Fill all required fields marked with <span className="text-red-500">*</span></p>
                </div>
            </div>

            <div className="pb-28">
                <PropertyFormBody formData={formData} onChange={handleChange} />
            </div>

            <footer className="fixed bottom-0 left-64 right-0 h-20 bg-white border-t flex items-center justify-end gap-3 px-8 z-50">
                <button onClick={() => setSearchParams({ tab: "properties" })} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                    Cancel
                </button>
                <button onClick={handleSaveDraft} disabled={isLoading} className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save as Draft"}
                </button>
                <button onClick={handlePublish} disabled={isLoading} className="px-8 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Property"}
                </button>
            </footer>
        </div>
    );
};

export default AddPropertyPage;
