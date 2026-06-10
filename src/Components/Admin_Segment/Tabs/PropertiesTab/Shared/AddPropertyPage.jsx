// src/pages/AddPropertyPage.jsx
// Page wrapper — owns formData state, passes to PropertyFormBody
// Future: call addProperty API on handlePublish

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PropertyFormBody from "./PropertyFormBody";

const INITIAL_FORM = {
    // Basic
    listingType: "Select Type",
    propertyType: "Select Property",
    ownershipType: "Freehold",
    title: "",
    description: "",
    // Details
    condition: "New Construction",
    constructionStatus: "Ready to Move",
    furnishing: "Unfurnished",
    facing: "North",
    area: "",
    price: "",
    bedrooms: "0",
    bathrooms: "0",
    floorNo: "",
    totalFloors: "",
    flooringType: "Marble",
    maintenance: "",
    // Utilities
    waterSupply: "Corporation",
    powerBackup: "None",
    parkingType: "Covered (Stilt)",
    security: [],
    // Amenities / Nearby
    amenities: [],
    connectivity: [],
    nearbyFacilities: [],
    // Location
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    latitude: "",
    longitude: "",
};

const AddPropertyPage = () => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [, setSearchParams] = useSearchParams();

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveDraft = () => {
        // TODO: call saveDraft API
        console.log("Save as draft:", formData);
    };

    const handlePublish = () => {
        // TODO: call addProperty API
        console.log("Publish property:", formData);
    };

    const handleCancel = () => setSearchParams({ tab: "properties" });

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Page Header */}
            <div className="mb-6 flex items-center gap-4">

                <button
                    type="button"
                    onClick={() => setSearchParams({ tab: "properties" })}
                    className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Property</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Fill in the details below to list a new property. All fields marked with <span className="text-red-500">*</span> are mandatory.
                    </p>
                </div>
            </div>

            {/* Form Body — reusable */}
            <div className="pb-28">
                <PropertyFormBody formData={formData} onChange={handleChange} mode="add" />
            </div>

            {/* Sticky Bottom Action Bar */}
            <footer className="fixed bottom-0 left-64 right-0 h-20 bg-white border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50 flex items-center px-8">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
                <div className="flex-1" />
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        className="px-6 py-2.5 rounded-xl border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={handlePublish}
                        className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                    >
                        Publish Property
                    </button>
                </div>
            </footer>

        </div>
    );
};

export default AddPropertyPage;