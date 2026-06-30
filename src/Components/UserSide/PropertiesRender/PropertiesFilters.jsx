import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { normalizeListingTypesList } from "../../../utils/listingType";
import { SEARCH_LOCATIONS } from "../../../data/propertiesDemo";

export default function PropertiesFilters({
  isMobileModal = false,
  open = false,
  onClose,
  resultCount,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: constants } = useGetConstantsQuery();

  const listingTypes = normalizeListingTypesList(constants?.LISTING_TYPES) ?? [];
  const propertyTypes = constants?.PROPERTY_TYPES ?? [];
  const furnishingOptions = constants?.FURNISHING_STATUSES ?? [];

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    setSearchParams(next);
  }

  function clearFilters() {
    const next = new URLSearchParams();
    const keep = ["mode", "section", "city", "q"];
    keep.forEach((key) => {
      const val = searchParams.get(key);
      if (val) next.set(key, val);
    });
    setSearchParams(next);
  }

  const selectClass =
    "w-full rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#111]";

  // MOBILE FILTER FIX: shared filter fields, used inside both aside and modal
  const filterFields = (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
          Location
        </label>
        <select
          value={searchParams.get("city") || "Delhi"}
          onChange={(e) => updateParam("city", e.target.value)}
          className={selectClass}
        >
          {SEARCH_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
          Listing Type
        </label>
        <select
          value={searchParams.get("listingType") || ""}
          onChange={(e) => updateParam("listingType", e.target.value)}
          className={selectClass}
        >
          <option value="">All</option>
          {listingTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
          Property Type
        </label>
        <select
          value={searchParams.get("propertyType") || ""}
          onChange={(e) => updateParam("propertyType", e.target.value)}
          className={selectClass}
        >
          <option value="">All</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
          Furnishing
        </label>
        <select
          value={searchParams.get("furnishing") || ""}
          onChange={(e) => updateParam("furnishing", e.target.value)}
          className={selectClass}
        >
          <option value="">All</option>
          {furnishingOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
          Bedrooms
        </label>
        <select
          value={searchParams.get("bedrooms") || ""}
          onChange={(e) => updateParam("bedrooms", e.target.value)}
          className={selectClass}
        >
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={String(n)}>
              {n}+ BHK
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
            Min Price
          </label>
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={searchParams.get("minPrice") || ""}
            onChange={(e) => updateParam("minPrice", e.target.value)}
            className={selectClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
            Max Price
          </label>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={searchParams.get("maxPrice") || ""}
            onChange={(e) => updateParam("maxPrice", e.target.value)}
            className={selectClass}
          />
        </div>
      </div>
    </div>
  );

  // MOBILE FILTER FIX: bottom-sheet modal variant
  if (isMobileModal) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end lg:hidden">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <div className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#111]">Filters</h2>
            <button type="button" onClick={onClose} aria-label="Close filters">
              <X size={20} />
            </button>
          </div>

          {filterFields}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 rounded-xl border border-[#E5E5E5] py-3 text-sm font-semibold text-[#666]"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-[2] rounded-xl bg-[#111] py-3 text-sm font-bold text-white"
            >
              Show {resultCount ?? ""} Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar (unchanged)
  return (
    <aside className="w-full shrink-0 lg:w-[280px]">
      <div className="sticky top-24 rounded-2xl border border-[#EFEFEF] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-[#111]">Filters</h2>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-[#666] hover:text-[#111]"
          >
            Clear
          </button>
        </div>
        {filterFields}
      </div>
    </aside>
  );
}

// import { useSearchParams } from "react-router-dom";
// import { useGetConstantsQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
// import { normalizeListingTypesList } from "../../../utils/listingType";
// import { SEARCH_LOCATIONS } from "../../../data/propertiesDemo";

// export default function PropertiesFilters() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { data: constants } = useGetConstantsQuery();

//   const listingTypes = normalizeListingTypesList(constants?.LISTING_TYPES) ?? [];
//   const propertyTypes = constants?.PROPERTY_TYPES ?? [];
//   const furnishingOptions = constants?.FURNISHING_STATUSES ?? [];

//   function updateParam(key, value) {
//     const next = new URLSearchParams(searchParams);
//     if (value) next.set(key, value);
//     else next.delete(key);
//     next.delete("page");
//     setSearchParams(next);
//   }

//   function clearFilters() {
//     const next = new URLSearchParams();
//     const keep = ["mode", "section", "city", "q"];
//     keep.forEach((key) => {
//       const val = searchParams.get(key);
//       if (val) next.set(key, val);
//     });
//     setSearchParams(next);
//   }

//   const selectClass =
//     "w-full rounded-xl border border-[#E8E8E8] bg-white px-3 py-2.5 text-sm text-[#333] outline-none focus:border-[#111]";

//   return (
//     <aside className="w-full shrink-0 lg:w-[280px]">
//       <div className="sticky top-24 rounded-2xl border border-[#EFEFEF] bg-white p-5 shadow-sm">
//         <div className="mb-5 flex items-center justify-between">
//           <h2 className="text-base font-bold text-[#111]">Filters</h2>
//           <button
//             type="button"
//             onClick={clearFilters}
//             className="text-xs font-semibold text-[#666] hover:text-[#111]"
//           >
//             Clear
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//               Location
//             </label>
//             <select
//               value={searchParams.get("city") || "Delhi"}
//               onChange={(e) => updateParam("city", e.target.value)}
//               className={selectClass}
//             >
//               {SEARCH_LOCATIONS.map((loc) => (
//                 <option key={loc} value={loc}>
//                   {loc}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//               Listing Type
//             </label>
//             <select
//               value={searchParams.get("listingType") || ""}
//               onChange={(e) => updateParam("listingType", e.target.value)}
//               className={selectClass}
//             >
//               <option value="">All</option>
//               {listingTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//               Property Type
//             </label>
//             <select
//               value={searchParams.get("propertyType") || ""}
//               onChange={(e) => updateParam("propertyType", e.target.value)}
//               className={selectClass}
//             >
//               <option value="">All</option>
//               {propertyTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//               Furnishing
//             </label>
//             <select
//               value={searchParams.get("furnishing") || ""}
//               onChange={(e) => updateParam("furnishing", e.target.value)}
//               className={selectClass}
//             >
//               <option value="">All</option>
//               {furnishingOptions.map((item) => (
//                 <option key={item} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//               Bedrooms
//             </label>
//             <select
//               value={searchParams.get("bedrooms") || ""}
//               onChange={(e) => updateParam("bedrooms", e.target.value)}
//               className={selectClass}
//             >
//               <option value="">Any</option>
//               {[1, 2, 3, 4, 5].map((n) => (
//                 <option key={n} value={String(n)}>
//                   {n}+ BHK
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//                 Min Price
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 placeholder="Min"
//                 value={searchParams.get("minPrice") || ""}
//                 onChange={(e) => updateParam("minPrice", e.target.value)}
//                 className={selectClass}
//               />
//             </div>
//             <div>
//               <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]">
//                 Max Price
//               </label>
//               <input
//                 type="number"
//                 min={0}
//                 placeholder="Max"
//                 value={searchParams.get("maxPrice") || ""}
//                 onChange={(e) => updateParam("maxPrice", e.target.value)}
//                 className={selectClass}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }
