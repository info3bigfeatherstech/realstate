import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import PropertyFormBody from "./PropertyFormBody";
import { isSellListingType, normalizeListingTypeForSubmit } from "../../../../utils/listingType";
import { buildFullPropertyPayload, EMPTY_RENTAL_DETAILS, EMPTY_SALE_DETAILS } from "../../../../utils/propertyFormPayload";
import {
    useCreatePropertyMutation,
    useUpdatePropertyMutation,
    useUploadMediaMutation,
    useUploadDocumentMutation
} from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";

const INITIAL_FORM = {
    listingType: "",
    propertyType: "",
    ownershipType: "Freehold",
    title: "",
    description: "",
    condition: "Brand New",
    constructionStatus: "Ready to Move",
    furnishing: "Unfurnished",
    facing: "North",
    areaValue: "",
    price: "",
    roi: "",
    bedrooms: "",
    bathrooms: "",
    floorNo: "",
    totalFloors: "",
    flooringType: "Marble",
    maintenance: "",
    waterSupply: "Municipal Water",
    powerBackup: "No Backup",
    parkingType: "No Parking",
    securityFeatures: [],
    amenities: [],
    connectivity: [],
    nearbyFacilities: [],
    fullAddress: "",
    city: "",
    state: "Delhi",
    pincode: "",
    latitude: "",
    longitude: "",
    rentalDetails: { ...EMPTY_RENTAL_DETAILS },
    saleDetails: { ...EMPTY_SALE_DETAILS },
    images: {},
    documents: {},
};

const CreatePropertyPage = () => {
    const [, setSearchParams] = useSearchParams();
    const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
    const [updateProperty] = useUpdatePropertyMutation();
    const [uploadMedia] = useUploadMediaMutation();
    const [uploadDocument] = useUploadDocumentMutation();
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [error, setError] = useState("");
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
        setError("");
    };

    const buildPayload = (statusOverride) => {
        const listingType = normalizeListingTypeForSubmit(formData.listingType);
        const payload = buildFullPropertyPayload(
            { ...formData, listingType },
            { isSell: isSellListingType(formData.listingType) }
        );
        if (statusOverride) payload.status = statusOverride;
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
        if (!formData.listingType || !formData.propertyType || !formData.title || !formData.price || !formData.fullAddress || !formData.city) {
            setError("Please fill all required fields");
            return;
        }

        setIsUploading(true);
        let propertyId = createdPropertyId;
        try {
            const payload = buildPayload("pending");
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
            setSearchParams({ tab: "my-properties" });
        } catch (err) {
            setError(err.data?.message || "Failed to create property");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveDraft = async () => {
        setIsUploading(true);
        let propertyId = createdPropertyId;
        try {
            const payload = buildPayload("draft");
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
            setSearchParams({ tab: "my-properties" });
        } catch (err) {
            setError(err.data?.message || "Failed to save draft");
        } finally {
            setIsUploading(false);
        }
    };

    const isLoading = isCreating || isUploading;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={() => setSearchParams({ tab: "my-properties" })} className="p-2 rounded-xl hover:bg-white transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Property</h1>
                    <p className="text-sm text-slate-500">Fill all required fields marked with <span className="text-red-500">*</span></p>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="pb-28">
                <PropertyFormBody formData={formData} onChange={handleChange} />
            </div>

            <footer className="fixed bottom-0 left-0 md:left-64 right-0 h-20 bg-white border-t flex items-center justify-end gap-3 px-8 z-50">
                <button onClick={() => setSearchParams({ tab: "my-properties" })} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
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

export default CreatePropertyPage;
