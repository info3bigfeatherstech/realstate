export const OTHER_OPTION = "Other";

export const TITLE_OPTIONS_NORMAL = [
  "1RK",
  "1BHK",
  "2 BHK",
  "3 BHK",
  "Shop",
  "Showroom",
  "Cottage",
  "Bungalow",
  "Plot",
];

export const TITLE_OPTIONS_PG = ["Boys PG", "Girls PG"];

/** Property types shown when listing type is PG — everything before "Office Space". */
export const getPropertyTypeOptions = (allTypes = [], listingType) => {
  if (listingType !== "PG") return allTypes;
  const officeIndex = allTypes.indexOf("Office Space");
  const limit = officeIndex > 0 ? officeIndex : 6;
  return allTypes.slice(0, limit);
};

export const getTitleOptions = (listingType) =>
  listingType === "PG" ? TITLE_OPTIONS_PG : TITLE_OPTIONS_NORMAL;
