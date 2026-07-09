import { formatListingTypeLabel } from "./listingType";
import { OTHER_OPTION, getTitleOptions } from "./propertyFormConstants";

export { OTHER_OPTION };

export const resolveOtherField = (value, otherValues = {}, key) => {
  if (value === OTHER_OPTION) {
    return (otherValues?.[key] ?? "").trim();
  }
  return value ?? "";
};

export const splitOtherField = (savedValue, options = []) => {
  if (!savedValue) return { value: "", other: "" };
  const baseOptions = (options ?? []).filter((o) => o !== OTHER_OPTION);
  if (baseOptions.includes(savedValue)) return { value: savedValue, other: "" };
  return { value: OTHER_OPTION, other: savedValue };
};

const resolveFormField = (value, otherValues, key) =>
  toNullIfEmpty(resolveOtherField(value, otherValues, key));

export const EMPTY_RENTAL_DETAILS = {
  tenantTypeAllowed: [],
  occupationPreference: "",
  employmentVerification: [],
  rentalAgreementDuration: "",
  minimumStayDuration: "",
  lockInPeriod: "",
  availability: "",
  availabilityDate: "",
  foodPreference: "",
  pets: "",
  smoking: "",
  alcohol: "",
  guestPolicy: "",
  tenantVerification: [],
  securityDeposit: "",
  securityDepositCustomAmount: "",
  preferredMoveInDate: "",
  preferredMoveInDateSpecific: "",
  governmentEmployeePreferred: false,
  otherValues: {},
};

export const EMPTY_SALE_DETAILS = {
  possessionStatus: "",
  loanAvailability: "",
  otherValues: {},
};

const toNullIfEmpty = (value) => (value === "" || value === undefined ? null : value);

const toNumberOrNull = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const formatDateForApi = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const formatDateForInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

export const isRentalListingType = (listingType) =>
  listingType === "For Rent" || listingType === "PG";

export const mapRentalDetailsToForm = (rentalDetails) => {
  if (!rentalDetails) return { ...EMPTY_RENTAL_DETAILS };
  return {
    tenantTypeAllowed: rentalDetails.tenantTypeAllowed || [],
    occupationPreference: rentalDetails.occupationPreference || "",
    employmentVerification: rentalDetails.employmentVerification || [],
    rentalAgreementDuration: rentalDetails.rentalAgreementDuration || "",
    minimumStayDuration: rentalDetails.minimumStayDuration || "",
    lockInPeriod: rentalDetails.lockInPeriod || "",
    availability: rentalDetails.availability || "",
    availabilityDate: formatDateForInput(rentalDetails.availabilityDate),
    foodPreference: rentalDetails.foodPreference || "",
    pets: rentalDetails.pets || "",
    smoking: rentalDetails.smoking || "",
    alcohol: rentalDetails.alcohol || "",
    guestPolicy: rentalDetails.guestPolicy || "",
    tenantVerification: rentalDetails.tenantVerification || [],
    securityDeposit: rentalDetails.securityDeposit || "",
    securityDepositCustomAmount:
      rentalDetails.securityDepositCustomAmount ?? "",
    preferredMoveInDate: rentalDetails.preferredMoveInDate || "",
    preferredMoveInDateSpecific: formatDateForInput(
      rentalDetails.preferredMoveInDateSpecific
    ),
    governmentEmployeePreferred: Boolean(
      rentalDetails.governmentEmployeePreferred
    ),
    otherValues: {},
  };
};

export const mapSaleDetailsToForm = (saleDetails) => {
  if (!saleDetails) return { ...EMPTY_SALE_DETAILS };
  return {
    possessionStatus: saleDetails.possessionStatus || "",
    loanAvailability: saleDetails.loanAvailability || "",
    otherValues: {},
  };
};

