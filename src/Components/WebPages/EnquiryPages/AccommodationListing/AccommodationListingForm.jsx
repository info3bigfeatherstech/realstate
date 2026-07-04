import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, MapPin, Home, IndianRupee, FileText, Loader2 } from "lucide-react";
import { useGetConstantsQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { useSubmitInquiryMutation } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInquiryApi/customerInquiryApi";
import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";
import {
  InputField,
  SelectField,
  TextAreaField,
  SectionHeader,
  CheckboxGroup,
  FileField,
  toggleArrayValue,
} from "../Shared/InquiryFormFields";

const INITIAL = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  area: "",
  landmark: "",
  listingType: "",
  propertyName: "",
  propertyType: "",
  suitableFor: [],
  businessUse: [],
  sizeValue: "",
  sizeUnit: "Sq. Ft.",
  floorNumber: "",
  totalFloors: "",
  bhk: "",
  totalBeds: "",
  availableBeds: "",
  expectedMonthlyRent: "",
  securityDeposit: "",
  maintenanceCharges: "",
  rentPerBed: "",
  furnishingStatus: "",
  amenitiesAvailable: [],
  ownershipType: "",
  legalDocumentType: "",
  titleStatus: "",
  additionalDocuments: [],
  documentStatus: "",
  availableFrom: "",
  availableFromDate: "",
  listingUrgency: "",
  remarks: "",
  message: "",
  propertyImages: [],
  legalDocuments: [],
};

