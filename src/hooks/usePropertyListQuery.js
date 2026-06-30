import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PROPERTIES_DEMO } from "../data/propertiesDemo";
import { isSellListingType } from "../utils/listingType";

const SELL_TYPES = ["For Sell", "For Sale", "BUY"];
const RENT_TYPES = ["For Rent", "PG"];
const DEFAULT_LIMIT = 12;

function locationHaystack(property) {
  return [
    property.title,
    property.location?.city,
    property.location?.state,
    property.location?.fullAddress,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesLocation(property, cityParam) {
  if (!cityParam || cityParam === "Select Location") return true;

  const paramNormalized = cityParam.replace(/,/g, "").toLowerCase();
  const hay = locationHaystack(property);

  if (paramNormalized.includes("east patel nagar")) {
    return hay.includes("east") && hay.includes("patel");
  }
  if (paramNormalized.includes("west patel nagar")) {
    return hay.includes("west") && hay.includes("patel");
  }
  if (paramNormalized === "delhi") {
    return hay.includes("delhi") || hay.includes("patel nagar");
  }

  const words = paramNormalized.split(/\s+/).filter(Boolean);
  return words.every((word) => hay.includes(word));
}

function matchesMode(property, mode) {
  if (!mode) return true;

  const sections = property.homeSections ?? [];
  const lt = property.listingType;

  switch (mode) {
    case "buy":
      return SELL_TYPES.includes(lt);
    case "rent":
      return RENT_TYPES.includes(lt);
    case "investment":
      return (
        isSellListingType(lt) &&
        ((property.roi != null && property.roi > 0) || sections.includes("investment"))
      );
    case "projects":
      return sections.includes("trending");
    default:
      return true;
  }
}

function matchesSection(property, section) {
  if (!section) return true;
  return (property.homeSections ?? []).includes(section);
}

function matchesSearch(property, query) {
  if (!query?.trim()) return true;

  const haystack = [
    property.title,
    property.listingId,
    property.location?.city,
    property.location?.state,
    property.propertyType,
    property.furnishing,
    property.listingType,
    ...(property.homeSections ?? []),
    ...(property.amenities ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

function matchesSidebarFilters(property, params) {
  const listingType = params.get("listingType");
  const propertyType = params.get("propertyType");
  const furnishing = params.get("furnishing");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const bedrooms = params.get("bedrooms");

  if (listingType && property.listingType !== listingType) return false;
  if (propertyType && property.propertyType !== propertyType) return false;
  if (furnishing && property.furnishing !== furnishing) return false;
  if (bedrooms && Number(property.bedrooms) < Number(bedrooms)) return false;
  if (minPrice && property.price < Number(minPrice)) return false;
  if (maxPrice && property.price > Number(maxPrice)) return false;

  return true;
}

export function usePropertyListQuery() {
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode") || "";
  const section = searchParams.get("section") || "";
  const city = searchParams.get("city") || "Delhi";
  const q = searchParams.get("q") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT);

  const result = useMemo(() => {
    const filtered = PROPERTIES_DEMO.data.filter(
      (property) =>
        property.status === "active" &&
        matchesMode(property, mode) &&
        matchesSection(property, section) &&
        matchesLocation(property, city) &&
        matchesSearch(property, q) &&
        matchesSidebarFilters(property, searchParams),
    );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * limit;

    return {
      data: filtered.slice(start, start + limit),
      meta: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPrevPage: safePage > 1,
      },
      filters: { mode, section, city, q },
    };
  }, [mode, section, city, q, page, limit, searchParams]);

  return {
    ...result,
    isLoading: false,
    isFetching: false,
  };
}

export const MODE_LABELS = {
  buy: "Buy",
  rent: "Rent",
  investment: "Investment",
  projects: "Projects",
};

export const SECTION_LABELS = {
  featured: "Featured Properties",
  fresh: "Fresh Properties",
  trending: "Trending Projects",
};