export const buildRentalDetailsPayload = (rentalDetails, listingType) => {
  if (!isRentalListingType(listingType) || !rentalDetails) return null;

  const otherValues = rentalDetails.otherValues || {};
  const securityDeposit = resolveFormField(
    rentalDetails.securityDeposit,
    otherValues,
    "securityDeposit"
  );
  const availability = resolveFormField(
    rentalDetails.availability,
    otherValues,
    "availability"
  );
  const preferredMoveInDate = resolveFormField(
    rentalDetails.preferredMoveInDate,
    otherValues,
    "preferredMoveInDate"
  );

  return {
    tenantTypeAllowed: rentalDetails.tenantTypeAllowed || [],
    occupationPreference: resolveFormField(
      rentalDetails.occupationPreference,
      otherValues,
      "occupationPreference"
    ),
    employmentVerification: rentalDetails.employmentVerification || [],
    rentalAgreementDuration: resolveFormField(
      rentalDetails.rentalAgreementDuration,
      otherValues,
      "rentalAgreementDuration"
    ),
    minimumStayDuration: resolveFormField(
      rentalDetails.minimumStayDuration,
      otherValues,
      "minimumStayDuration"
    ),
    lockInPeriod: resolveFormField(
      rentalDetails.lockInPeriod,
      otherValues,
      "lockInPeriod"
    ),
    availability,
    availabilityDate:
      availability === "Specific Date"
        ? formatDateForApi(rentalDetails.availabilityDate)
        : null,
    foodPreference: resolveFormField(
      rentalDetails.foodPreference,
      otherValues,
      "foodPreference"
    ),
    pets: resolveFormField(rentalDetails.pets, otherValues, "pets"),
    smoking: resolveFormField(rentalDetails.smoking, otherValues, "smoking"),
    alcohol: resolveFormField(rentalDetails.alcohol, otherValues, "alcohol"),
    guestPolicy: resolveFormField(
      rentalDetails.guestPolicy,
      otherValues,
      "guestPolicy"
    ),
    tenantVerification: rentalDetails.tenantVerification || [],
    securityDeposit,
    securityDepositCustomAmount:
      securityDeposit === "Custom Amount"
        ? toNumberOrNull(rentalDetails.securityDepositCustomAmount)
        : null,
    preferredMoveInDate,
    preferredMoveInDateSpecific:
      preferredMoveInDate === "Specific Date"
        ? formatDateForApi(rentalDetails.preferredMoveInDateSpecific)
        : null,
    governmentEmployeePreferred: Boolean(
      rentalDetails.governmentEmployeePreferred
    ),
  };
};

export const buildSaleDetailsPayload = (saleDetails, isSell) => {
  if (!isSell || !saleDetails) return null;
  const otherValues = saleDetails.otherValues || {};
  return {
    possessionStatus: resolveFormField(
      saleDetails.possessionStatus,
      otherValues,
      "possessionStatus"
    ),
    loanAvailability: resolveFormField(
      saleDetails.loanAvailability,
      otherValues,
      "loanAvailability"
    ),
  };
};

const mapRentalDetailsOtherFields = (rentalDetails, constants) => {
  if (!rentalDetails) return { ...EMPTY_RENTAL_DETAILS, otherValues: {} };
  const base = mapRentalDetailsToForm(rentalDetails);
  const otherValues = {};

  const rentalFieldOptions = {
    occupationPreference: constants?.OCCUPATION_PREFERENCES ?? [],
    rentalAgreementDuration: constants?.RENTAL_AGREEMENT_DURATIONS ?? [],
    minimumStayDuration: constants?.MINIMUM_STAY_DURATIONS ?? [],
    lockInPeriod: constants?.LOCK_IN_PERIODS ?? [],
    availability: constants?.AVAILABILITY_OPTIONS ?? [],
    foodPreference: constants?.FOOD_PREFERENCES ?? [],
    securityDeposit: constants?.SECURITY_DEPOSIT_OPTIONS ?? [],
    preferredMoveInDate: constants?.AVAILABILITY_OPTIONS ?? [],
    pets: constants?.ALLOWANCE_POLICY_OPTIONS ?? [],
    smoking: constants?.ALLOWANCE_POLICY_OPTIONS ?? [],
    alcohol: constants?.ALLOWANCE_POLICY_OPTIONS ?? [],
    guestPolicy: constants?.GUEST_POLICY_OPTIONS ?? [],
  };

  Object.entries(rentalFieldOptions).forEach(([key, options]) => {
    const split = splitOtherField(base[key], options);
    base[key] = split.value;
    if (split.other) otherValues[key] = split.other;
  });

  return { ...base, otherValues };
};

