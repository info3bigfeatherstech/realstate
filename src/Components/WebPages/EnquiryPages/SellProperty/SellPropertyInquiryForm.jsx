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
  propertyType: "",
  suitableFor: [],
  sizeValue: "",
  sizeUnit: "Sq. Ft.",
  bhk: "",
  floorNumber: "",
  totalFloors: "",
  parkingAvailable: "",
  facing: "",
  expectedSellingPrice: "",
  propertyCondition: "",
  ownershipType: "",
  legalDocumentType: "",
  titleStatus: "",
  additionalDocuments: [],
  documentStatus: "",
  priority: "",
  remarks: "",
  message: "",
  propertyImages: [],
  legalDocuments: [],
};

const SellPropertyInquiryForm = () => {
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

  const handleSubmit = async () => {
    if (!form.fullName || !form.mobile || !form.city || !form.area || !form.propertyType || !form.sizeValue || !form.expectedSellingPrice || !form.legalDocumentType || !form.priority) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const result = await submitInquiry({
        formType: "sell_property",
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
            propertyType: form.propertyType,
            suitableFor: form.suitableFor,
            propertySize: { value: Number(form.sizeValue), unit: form.sizeUnit },
            bhk: form.bhk || null,
            floorNumber: form.floorNumber || null,
            totalFloors: form.totalFloors || null,
            parkingAvailable: form.parkingAvailable || null,
            facing: form.facing || null,
            expectedSellingPrice: Number(form.expectedSellingPrice),
            propertyCondition: form.propertyCondition || null,
            ownershipType: form.ownershipType || null,
            legalDocumentType: form.legalDocumentType,
            titleStatus: form.titleStatus || null,
            additionalDocuments: form.additionalDocuments,
            documentStatus: form.documentStatus || null,
            priority: form.priority,
          },
        },
      }).unwrap();
      toast.success(`Inquiry submitted! Ref: ${result?.inquiryRef}`);
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
          <h1 className="text-2xl font-bold text-slate-800">Sell Property Inquiry</h1>
          <p className="text-sm text-slate-500 mt-1">Submit details to list your property for sale</p>
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
        <SectionHeader icon={Home} title="Property Details" />
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField label="Property Type" required value={form.propertyType} onChange={set("propertyType")} options={c.SELL_PROPERTY_TYPES} />
          <SelectField label="BHK" value={form.bhk} onChange={set("bhk")} options={c.SELL_BHK_OPTIONS} />
          <InputField label="Property Size" required type="number" value={form.sizeValue} onChange={set("sizeValue")} />
          <SelectField label="Unit" value={form.sizeUnit} onChange={set("sizeUnit")} options={c.AREA_UNITS} />
          <InputField label="Floor Number" value={form.floorNumber} onChange={set("floorNumber")} />
          <InputField label="Total Floors" type="number" value={form.totalFloors} onChange={set("totalFloors")} />
          <SelectField label="Facing" value={form.facing} onChange={set("facing")} options={c.INQUIRY_FACING_DIRECTIONS} />
          <SelectField label="Parking" value={form.parkingAvailable} onChange={set("parkingAvailable")} options={c.YES_NO} />
          <InputField label="Expected Selling Price (₹)" required type="number" value={form.expectedSellingPrice} onChange={set("expectedSellingPrice")} />
          <SelectField label="Property Condition" value={form.propertyCondition} onChange={set("propertyCondition")} options={c.SELL_PROPERTY_CONDITIONS} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Property Suitable For" options={c.PROPERTY_SUITABLE_FOR} selected={form.suitableFor} onChange={(v) => setForm((p) => ({ ...p, suitableFor: toggleArrayValue(p.suitableFor, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={MapPin} title="Property Location" />
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Property City" required value={form.city} onChange={set("city")} />
          <InputField label="Property Area / Address" required value={form.area} onChange={set("area")} />
          <InputField label="Landmark" value={form.landmark} onChange={set("landmark")} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={FileText} title="Legal & Documents" />
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField label="Ownership Type" value={form.ownershipType} onChange={set("ownershipType")} options={c.INQUIRY_OWNERSHIP_TYPES} />
          <SelectField label="Legal Document Type" required value={form.legalDocumentType} onChange={set("legalDocumentType")} options={c.INQUIRY_LEGAL_DOCUMENT_TYPES} />
          <SelectField label="Title Status" value={form.titleStatus} onChange={set("titleStatus")} options={c.TITLE_STATUSES} />
          <SelectField label="Document Status" value={form.documentStatus} onChange={set("documentStatus")} options={c.DOCUMENT_STATUSES} />
          <SelectField label="Sale Timeline" required value={form.priority} onChange={set("priority")} options={c.SELL_PRIORITY_TIMELINES} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Additional Documents" options={c.ADDITIONAL_DOCUMENTS} selected={form.additionalDocuments} onChange={(v) => setForm((p) => ({ ...p, additionalDocuments: toggleArrayValue(p.additionalDocuments, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={IndianRupee} title="Remarks & Uploads" />
        <div className="grid gap-4">
          <TextAreaField label="Remarks" value={form.remarks} onChange={set("remarks")} />
          <TextAreaField label="Detailed Description" value={form.message} onChange={set("message")} maxLength={5000} rows={5} />
          <FileField label="Property Images (optional)" multiple accept="image/*" files={form.propertyImages} onChange={set("propertyImages")} />
          <FileField label="Legal Documents (optional)" multiple files={form.legalDocuments} onChange={set("legalDocuments")} />
        </div>
      </div>

      <div className="flex justify-end pb-8">
        <button type="button" onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Inquiry
        </button>
      </div>
    </div>
  );
};

export default SellPropertyInquiryForm;