const AccommodationListingForm = () => {
  const { user } = useSelector((state) => state.customerAuth);
  const { data: c = {}, isLoading } = useGetConstantsQuery();
  const [submitInquiry, { isLoading: submitting }] = useSubmitInquiryMutation();
  const [form, setForm] = useState({
    ...INITIAL,
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
  });

  const set = (field) => (val) => setForm((p) => ({ ...p, [field]: val }));
  const isSpecificDate = form.availableFrom === "Specific Date";

  const handleSubmit = async () => {
    if (!form.fullName || !form.mobile || !form.city || !form.area || !form.listingType || !form.expectedMonthlyRent || !form.legalDocumentType || !form.availableFrom || !form.listingUrgency) {
      toast.error("Please fill all required fields");
      return;
    }
    if (isSpecificDate && !form.availableFromDate) {
      toast.error("Please select an available from date");
      return;
    }
    try {
      const result = await submitInquiry({
        formType: "accommodation_listing",
        form: {
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          city: form.city,
          area: form.area,
          landmark: form.landmark,
          remarks: form.remarks,
          message: form.message,
          propertyImages: form.propertyImages,
          legalDocuments: form.legalDocuments,
          payload: {
            listingType: form.listingType,
            propertyName: form.propertyName || null,
            propertyType: form.propertyType || null,
            suitableFor: form.suitableFor,
            businessUse: form.businessUse,
            propertySize: form.sizeValue ? { value: Number(form.sizeValue), unit: form.sizeUnit } : null,
            floorNumber: form.floorNumber || null,
            totalFloors: form.totalFloors || null,
            bhk: form.bhk || null,
            totalBeds: form.totalBeds ? Number(form.totalBeds) : null,
            availableBeds: form.availableBeds ? Number(form.availableBeds) : null,
            expectedMonthlyRent: Number(form.expectedMonthlyRent),
            securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : null,
            maintenanceCharges: form.maintenanceCharges ? Number(form.maintenanceCharges) : null,
            rentPerBed: form.rentPerBed ? Number(form.rentPerBed) : null,
            furnishingStatus: form.furnishingStatus || null,
            amenitiesAvailable: form.amenitiesAvailable,
            ownershipType: form.ownershipType || null,
            legalDocumentType: form.legalDocumentType,
            titleStatus: form.titleStatus || null,
            additionalDocuments: form.additionalDocuments,
            documentStatus: form.documentStatus || null,
            availableFrom: form.availableFrom,
            availableFromDate: isSpecificDate && form.availableFromDate
              ? new Date(form.availableFromDate).toISOString()
              : null,
            listingUrgency: form.listingUrgency,
          },
        },
      }).unwrap();
      toast.success(`Listing inquiry submitted! Ref: ${result?.inquiryRef}`);
      setForm({ ...INITIAL, fullName: user?.fullName, mobile: user?.mobile, email: user?.email });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Submission failed"));
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Accommodation Listing</h1>
          <p className="text-sm text-slate-500 mt-1">Rent out your property, PG, or co-living space</p>
        </div>
        <Link to="/dashboard" className="text-sm text-blue-600 font-semibold hover:underline">← Dashboard</Link>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={User} title="Personal Details" />
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Full Name" required value={form.fullName} onChange={set("fullName")} />
          <InputField label="Mobile" required value={form.mobile} onChange={set("mobile")} />
          <InputField label="Email" type="email" value={form.email} onChange={set("email")} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={Home} title="Listing Details" />
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField label="Listing Type" required value={form.listingType} onChange={set("listingType")} options={c.INQUIRY_LISTING_TYPES} />
          <InputField label="Property Name (optional)" value={form.propertyName} onChange={set("propertyName")} />
          <SelectField label="Property Type" value={form.propertyType} onChange={set("propertyType")} options={c.LISTING_PROPERTY_TYPES} />
          <InputField label="Property Size" type="number" value={form.sizeValue} onChange={set("sizeValue")} />
          <SelectField label="Unit" value={form.sizeUnit} onChange={set("sizeUnit")} options={c.AREA_UNITS} />
          <SelectField label="BHK" value={form.bhk} onChange={set("bhk")} options={c.LISTING_BHK_OPTIONS} />
          <InputField label="Floor No" value={form.floorNumber} onChange={set("floorNumber")} />
          <InputField label="Total Floors" type="number" value={form.totalFloors} onChange={set("totalFloors")} />
          <InputField label="Total Beds" type="number" value={form.totalBeds} onChange={set("totalBeds")} />
          <InputField label="Available Beds" type="number" value={form.availableBeds} onChange={set("availableBeds")} />
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <CheckboxGroup label="Suitable For" options={c.OCCUPANT_SUITABILITY} selected={form.suitableFor} onChange={(v) => setForm((p) => ({ ...p, suitableFor: toggleArrayValue(p.suitableFor, v) }))} />
          <CheckboxGroup label="Business Use" options={c.BUSINESS_USE_TYPES} selected={form.businessUse} onChange={(v) => setForm((p) => ({ ...p, businessUse: toggleArrayValue(p.businessUse, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={MapPin} title="Location" />
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Property City" required value={form.city} onChange={set("city")} />
          <InputField label="Property Area / Address" required value={form.area} onChange={set("area")} />
          <InputField label="Landmark" value={form.landmark} onChange={set("landmark")} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={IndianRupee} title="Pricing" />
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Expected Monthly Rent (₹)" required type="number" value={form.expectedMonthlyRent} onChange={set("expectedMonthlyRent")} />
          <InputField label="Security Deposit" type="number" value={form.securityDeposit} onChange={set("securityDeposit")} />
          <InputField label="Maintenance Charges" type="number" value={form.maintenanceCharges} onChange={set("maintenanceCharges")} />
          <InputField label="Rent Per Bed" type="number" value={form.rentPerBed} onChange={set("rentPerBed")} />
          <SelectField label="Furnishing" value={form.furnishingStatus} onChange={set("furnishingStatus")} options={["Fully Furnished", "Semi-Furnished", "Unfurnished"]} />
          <SelectField label="Available From" required value={form.availableFrom} onChange={set("availableFrom")} options={c.AVAILABLE_FROM_OPTIONS} />
          {isSpecificDate && (
            <InputField label="Available From Date" required type="date" value={form.availableFromDate} onChange={set("availableFromDate")} />
          )}
          <SelectField label="Listing Urgency" required value={form.listingUrgency} onChange={set("listingUrgency")} options={c.LISTING_URGENCY_OPTIONS} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Amenities Available" options={c.LISTING_AMENITIES} selected={form.amenitiesAvailable} onChange={(v) => setForm((p) => ({ ...p, amenitiesAvailable: toggleArrayValue(p.amenitiesAvailable, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={FileText} title="Legal & Uploads" />
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField label="Ownership Type" value={form.ownershipType} onChange={set("ownershipType")} options={c.INQUIRY_OWNERSHIP_TYPES} />
          <SelectField label="Legal Document Type" required value={form.legalDocumentType} onChange={set("legalDocumentType")} options={c.INQUIRY_LEGAL_DOCUMENT_TYPES} />
          <SelectField label="Title Status" value={form.titleStatus} onChange={set("titleStatus")} options={c.TITLE_STATUSES} />
          <SelectField label="Document Status" value={form.documentStatus} onChange={set("documentStatus")} options={c.DOCUMENT_STATUSES} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Additional Documents" options={c.ADDITIONAL_DOCUMENTS} selected={form.additionalDocuments} onChange={(v) => setForm((p) => ({ ...p, additionalDocuments: toggleArrayValue(p.additionalDocuments, v) }))} />
        </div>
        <div className="grid gap-4 mt-4">
          <TextAreaField label="Remarks" value={form.remarks} onChange={set("remarks")} />
          <TextAreaField label="Detailed Description" value={form.message} onChange={set("message")} maxLength={5000} rows={5} />
          <FileField label="Property Images (optional)" multiple accept="image/*" files={form.propertyImages} onChange={set("propertyImages")} />
          <FileField label="Legal Documents (optional)" multiple files={form.legalDocuments} onChange={set("legalDocuments")} />
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <button type="button" onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Listing Inquiry
        </button>
      </div>
    </div>
  );
};

export default AccommodationListingForm;
