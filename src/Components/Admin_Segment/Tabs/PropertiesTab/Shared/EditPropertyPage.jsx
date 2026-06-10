import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyFormBody from "./PropertyFormBody";
import { ArrowLeft } from "lucide-react";

const EMPTY_FORM = {
  listingType: "For Sale",
  propertyType: "Flat",
  ownershipType: "Freehold",
  title: "",
  description: "",
  condition: "Brand New",
  constructionStatus: "Ready to Move",
  furnishing: "Unfurnished",
  facing: "North",
  area: "",
  price: "",
  bedrooms: "0",
  bathrooms: "0",
  floorNo: "0",
  totalFloors: "0",
  maintenance: "",
  flooringType: "Marble",
  waterSupply: "Municipal Water",
  powerBackup: "No Backup",
  parkingType: "No Parking",
  security: [],
  amenities: [],
  connectivity: [],
  nearbyFacilities: [],
  address: "",
  city: "",
  state: "Delhi",
  pincode: "",
  latitude: "",
  longitude: "",
};

const EditPropertyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const propertyId = searchParams.get("id");

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    // TODO: replace with real API call
    // const res = await dispatch(fetchPropertyById(propertyId));
    // setFormData(mapApiDataToForm(res));
    setTimeout(() => {
      // Mock prefill for now
      setFormData((prev) => ({
        ...prev,
        title: "Sample Property " + propertyId,
        price: "5000000",
        city: "Delhi",
      }));
      setLoading(false);
    }, 500);
  }, [propertyId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => setSearchParams({ tab: "properties" });

  const handleSaveDraft = () => {
    // TODO: call updateProperty API with status: draft
    console.log("Save draft:", propertyId, formData);
  };

  const handleUpdate = () => {
    // TODO: call updateProperty API
    console.log("Update property:", propertyId, formData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-slate-800">Edit Property</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Update the details below. All fields marked with <span className="text-red-500">*</span> are mandatory.
          </p>
        </div>
      </div>

      <div className="pb-28">
        <PropertyFormBody formData={formData} onChange={handleChange} mode="edit" />
      </div>

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
            onClick={handleUpdate}
            className="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
          >
            Update Property
          </button>
        </div>
      </footer>
    </div>
  );
};

export default EditPropertyPage;
