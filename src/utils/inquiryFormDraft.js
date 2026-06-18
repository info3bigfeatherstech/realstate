const DRAFT_KEY = "inquiry_draft_accommodation_requirement";
const PENDING_SUBMIT_KEY = "inquiry_pending_submit_accommodation";

const stripFiles = (form) => {
  const { referenceImages, otherFiles, ...rest } = form;
  return rest;
};

export const saveAccommodationDraft = (form) => {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(stripFiles(form)));
  } catch {
    // sessionStorage full or unavailable — non-fatal
  }
};

export const loadAccommodationDraft = () => {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAccommodationDraft = () => {
  sessionStorage.removeItem(DRAFT_KEY);
  sessionStorage.removeItem(PENDING_SUBMIT_KEY);
};

export const markAccommodationPendingSubmit = () => {
  sessionStorage.setItem(PENDING_SUBMIT_KEY, "1");
};

export const hasAccommodationPendingSubmit = () =>
  sessionStorage.getItem(PENDING_SUBMIT_KEY) === "1";

export const consumeAccommodationPendingSubmit = () => {
  const pending = hasAccommodationPendingSubmit();
  sessionStorage.removeItem(PENDING_SUBMIT_KEY);
  return pending;
};

const RENTAL_TYPES = ["Rental Property"];
const SHARING_TYPES = ["PG Accommodation", "Co-Living Accommodation"];

/** Client-side mirror of backend normalize — omit irrelevant fields before submit */
export const sanitizeAccommodationPayload = (form) => {
  const emptyToNull = (v) => (v === "" || v === undefined ? null : v);

  const payload = {
    requirementType: emptyToNull(form.requirementType),
    occupantType: emptyToNull(form.occupantType),
    genderPreference: emptyToNull(form.genderPreference),
    monthlyBudget: emptyToNull(form.monthlyBudget),
    propertyType: emptyToNull(form.propertyType),
    bhkRequirement: emptyToNull(form.bhkRequirement),
    tenantTypePreference: emptyToNull(form.tenantTypePreference),
    foodPreference: emptyToNull(form.foodPreference),
    petPreference: emptyToNull(form.petPreference),
    smokingPreference: emptyToNull(form.smokingPreference),
    alcoholPreference: emptyToNull(form.alcoholPreference),
    sharingPreference: emptyToNull(form.sharingPreference),
    furnishingPreference: emptyToNull(form.furnishingPreference),
    amenitiesRequired: form.amenitiesRequired || [],
    moveInPriority: emptyToNull(form.moveInPriority),
  };

  if (!RENTAL_TYPES.includes(payload.requirementType)) {
    payload.propertyType = null;
    payload.bhkRequirement = null;
    payload.tenantTypePreference = null;
  }

  if (!SHARING_TYPES.includes(payload.requirementType)) {
    payload.sharingPreference = null;
  }

  return payload;
};

export const buildReturnUrl = (pathname, search = "") => {
  const path = `${pathname}${search}`;
  return encodeURIComponent(path || "/enquiry");
};

export const getReturnUrl = (searchParams, fallback = "/enquiry") => {
  const raw = searchParams.get("returnUrl");
  if (!raw) return fallback;
  try {
    return decodeURIComponent(raw);
  } catch {
    return fallback;
  }
};
