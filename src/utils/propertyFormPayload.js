import { formatListingTypeLabel } from "./listingType";

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
};

export const EMPTY_SALE_DETAILS = {
  possessionStatus: "",
  loanAvailability: "",
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
  };
};

export const mapSaleDetailsToForm = (saleDetails) => {
  if (!saleDetails) return { ...EMPTY_SALE_DETAILS };
  return {
    possessionStatus: saleDetails.possessionStatus || "",
    loanAvailability: saleDetails.loanAvailability || "",
  };
};

export const buildRentalDetailsPayload = (rentalDetails, listingType) => {
  if (!isRentalListingType(listingType) || !rentalDetails) return null;

  const securityDeposit = toNullIfEmpty(rentalDetails.securityDeposit);
  const availability = toNullIfEmpty(rentalDetails.availability);
  const preferredMoveInDate = toNullIfEmpty(rentalDetails.preferredMoveInDate);

  return {
    tenantTypeAllowed: rentalDetails.tenantTypeAllowed || [],
    occupationPreference: toNullIfEmpty(rentalDetails.occupationPreference),
    employmentVerification: rentalDetails.employmentVerification || [],
    rentalAgreementDuration: toNullIfEmpty(rentalDetails.rentalAgreementDuration),
    minimumStayDuration: toNullIfEmpty(rentalDetails.minimumStayDuration),
    lockInPeriod: toNullIfEmpty(rentalDetails.lockInPeriod),
    availability,
    availabilityDate:
      availability === "Specific Date"
        ? formatDateForApi(rentalDetails.availabilityDate)
        : null,
    foodPreference: toNullIfEmpty(rentalDetails.foodPreference),
    pets: toNullIfEmpty(rentalDetails.pets),
    smoking: toNullIfEmpty(rentalDetails.smoking),
    alcohol: toNullIfEmpty(rentalDetails.alcohol),
    guestPolicy: toNullIfEmpty(rentalDetails.guestPolicy),
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
  return {
    possessionStatus: toNullIfEmpty(saleDetails.possessionStatus),
    loanAvailability: toNullIfEmpty(saleDetails.loanAvailability),
  };
};

export const mapPropertyToFormBase = (property) => {
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

  return {
    listingType: formatListingTypeLabel(property.listingType) || "",
    propertyType: property.propertyType || "",
    ownershipType: property.ownershipType || "Freehold",
    title: property.title || "",
    description: property.description || "",
    condition: property.condition || "Brand New",
    constructionStatus: property.constructionStatus || "Ready to Move",
    furnishing: property.furnishing || "Unfurnished",
    facing: property.facing || "North",
    areaValue: property.area?.value ?? "",
    price: property.price ?? "",
    roi: property.roi ?? "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    floorNo: property.floorNo ?? "",
    totalFloors: property.totalFloors ?? "",
    flooringType: property.flooringType || "Marble",
    maintenance: property.maintenance ?? "",
    waterSupply: property.waterSupply || "Municipal Water",
    powerBackup: property.powerBackup || "No Backup",
    parkingType: property.parkingType || "No Parking",
    securityFeatures: property.securityFeatures || [],
    amenities: property.amenities || [],
    connectivity: property.connectivity || [],
    nearbyFacilities: property.nearbyFacilities || [],
    fullAddress: property.location?.fullAddress || "",
    city: property.location?.city || "",
    state: property.location?.state || "Maharashtra",
    pincode: property.location?.pincode || "",
    latitude: property.location?.latitude ?? "",
    longitude: property.location?.longitude ?? "",
    rentalDetails: mapRentalDetailsToForm(property.rentalDetails),
    saleDetails: mapSaleDetailsToForm(property.saleDetails),
    images: imagesObj,
    documents: documentsObj,
  };
};

export const buildCorePropertyPayload = (formData) => ({
  listingType: formData.listingType,
  propertyType: formData.propertyType,
  ownershipType: toNullIfEmpty(formData.ownershipType),
  title: formData.title,
  description: formData.description || "",
  condition: toNullIfEmpty(formData.condition),
  constructionStatus: toNullIfEmpty(formData.constructionStatus),
  furnishing: toNullIfEmpty(formData.furnishing),
  facing: toNullIfEmpty(formData.facing),
  flooringType: toNullIfEmpty(formData.flooringType),
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
  waterSupply: toNullIfEmpty(formData.waterSupply),
  powerBackup: toNullIfEmpty(formData.powerBackup),
  parkingType: toNullIfEmpty(formData.parkingType),
  securityFeatures: formData.securityFeatures || [],
  amenities: formData.amenities || [],
  connectivity: formData.connectivity || [],
  nearbyFacilities: formData.nearbyFacilities || [],
  location: {
    fullAddress: formData.fullAddress,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    latitude: toNumberOrNull(formData.latitude) ?? undefined,
    longitude: toNumberOrNull(formData.longitude) ?? undefined,
  },
});

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
  { key: "listingType", label: "Listing Type" },
  { key: "propertyType", label: "Property Type" },
  { key: "title", label: "Listing Title" },
  { key: "price", label: "Price" },
  { key: "fullAddress", label: "Full Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "pincode", label: "Pincode" },
];

export const getPropertyRequiredFieldErrors = (formData) => {
  const missing = REQUIRED_PROPERTY_FIELDS
    .filter(({ key }) => {
      const value = formData?.[key];
      return value === undefined || value === null || String(value).trim() === "";
    })
    .map(({ label }) => label);

  if (!missing.length) return null;
  return `Please fill required fields: ${missing.join(", ")}`;
};
