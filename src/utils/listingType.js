/** Sell-side listing types (includes legacy "For Sale" until DB is migrated). */
export const SELL_LISTING_TYPES = ["For Sell", "For Sale", "BUY"];

export const isSellListingType = (listingType) => SELL_LISTING_TYPES.includes(listingType);

export const formatListingTypeLabel = (listingType) => {
  if (listingType === "For Sale") return "For Sell";
  return listingType;
};
