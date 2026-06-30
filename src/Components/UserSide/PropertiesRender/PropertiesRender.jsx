import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import PropertyCard from "../PropertyCard/PropertyCard";
import PropertiesFilters from "./PropertiesFilters";
import {
  usePropertyListQuery,
  MODE_LABELS,
  SECTION_LABELS,
} from "../../../hooks/usePropertyListQuery";

function buildPageTitle({ mode, section, city, q }) {
  if (section && SECTION_LABELS[section]) return SECTION_LABELS[section];
  const modeLabel = MODE_LABELS[mode] || "Properties";
  const location = city && city !== "Delhi" ? ` in ${city}` : " in Delhi";
  return `${modeLabel} Properties${location}${q ? ` — "${q}"` : ""}`;
}

export default function PropertiesRender() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, meta, isLoading, filters } = usePropertyListQuery();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false); // MOBILE FILTER FIX

  const title = buildPageTitle(filters);

  function goToPage(nextPage) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <section className="min-h-screen bg-white py-10 font-['satoshi']">
      <div className="w-full px-5 md:px-10 lg:px-16">
        <div className="mb-8 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#888]">Search Results</p>
            <h1 className="mt-2 text-[clamp(24px,3vw,36px)] font-bold tracking-tight text-[#111]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#666]">
              {meta.total} {meta.total === 1 ? "property" : "properties"} found
            </p>
          </div>

          {/* MOBILE FILTER FIX: icon button visible only below lg breakpoint */}
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E5E5E5] lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* MOBILE FILTER FIX: sidebar only shown on desktop now */}
          <div className="hidden lg:block">
            <PropertiesFilters />
          </div>

          {/* MOBILE FILTER FIX: modal/bottom-sheet version for mobile */}
          <PropertiesFilters
            isMobileModal
            open={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
            resultCount={meta.total}
          />

          <div className="min-w-0 flex-1">
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C8973E] border-t-transparent" />
              </div>
            ) : data.length === 0 ? (
              <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
                <p className="text-lg font-semibold text-[#333]">No properties found</p>
                <p className="mt-1 text-sm text-[#888]">Try changing filters or search keywords</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    onClick={() => navigate(`/property/${property._id}`)}
                  />
                ))}
              </div>
            )}

            {meta.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={!meta.hasPrevPage}
                  onClick={() => goToPage(meta.page - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-medium text-[#555]">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={!meta.hasNextPage}
                  onClick={() => goToPage(meta.page + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// import { useSearchParams, useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import PropertyCard from "../PropertyCard/PropertyCard";
// import PropertiesFilters from "./PropertiesFilters";
// import {
//   usePropertyListQuery,
//   MODE_LABELS,
//   SECTION_LABELS,
// } from "../../../hooks/usePropertyListQuery";

// function buildPageTitle({ mode, section, city, q }) {
//   if (section && SECTION_LABELS[section]) return SECTION_LABELS[section];
//   const modeLabel = MODE_LABELS[mode] || "Properties";
//   const location = city && city !== "Delhi" ? ` in ${city}` : " in Delhi";
//   return `${modeLabel} Properties${location}${q ? ` — "${q}"` : ""}`;
// }

// export default function PropertiesRender() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { data, meta, isLoading, filters } = usePropertyListQuery();

//   const title = buildPageTitle(filters);

//   function goToPage(nextPage) {
//     const next = new URLSearchParams(searchParams);
//     next.set("page", String(nextPage));
//     setSearchParams(next);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   return (
//     <section className="min-h-screen bg-white py-10 font-['satoshi']">
//       <div className="w-full px-5 md:px-10 lg:px-16">
//         <div className="mb-8">
//           <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#888]">Search Results</p>
//           <h1 className="mt-2 text-[clamp(24px,3vw,36px)] font-bold tracking-tight text-[#111]">
//             {title}
//           </h1>
//           <p className="mt-2 text-sm text-[#666]">
//             {meta.total} {meta.total === 1 ? "property" : "properties"} found
//           </p>
//         </div>

//         <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
//           <PropertiesFilters />

//           <div className="min-w-0 flex-1">
//             {isLoading ? (
//               <div className="flex h-96 items-center justify-center">
//                 <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C8973E] border-t-transparent" />
//               </div>
//             ) : data.length === 0 ? (
//               <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
//                 <p className="text-lg font-semibold text-[#333]">No properties found</p>
//                 <p className="mt-1 text-sm text-[#888]">Try changing filters or search keywords</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
//                 {data.map((property) => (
//                   <PropertyCard
//                     key={property._id}
//                     property={property}
//                     onClick={() => navigate(`/property/${property._id}`)}
//                   />
//                 ))}
//               </div>
//             )}

//             {meta.totalPages > 1 && (
//               <div className="mt-10 flex items-center justify-center gap-3">
//                 <button
//                   type="button"
//                   disabled={!meta.hasPrevPage}
//                   onClick={() => goToPage(meta.page - 1)}
//                   className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] disabled:opacity-30"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>
//                 <span className="text-sm font-medium text-[#555]">
//                   Page {meta.page} of {meta.totalPages}
//                 </span>
//                 <button
//                   type="button"
//                   disabled={!meta.hasNextPage}
//                   onClick={() => goToPage(meta.page + 1)}
//                   className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E5E5] disabled:opacity-30"
//                 >
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
