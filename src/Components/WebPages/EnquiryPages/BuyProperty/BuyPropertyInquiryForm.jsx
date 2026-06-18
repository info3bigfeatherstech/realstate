import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { User, MapPin, Home, IndianRupee, Calendar, Loader2 } from "lucide-react";
import { useGetConstantsQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { useSubmitInquiryMutation } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInquiryApi/customerInquiryApi";
import { toast } from "../../../Shared/ToastConfig";
import {
  InputField,
  SelectField,
  TextAreaField,
  SectionHeader,
  CheckboxGroup,
  FileField,
  toggleArrayValue,
} from "../Shared/InquiryFormFields";

const RENTAL_TYPES = ["Rental Property"];
const SHARING_TYPES = ["PG Accommodation", "Co-Living Accommodation"];

const INITIAL = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  area: "",
  landmark: "",
  propertyType: "",
  intendedUse: [],
  budgetRange: "",
  bhkRequirement: "",
  sizeValue: "",
  sizeUnit: "Sq. Ft.",
  propertyStatusPreference: "",
  amenitiesPreferred: [],
  priority: "",
  remarks: "",
  message: "",
  attachments: [],
};

const BuyPropertyInquiryForm = () => {
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
    if (!form.fullName || !form.mobile || !form.city || !form.area || !form.propertyType || !form.budgetRange || !form.priority) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const result = await submitInquiry({
        formType: "buy_property",
        form: {
          ...form,
          payload: {
            propertyType: form.propertyType,
            intendedUse: form.intendedUse,
            budgetRange: form.budgetRange,
            bhkRequirement: form.bhkRequirement || null,
            propertySize: form.sizeValue ? { value: Number(form.sizeValue), unit: form.sizeUnit } : null,
            propertyStatusPreference: form.propertyStatusPreference || null,
            amenitiesPreferred: form.amenitiesPreferred,
            priority: form.priority,
          },
        },
      }).unwrap();
      toast.success(`Inquiry submitted! Ref: ${result?.inquiryRef}`);
      setForm({ ...INITIAL, fullName: user?.fullName, mobile: user?.mobile, email: user?.email });
    } catch (err) {
      toast.error(err?.data?.message || "Submission failed");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Buy Property Inquiry</h1>
          <p className="text-sm text-slate-500 mt-1">Tell us what you are looking to purchase</p>
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
        <SectionHeader icon={Home} title="Property Requirement" />
        <div className="grid md:grid-cols-2 gap-4">
          <SelectField label="Property Type" required value={form.propertyType} onChange={set("propertyType")} options={c.BUY_PROPERTY_TYPES} />
          <SelectField label="BHK Requirement" value={form.bhkRequirement} onChange={set("bhkRequirement")} options={c.BUY_BHK_REQUIREMENTS} />
          <SelectField label="Budget Range" required value={form.budgetRange} onChange={set("budgetRange")} options={c.BUY_BUDGET_RANGES} />
          <SelectField label="Property Status" value={form.propertyStatusPreference} onChange={set("propertyStatusPreference")} options={c.PROPERTY_STATUS_PREFERENCES} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Intended Use" options={c.INTENDED_USES} selected={form.intendedUse} onChange={(v) => setForm((p) => ({ ...p, intendedUse: toggleArrayValue(p.intendedUse, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={MapPin} title="Location Requirement" />
        <div className="grid md:grid-cols-2 gap-4">
          <InputField label="Preferred City" required value={form.city} onChange={set("city")} />
          <InputField label="Preferred Area" required value={form.area} onChange={set("area")} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={IndianRupee} title="Size & Amenities" />
        <div className="grid md:grid-cols-3 gap-4">
          <InputField label="Min Size" type="number" value={form.sizeValue} onChange={set("sizeValue")} />
          <SelectField label="Unit" value={form.sizeUnit} onChange={set("sizeUnit")} options={c.AREA_UNITS} />
        </div>
        <div className="mt-4">
          <CheckboxGroup label="Amenities Preferred" options={c.BUY_AMENITIES} selected={form.amenitiesPreferred} onChange={(v) => setForm((p) => ({ ...p, amenitiesPreferred: toggleArrayValue(p.amenitiesPreferred, v) }))} />
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <SectionHeader icon={Calendar} title="Timeline" />
        <SelectField label="Priority / Required By" required value={form.priority} onChange={set("priority")} options={c.BUY_PRIORITY_TIMELINES} />
        <div className="grid gap-4 mt-4">
          <TextAreaField label="Remarks" value={form.remarks} onChange={set("remarks")} maxLength={2000} />
          <TextAreaField label="Detailed Requirement" value={form.message} onChange={set("message")} maxLength={5000} rows={5} />
          <FileField label="Attachments (optional)" multiple files={form.attachments} onChange={set("attachments")} />
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

export default BuyPropertyInquiryForm;
