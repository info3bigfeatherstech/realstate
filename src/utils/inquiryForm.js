/**
 * Builds JSON or FormData body for unified inquiry submission.
 */
import { sanitizeAccommodationPayload } from "./inquiryFormDraft";

export const buildInquirySubmitBody = (formType, form) => {
  const contact = {
    fullName: form.fullName,
    mobile: form.mobile,
    email: form.email || null,
    alternativeMobile: form.alternativeMobile || null,
  };

  const location = form.location || {
    city: form.city || "",
    area: form.area || "",
    landmark: form.landmark || null,
    address: form.address || null,
  };

  const payload = form.payload || extractPayloadFromFlatForm(formType, form);

  const fileFields = Object.keys(form).filter(
    (key) => Array.isArray(form[key]) && form[key][0] instanceof File
  );

  const hasFiles = fileFields.some((key) => form[key]?.length > 0);

  const base = {
    contact,
    location,
    payload,
    remarks: form.remarks || null,
    message: form.message || null,
    saveAsDraft: Boolean(form.saveAsDraft),
  };

  if (!hasFiles) return base;

  const formData = new FormData();
  formData.append("contact", JSON.stringify(contact));
  formData.append("location", JSON.stringify(location));
  formData.append("payload", JSON.stringify(payload));
  if (base.remarks) formData.append("remarks", base.remarks);
  if (base.message) formData.append("message", base.message);
  formData.append("saveAsDraft", base.saveAsDraft ? "true" : "false");

  fileFields.forEach((field) => {
    (form[field] || []).forEach((file) => formData.append(field, file));
  });

  return formData;
};

const extractPayloadFromFlatForm = (formType, form) => {
  if (formType === "accommodation_requirement") {
    return sanitizeAccommodationPayload(form);
  }

  return form.payload || {};
};

export const FORM_TYPE_META = {
  accommodation_requirement: {
    label: "Accommodation Requirement",
    description: "Find rental, PG, or co-living accommodation",
    path: "/enquiry",
    accountTypes: ["seeker"],
  },
  buy_property: {
    label: "Buy Property Inquiry",
    description: "Tell us what property you want to buy",
    path: "/dashboard/inquiry/buy",
    accountTypes: ["seeker"],
  },
  sell_property: {
    label: "Sell Property Inquiry",
    description: "List your property for sale",
    path: "/dashboard/inquiry/sell",
    accountTypes: ["owner", "agent"],
  },
  accommodation_listing: {
    label: "Accommodation Listing",
    description: "Rent out your property, PG, or co-living space",
    path: "/dashboard/inquiry/listing",
    accountTypes: ["owner", "agent"],
  },
};