const mapSaleDetailsOtherFields = (saleDetails, constants) => {
  if (!saleDetails) return { ...EMPTY_SALE_DETAILS, otherValues: {} };
  const base = mapSaleDetailsToForm(saleDetails);
  const otherValues = {};

  ["possessionStatus", "loanAvailability"].forEach((key) => {
    const options =
      key === "possessionStatus"
        ? constants?.POSSESSION_STATUSES ?? []
        : constants?.LOAN_AVAILABILITY ?? [];
    const split = splitOtherField(base[key], options);
    base[key] = split.value;
    if (split.other) otherValues[key] = split.other;
  });

  return { ...base, otherValues };
};

export const mapPropertyToFormBase = (property, constants = null) => {
  const imagesObj = {};
  if (property.media?.length) {
    property.media.forEach((mediaItem) => {
      imagesObj[mediaItem.type] = mediaItem.url;
    });
  }

  const docKeysMap = {
    "Sale Deed": "saleDeed",
    "RERA Certificate": "reraCertificate",
    "Property Tax Receipt": "taxReceipt",
    "Electricity Bill": "electricityBill",
    "Occupancy Certificate": "occupancyCertificate",
    "Encumbrance Certificate": "encumbrance",
    "Aadhaar Card": "aadhaarCard",
    "PAN Card": "panCard",
    "Passport": "passport",
    "Driving Licence": "drivingLicence",
    "Voter ID": "voterId",
    "Registry": "registry",
    "Conveyance Deed": "conveyanceDeed",
    "Mutation Certificate": "mutationCertificate",
    "Completion Certificate": "completionCertificate",
    "Approved Building Plan": "approvedBuildingPlan",
    "Water Bill": "waterBill",
    "NOC": "noc",
    "Society Share Certificate": "societyShareCertificate",
  };

  const documentsObj = {};
  if (property.documents?.length) {
    property.documents.forEach((doc) => {
      const key = docKeysMap[doc.type];
      if (key) {
        documentsObj[key] = {
          file: null,
          url: doc.url,
          name: doc.originalFileName || doc.fileName,
          category: doc.category,
          type: doc.type,
        };
      }
    });
  }

  const listingType = formatListingTypeLabel(property.listingType) || "";
  const otherValues = {};

  const splitCore = (key, options) => {
    const split = splitOtherField(property[key], options);
    if (split.other) otherValues[key] = split.other;
    return split.value;
  };

  const titleOptions = getTitleOptions(listingType);
  const titleSplit = splitOtherField(property.title || "", titleOptions);
  if (titleSplit.other) otherValues.title = titleSplit.other;

  const stateValue = property.location?.state || "Maharashtra";
  let stateForm = stateValue;
  if (constants) {
    const stateSplit = splitOtherField(stateValue, constants.INDIAN_STATE_NAMES ?? []);
    stateForm = stateSplit.value || stateValue;
    if (stateSplit.other) otherValues.state = stateSplit.other;
  }

  return {
    listingType: constants
      ? splitCore("listingType", constants.LISTING_TYPES ?? []) || listingType
      : listingType,
    propertyType: constants
      ? splitCore("propertyType", constants.PROPERTY_TYPES ?? [])
      : property.propertyType || "",
    ownershipType: constants
      ? splitCore("ownershipType", constants.OWNERSHIP_TYPES ?? [])
      : property.ownershipType || "Freehold",
    title: constants ? titleSplit.value : property.title || "",
    description: property.description || "",
    condition: constants
      ? splitCore("condition", constants.PROPERTY_CONDITIONS ?? [])
      : property.condition || "Brand New",
    constructionStatus: constants
      ? splitCore("constructionStatus", constants.CONSTRUCTION_STATUSES ?? [])
      : property.constructionStatus || "Ready to Move",
    furnishing: constants
      ? splitCore("furnishing", constants.FURNISHING_STATUSES ?? [])
      : property.furnishing || "Unfurnished",
    facing: constants
      ? splitCore("facing", constants.FACING_DIRECTIONS ?? [])
      : property.facing || "North",
    areaValue: property.area?.value ?? "",
    price: property.price ?? "",
    roi: property.roi ?? "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    floorNo: property.floorNo ?? "",
    totalFloors: property.totalFloors ?? "",
    flooringType: constants
      ? splitCore("flooringType", constants.FLOORING_TYPES ?? [])
      : property.flooringType || "Marble",
    maintenance: property.maintenance ?? "",
    waterSupply: constants
      ? splitCore("waterSupply", constants.WATER_SUPPLY_TYPES ?? [])
      : property.waterSupply || "Municipal Water",
    powerBackup: constants
      ? splitCore("powerBackup", constants.POWER_BACKUP_TYPES ?? [])
      : property.powerBackup || "No Backup",
    parkingType: constants
      ? splitCore("parkingType", constants.PARKING_TYPES ?? [])
      : property.parkingType || "No Parking",
    securityFeatures: property.securityFeatures || [],
    amenities: property.amenities || [],
    connectivity: property.connectivity || [],
    nearbyFacilities: property.nearbyFacilities || [],
    fullAddress: property.location?.fullAddress || "",
    city: property.location?.city || "",
    state: stateForm,
    pincode: property.location?.pincode || "",
    latitude: property.location?.latitude ?? "",
    longitude: property.location?.longitude ?? "",
    otherValues,
    rentalDetails: constants
      ? mapRentalDetailsOtherFields(property.rentalDetails, constants)
      : mapRentalDetailsToForm(property.rentalDetails),
    saleDetails: constants
      ? mapSaleDetailsOtherFields(property.saleDetails, constants)
      : mapSaleDetailsToForm(property.saleDetails),
    images: imagesObj,
    documents: documentsObj,
  };
};

