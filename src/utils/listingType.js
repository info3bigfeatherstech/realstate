/** Sell-side listing types (includes legacy "For Sale" until DB is migrated). */
export const SELL_LISTING_TYPES = ["For Sell", "For Sale", "BUY"];

export const isSellListingType = (listingType) => SELL_LISTING_TYPES.includes(listingType);

export const formatListingTypeLabel = (listingType) => {
  if (listingType === "For Sale") return "For Sell";
  return listingType;
};

/** Normalize before API submit (legacy clients / edit forms). */
export const normalizeListingTypeForSubmit = (listingType) => formatListingTypeLabel(listingType);

/** Normalize dropdown options from /constants (handles old backend still sending For Sale). */
export const normalizeListingTypesList = (types) => {
  const source = Array.isArray(types) && types.length ? types : null;
  if (!source) return null;
  return [...new Set(source.map(formatListingTypeLabel))];
};
