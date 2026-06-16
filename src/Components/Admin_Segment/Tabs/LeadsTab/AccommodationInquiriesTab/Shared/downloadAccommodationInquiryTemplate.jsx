import { pdf } from "@react-pdf/renderer";
import { AccommodationInquiryTemplatePdf } from "./AccommodationInquiryTemplatePdf";

const FALLBACK_CONSTANTS = {
  REQUIREMENT_TYPES: ["Rental Property", "PG Accommodation", "Co-Living Accommodation"],
  OCCUPANT_TYPES: ["Student", "Working Professional", "Business Owner", "Family", "Couple", "Single Person"],
  GENDER_PREFERENCES: ["Male", "Female", "Unisex / No Preference"],
  MONTHLY_BUDGETS: [
    "Under ₹5,000",
    "₹5,000–10,000",
    "₹10,000–15,000",
    "₹15,000–25,000",
    "₹25,000–50,000",
    "₹50,000+",
  ],
  INQUIRY_PROPERTY_TYPES: [
    "Flat / Apartment",
    "Independent House",
    "Villa",
    "Studio Apartment",
    "Shop",
    "Office Space",
  ],
  BHK_REQUIREMENTS: ["Studio", "1 BHK", "2 BHK", "3 BHK", "4+ BHK"],
  TENANT_TYPE_PREFERENCES: [
    "Only Families",
    "Bachelors Allowed",
    "Only Bachelors",
    "Married Couples Allowed",
    "Students Allowed",
    "Working Professionals Preferred",
    "Any",
  ],
  INQUIRY_FOOD_PREFERENCES: ["Vegetarian Only", "Non-Vegetarian Allowed", "No Preference"],
  INQUIRY_PET_PREFERENCES: ["Pets Allowed", "Pets Not Allowed", "No Preference"],
  INQUIRY_SMOKING_PREFERENCES: ["Smoking Allowed", "Non-Smoking Property", "No Preference"],
  INQUIRY_ALCOHOL_PREFERENCES: ["Allowed", "Not Allowed", "No Preference"],
  SHARING_PREFERENCES: ["Single Occupancy", "Double Sharing", "Triple Sharing", "Quad Sharing", "Any"],
  INQUIRY_FURNISHING_PREFERENCES: ["Fully Furnished", "Semi-Furnished", "Unfurnished", "No Preference"],
  INQUIRY_AMENITIES: [
    "Wi-Fi",
    "AC",
    "Food / Mess",
    "Housekeeping",
    "Laundry",
    "Lift",
    "Parking",
    "Security",
    "CCTV",
    "Power Backup",
    "RO Water",
    "Attached Washroom",
    "Gym",
    "Study Area",
    "Balcony",
  ],
  MOVE_IN_PRIORITIES: [
    "Immediate",
    "Within 7 Days",
    "Within 15 Days",
    "Within 1 Month",
    "Within 3 Months",
    "Flexible",
  ],
  ADMIN_INQUIRY_STATUSES: ["New", "Contacted", "Converted", "Lost", "Closed"],
};

const normalizeConstants = (constants) => {
  const merged = { ...FALLBACK_CONSTANTS, ...(constants || {}) };
  if (constants?.ADMIN_INQUIRY_STATUSES) {
    merged.ADMIN_INQUIRY_STATUSES = constants.ADMIN_INQUIRY_STATUSES.map(
      (s) => s.charAt(0).toUpperCase() + s.slice(1)
    );
  }
  return merged;
};

export const downloadAccommodationInquiryTemplate = async (constants) => {
  const merged = normalizeConstants(constants);
  const blob = await pdf(<AccommodationInquiryTemplatePdf constants={merged} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Accommodation-Requirement-Form.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