export const buildCorePropertyPayload = (formData) => {
  const otherValues = formData.otherValues || {};

  return {
    listingType: resolveOtherField(formData.listingType, otherValues, "listingType"),
    propertyType: resolveOtherField(formData.propertyType, otherValues, "propertyType"),
    ownershipType: toNullIfEmpty(
      resolveOtherField(formData.ownershipType, otherValues, "ownershipType")
    ),
    title: resolveOtherField(formData.title, otherValues, "title"),
    description: formData.description || "",
    condition: toNullIfEmpty(
      resolveOtherField(formData.condition, otherValues, "condition")
    ),
    constructionStatus: toNullIfEmpty(
      resolveOtherField(formData.constructionStatus, otherValues, "constructionStatus")
    ),
    furnishing: toNullIfEmpty(
      resolveOtherField(formData.furnishing, otherValues, "furnishing")
    ),
    facing: toNullIfEmpty(resolveOtherField(formData.facing, otherValues, "facing")),
    flooringType: toNullIfEmpty(
      resolveOtherField(formData.flooringType, otherValues, "flooringType")
    ),
  area: {
    value: toNumberOrNull(formData.areaValue) ?? 0,
    unit: "sqft",
  },
  price: Number(formData.price) || 0,
  roi: toNumberOrNull(formData.roi),
  maintenance: toNumberOrNull(formData.maintenance),
  bedrooms: toNumberOrNull(formData.bedrooms),
  bathrooms: toNumberOrNull(formData.bathrooms),
  floorNo: toNumberOrNull(formData.floorNo),
  totalFloors: toNumberOrNull(formData.totalFloors),
  waterSupply: toNullIfEmpty(
    resolveOtherField(formData.waterSupply, otherValues, "waterSupply")
  ),
  powerBackup: toNullIfEmpty(
    resolveOtherField(formData.powerBackup, otherValues, "powerBackup")
  ),
  parkingType: toNullIfEmpty(
    resolveOtherField(formData.parkingType, otherValues, "parkingType")
  ),
  securityFeatures: formData.securityFeatures || [],
  amenities: formData.amenities || [],
  connectivity: formData.connectivity || [],
  nearbyFacilities: formData.nearbyFacilities || [],
  location: {
    fullAddress: formData.fullAddress || "",
    city: formData.city,
    state: toNullIfEmpty(resolveOtherField(formData.state, otherValues, "state")),
    pincode: formData.pincode,
    latitude: toNumberOrNull(formData.latitude) ?? undefined,
    longitude: toNumberOrNull(formData.longitude) ?? undefined,
  },
};
};

