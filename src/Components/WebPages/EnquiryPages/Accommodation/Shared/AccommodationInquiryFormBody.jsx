import React, { useState } from "react";
import {
  User,
  MapPin,
  Home,
  IndianRupee,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { useGetConstantsQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { useSubmitAccommodationInquiryMutation } from "../../../../../REDUX_FEATURES/REDUX_SLICES/userAccommodationInquiryApi/userAccommodationInquiryApi";
import { toast, getApiErrorMessage } from "../../../../Shared/ToastConfig";

const RENTAL_TYPES = ["Rental Property"];
const SHARING_TYPES = ["PG Accommodation", "Co-Living Accommodation"];

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const Field = ({ label, required, children }) => (
  <div>
    <label className={labelCls}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const InputField = ({ label, required, type = "text", placeholder, value, onChange, maxLength }) => (
  <Field label={label} required={required}>
    <input
      className={inputCls}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
    />
  </Field>
);

const SelectField = ({ label, required, value, onChange, options }) => (
  <Field label={label} required={required}>
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {(options || []).map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </Field>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
      <Icon className="w-4 h-4 text-blue-600" />
    </div>
    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
  </div>
);

const INITIAL_FORM = {
  fullName: "",
  mobile: "",
  email: "",
  alternativeMobile: "",
  requirementType: "",
  occupantType: "",
  genderPreference: "",
  city: "",
  area: "",
  landmark: "",
  monthlyBudget: "",
  propertyType: "",
  bhkRequirement: "",
  tenantTypePreference: "",
  foodPreference: "",
  petPreference: "",
  smokingPreference: "",
  alcoholPreference: "",
  sharingPreference: "",
  furnishingPreference: "",
  amenitiesRequired: [],
  moveInPriority: "",
  remarks: "",
  message: "",
  referenceImages: [],
  otherFiles: [],
};

const validateForm = (form, isDraft) => {
  const errors = [];

  if (!form.fullName?.trim()) errors.push("Full name is required");
  if (!form.mobile?.trim()) errors.push("Mobile number is required");

  if (isDraft) return errors;

  if (!form.requirementType) errors.push("Requirement type is required");
  if (!form.occupantType) errors.push("Occupant type is required");
  if (!form.city?.trim()) errors.push("City is required");
  if (!form.area?.trim()) errors.push("Area is required");
  if (!form.monthlyBudget) errors.push("Monthly budget is required");
  if (!form.moveInPriority) errors.push("Move-in priority is required");

  if (RENTAL_TYPES.includes(form.requirementType)) {
    if (!form.propertyType && !form.bhkRequirement) {
      errors.push("At least one of Property Type or BHK Requirement is required for rental inquiries");
    }
  }

  if (SHARING_TYPES.includes(form.requirementType) && !form.sharingPreference) {
    errors.push("Sharing preference is required for PG or Co-Living inquiries");
  }

  return errors;
};

const AccommodationInquiryFormBody = () => {
  const { data: constants, isLoading: constantsLoading } = useGetConstantsQuery();
  const [submitInquiry, { isLoading: isSubmitting }] = useSubmitAccommodationInquiryMutation();
  const [form, setForm] = useState(INITIAL_FORM);

  const set = (field) => (val) => setForm((prev) => ({ ...prev, [field]: val }));

  const isRental = RENTAL_TYPES.includes(form.requirementType);
  const isSharing = SHARING_TYPES.includes(form.requirementType);

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenitiesRequired.includes(amenity);
      return {
        ...prev,
        amenitiesRequired: exists
          ? prev.amenitiesRequired.filter((a) => a !== amenity)
          : [...prev.amenitiesRequired, amenity],
      };
    });
  };

  const handleFileChange = (field, files) => {
    setForm((prev) => ({ ...prev, [field]: Array.from(files) }));
  };

  const handleReset = () => setForm(INITIAL_FORM);

  const handleSubmit = async (saveAsDraft) => {
    const errors = validateForm(form, saveAsDraft);
    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    try {
      const result = await submitInquiry({ ...form, saveAsDraft }).unwrap();
      if (saveAsDraft) {
        toast.success("Draft saved successfully");
      } else {
        toast.success(`Inquiry submitted! Reference: ${result?.inquiryRef || "N/A"}`);
        handleReset();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to submit inquiry"));
    }
  };

  if (constantsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const c = constants || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Accommodation Inquiry</h1>
        <p className="text-slate-500 mt-2 text-sm">
          Tell us what you are looking for — rental, PG, or co-living. We will match you with the best options.
        </p>
      </div>

      {/* Personal */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={User} title="Personal Details" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="Full Name" required value={form.fullName} onChange={set("fullName")} maxLength={120} placeholder="Enter your full name" />
          <InputField label="Mobile" required type="tel" value={form.mobile} onChange={set("mobile")} maxLength={20} placeholder="+91 XXXXXXXXXX" />
          <InputField label="Email" type="email" value={form.email} onChange={set("email")} maxLength={160} placeholder="email@example.com (optional)" />
          <InputField label="Alternative Mobile" type="tel" value={form.alternativeMobile} onChange={set("alternativeMobile")} maxLength={20} placeholder="Optional" />
        </div>
      </div>

      {/* Requirement Type */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={Home} title="Requirement Type" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField label="Requirement Type" required value={form.requirementType} onChange={set("requirementType")} options={c.REQUIREMENT_TYPES} />
          <SelectField label="Occupant Type" required value={form.occupantType} onChange={set("occupantType")} options={c.OCCUPANT_TYPES} />
          <SelectField label="Gender Preference" value={form.genderPreference} onChange={set("genderPreference")} options={c.GENDER_PREFERENCES} />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={MapPin} title="Preferred Location" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField label="City" required value={form.city} onChange={set("city")} maxLength={100} placeholder="e.g. Mumbai" />
          <InputField label="Area / Locality" required value={form.area} onChange={set("area")} maxLength={200} placeholder="e.g. Andheri West" />
          <InputField label="Landmark" value={form.landmark} onChange={set("landmark")} maxLength={200} placeholder="Optional landmark" />
        </div>
      </div>

      {/* Budget */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={IndianRupee} title="Budget" />
        <SelectField label="Monthly Budget" required value={form.monthlyBudget} onChange={set("monthlyBudget")} options={c.MONTHLY_BUDGETS} />
      </div>

      {/* Rental-specific */}
      {isRental && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionHeader icon={Home} title="Rental Preferences" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField label="Property Type" value={form.propertyType} onChange={set("propertyType")} options={c.INQUIRY_PROPERTY_TYPES} />
            <SelectField label="BHK Requirement" value={form.bhkRequirement} onChange={set("bhkRequirement")} options={c.BHK_REQUIREMENTS} />
            <SelectField label="Tenant Type Preference" value={form.tenantTypePreference} onChange={set("tenantTypePreference")} options={c.TENANT_TYPE_PREFERENCES} />
          </div>
          <p className="text-xs text-slate-400 mt-3">At least one of Property Type or BHK Requirement is required.</p>
        </div>
      )}

      {/* PG / Co-Living */}
      {isSharing && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <SectionHeader icon={Home} title="Sharing Preference" />
          <SelectField label="Sharing Preference" required value={form.sharingPreference} onChange={set("sharingPreference")} options={c.SHARING_PREFERENCES} />
        </div>
      )}

      {/* Lifestyle */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={User} title="Lifestyle Preferences" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField label="Food Preference" value={form.foodPreference} onChange={set("foodPreference")} options={c.INQUIRY_FOOD_PREFERENCES} />
          <SelectField label="Pet Preference" value={form.petPreference} onChange={set("petPreference")} options={c.INQUIRY_PET_PREFERENCES} />
          <SelectField label="Smoking Preference" value={form.smokingPreference} onChange={set("smokingPreference")} options={c.INQUIRY_SMOKING_PREFERENCES} />
          <SelectField label="Alcohol Preference" value={form.alcoholPreference} onChange={set("alcoholPreference")} options={c.INQUIRY_ALCOHOL_PREFERENCES} />
          <SelectField label="Furnishing Preference" value={form.furnishingPreference} onChange={set("furnishingPreference")} options={c.INQUIRY_FURNISHING_PREFERENCES} />
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={Home} title="Amenities Required" />
        <div className="flex flex-wrap gap-2">
          {(c.INQUIRY_AMENITIES || []).map((amenity) => {
            const selected = form.amenitiesRequired.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Move-in */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={Calendar} title="Move-in Timeline" />
        <SelectField label="Move-in Priority" required value={form.moveInPriority} onChange={set("moveInPriority")} options={c.MOVE_IN_PRIORITIES} />
      </div>

      {/* Remarks & Files */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <SectionHeader icon={FileText} title="Remarks & Attachments" />
        <div className="grid grid-cols-1 gap-5">
          <Field label="Remarks">
            <input className={inputCls} value={form.remarks} onChange={(e) => set("remarks")(e.target.value)} maxLength={200} placeholder="Short note (max 200 chars)" />
          </Field>
          <Field label="Message">
            <textarea
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm bg-white resize-none"
              rows={4}
              value={form.message}
              onChange={(e) => set("message")(e.target.value)}
              maxLength={1000}
              placeholder="Any additional details (max 1000 chars)"
            />
          </Field>
          <Field label="Reference Images">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange("referenceImages", e.target.files)}
              className="text-sm text-slate-600"
            />
            {form.referenceImages.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">{form.referenceImages.length} file(s) selected</p>
            )}
          </Field>
          <Field label="Other Files">
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange("otherFiles", e.target.files)}
              className="text-sm text-slate-600"
            />
            {form.otherFiles.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">{form.otherFiles.length} file(s) selected</p>
            )}
          </Field>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end pb-8">
        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-lg border border-blue-600 text-sm font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Submit Inquiry
        </button>
      </div>
    </div>
  );
};

export default AccommodationInquiryFormBody;