/** Map document type label → form key (edit/delete tracking) */
export const DOCUMENT_TYPE_TO_KEY = {
  "Sale Deed": "saleDeed",
  "RERA Certificate": "reraCertificate",
  "Property Tax Receipt": "taxReceipt",
  "Electricity Bill": "electricityBill",
  "Occupancy Certificate": "occupancyCertificate",
  "Encumbrance Certificate": "encumbrance",
  "Aadhaar Card": "aadhaarCard",
  "PAN Card": "panCard",
  "Passport": "passport",
  "Driving Licence": "drivingLicence",
  "Voter ID": "voterId",
  "Registry": "registry",
  "Conveyance Deed": "conveyanceDeed",
  "Mutation Certificate": "mutationCertificate",
  "Completion Certificate": "completionCertificate",
  "Approved Building Plan": "approvedBuildingPlan",
  "Water Bill": "waterBill",
  "NOC": "noc",
  "Society Share Certificate": "societyShareCertificate",
};

export const DOCUMENT_KEY_TO_TYPE = Object.fromEntries(
  Object.entries(DOCUMENT_TYPE_TO_KEY).map(([type, key]) => [key, type])
);

export const buildFullPropertyPayload = (formData, { isSell }) => {
  const payload = buildCorePropertyPayload(formData);

  if (isRentalListingType(formData.listingType)) {
    payload.rentalDetails = buildRentalDetailsPayload(
      formData.rentalDetails,
      formData.listingType
    );
    payload.saleDetails = null;
  } else if (isSell) {
    payload.saleDetails = buildSaleDetailsPayload(formData.saleDetails, true);
    payload.rentalDetails = null;
  }

  return payload;
};

const REQUIRED_PROPERTY_FIELDS = [
  { key: "listingType", label: "Listing Type", otherKey: "listingType" },
  { key: "propertyType", label: "Property Type", otherKey: "propertyType" },
  { key: "title", label: "Listing Title", otherKey: "title" },
  { key: "price", label: "Price" },
  { key: "city", label: "City" },
  { key: "state", label: "State", otherKey: "state" },
  { key: "pincode", label: "Pincode" },
];

export const getPropertyRequiredFieldErrors = (formData) => {
  const otherValues = formData?.otherValues || {};
  const missing = REQUIRED_PROPERTY_FIELDS
    .filter(({ key, otherKey }) => {
      const raw = formData?.[key];
      const value = otherKey
        ? resolveOtherField(raw, otherValues, otherKey)
        : raw;
      return value === undefined || value === null || String(value).trim() === "";
    })
    .map(({ label }) => label);

  if (!missing.length) return null;
  return `Please fill required fields: ${missing.join(", ")}`;
};
