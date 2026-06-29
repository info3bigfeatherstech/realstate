import { useState } from "react";
import { MapPin, BedDouble, Bath, Maximize2, Heart, ArrowUpRight } from "lucide-react";
import { formatListingTypeLabel } from "../../../utils/listingType";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F0F0F0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

function formatPrice(price, listingType) {
    if (!price && price !== 0) return "—";
    if (listingType === "For Rent" || listingType === "PG") {
        return `₹${price.toLocaleString("en-IN")}/mo`;
    }
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString("en-IN")}`;
}

function getTag(property) {
    if (property.listingType === "For Rent") return "For Rent";
    if (property.listingType === "PG") return "PG";
    if (property.propertyType === "Office Space") return "Commercial";
    if (property.propertyType === "Residential Plot") return "Plot";
    return formatListingTypeLabel(property.listingType) || "Featured";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyCard({ property, onClick }) {
    const [liked, setLiked] = useState(false);

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer w-full rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] "
        >
            {/* Image */}
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
                <img
                    src={property.mainImage || FALLBACK_IMG}
                    alt={property.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Tag */}
                <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1">
                    <span className="text-[11px] font-bold text-[#111] tracking-wide uppercase">
                        {getTag(property)}
                    </span>
                </div>

                {/* Wishlist */}
                <button
                    onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
                    className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm transition-transform duration-200 active:scale-90"
                >
                    <Heart
                        size={14}
                        strokeWidth={2.5}
                        color={liked ? "#E53E3E" : "#111"}
                        fill={liked ? "#E53E3E" : "none"}
                    />
                </button>

                {/* Price overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-6 pb-3 flex items-center justify-between">
                    <span className="text-[18px] font-extrabold text-white tracking-tight">
                        {formatPrice(property.price, property.listingType)}
                    </span>
                    {property.status && ["sold", "rented", "occupied"].includes(property.status.toLowerCase()) && (
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${property.status.toLowerCase() === "sold" ? "bg-red-600/90" :
                            property.status.toLowerCase() === "rented" ? "bg-purple-600/90" :
                                "bg-amber-600/90"
                            }`}>
                            {property.status}
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Location */}
                <div className="flex items-center gap-1 mb-1.5">
                    <MapPin size={11} className="text-[#999] shrink-0" strokeWidth={2.5} />
                    <span className="text-[12px] text-[#999] truncate">
                        {[property.location?.city, property.location?.state].filter(Boolean).join(", ")}
                    </span>
                </div>

                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-1 tracking-tight flex-1">
                        {property.title}
                    </h3>
                    <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 group-hover:border-[#111] group-hover:bg-[#111]">
                        <ArrowUpRight size={12} strokeWidth={2.5} className="text-[#999] transition-colors duration-200 group-hover:text-white" />
                    </div>
                </div>

                {/* Specs */}
                {(property.bedrooms > 0 || property.bathrooms > 0 || property.area?.value > 0) && (
                    <div className="flex items-center gap-4 pt-3 border-t border-[#F0F0F0]">
                        {property.bedrooms > 0 && (
                            <div className="flex items-center gap-1.5">
                                <BedDouble size={13} className="text-[#888]" strokeWidth={2} />
                                <span className="text-[12px] font-semibold text-[#555]">{property.bedrooms} Bed</span>
                            </div>
                        )}
                        {property.bathrooms > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Bath size={13} className="text-[#888]" strokeWidth={2} />
                                <span className="text-[12px] font-semibold text-[#555]">{property.bathrooms} Bath</span>
                            </div>
                        )}
                        {property.area?.value > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Maximize2 size={12} className="text-[#888]" strokeWidth={2} />
                                <span className="text-[12px] font-semibold text-[#555]">{property.area.value.toLocaleString()} sqft</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// down code is working but now we try to change the ui
// import { useState } from "react";
// import { MapPin, BedDouble, Bath, Maximize2, Heart, ArrowUpRight } from "lucide-react";
// import { formatListingTypeLabel } from "../../../utils/listingType";

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F0F0F0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";

// function formatPrice(price, listingType) {
//     if (!price && price !== 0) return "—";
//     if (listingType === "For Rent" || listingType === "PG") {
//         return `₹${price.toLocaleString("en-IN")}/mo`;
//     }
//     if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
//     if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
//     return `₹${price.toLocaleString("en-IN")}`;
// }

// function getTag(property) {
//     if (property.listingType === "For Rent") return "For Rent";
//     if (property.listingType === "PG") return "PG";
//     if (property.propertyType === "Office Space") return "Commercial";
//     if (property.propertyType === "Residential Plot") return "Plot";
//     return formatListingTypeLabel(property.listingType) || "Featured";
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function PropertyCard({ property, onClick }) {
//     const [liked, setLiked] = useState(false);

//     return (
//         <div
//             onClick={onClick}
//             className="group cursor-pointer w-full rounded-2xl bg-white border border-[#EFEFEF] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1"
//         >
//             {/* Image */}
//             <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#F5F5F5]">
//                 <img
//                     src={property.mainImage || FALLBACK_IMG}
//                     alt={property.title}
//                     className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />

//                 {/* Tag */}
//                 <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1">
//                     <span className="text-[11px] font-bold text-[#111] tracking-wide uppercase">
//                         {getTag(property)}
//                     </span>
//                 </div>

//                 {/* Wishlist */}
//                 <button
//                     onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
//                     className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm transition-transform duration-200 active:scale-90"
//                 >
//                     <Heart
//                         size={14}
//                         strokeWidth={2.5}
//                         color={liked ? "#E53E3E" : "#111"}
//                         fill={liked ? "#E53E3E" : "none"}
//                     />
//                 </button>

//                 {/* Price overlay at bottom */}
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-6 pb-3 flex items-center justify-between">
//                     <span className="text-[18px] font-extrabold text-white tracking-tight">
//                         {formatPrice(property.price, property.listingType)}
//                     </span>
//                     {property.status && ["sold", "rented", "occupied"].includes(property.status.toLowerCase()) && (
//                         <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm ${
//                             property.status.toLowerCase() === "sold" ? "bg-red-600/90" :
//                             property.status.toLowerCase() === "rented" ? "bg-purple-600/90" :
//                             "bg-amber-600/90"
//                         }`}>
//                             {property.status}
//                         </span>
//                     )}
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="p-4">
//                 {/* Location */}
//                 <div className="flex items-center gap-1 mb-1.5">
//                     <MapPin size={11} className="text-[#999] shrink-0" strokeWidth={2.5} />
//                     <span className="text-[12px] text-[#999] truncate">
//                         {[property.location?.city, property.location?.state].filter(Boolean).join(", ")}
//                     </span>
//                 </div>

//                 {/* Title */}
//                 <div className="flex items-start justify-between gap-2 mb-3">
//                     <h3 className="text-[15px] font-bold text-[#111] leading-snug line-clamp-1 tracking-tight flex-1">
//                         {property.title}
//                     </h3>
//                     <div className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full border border-[#E5E5E5] transition-all duration-200 group-hover:border-[#111] group-hover:bg-[#111]">
//                         <ArrowUpRight size={12} strokeWidth={2.5} className="text-[#999] transition-colors duration-200 group-hover:text-white" />
//                     </div>
//                 </div>

//                 {/* Specs */}
//                 {(property.bedrooms > 0 || property.bathrooms > 0 || property.area?.value > 0) && (
//                     <div className="flex items-center gap-4 pt-3 border-t border-[#F0F0F0]">
//                         {property.bedrooms > 0 && (
//                             <div className="flex items-center gap-1.5">
//                                 <BedDouble size={13} className="text-[#888]" strokeWidth={2} />
//                                 <span className="text-[12px] font-semibold text-[#555]">{property.bedrooms} Bed</span>
//                             </div>
//                         )}
//                         {property.bathrooms > 0 && (
//                             <div className="flex items-center gap-1.5">
//                                 <Bath size={13} className="text-[#888]" strokeWidth={2} />
//                                 <span className="text-[12px] font-semibold text-[#555]">{property.bathrooms} Bath</span>
//                             </div>
//                         )}
//                         {property.area?.value > 0 && (
//                             <div className="flex items-center gap-1.5">
//                                 <Maximize2 size={12} className="text-[#888]" strokeWidth={2} />
//                                 <span className="text-[12px] font-semibold text-[#555]">{property.area.value.toLocaleString()} sqft</span>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // src/Components/UserSide/PropertyCard/PropertyCard.jsx
// import React, { useState } from "react";
// import { MapPin, BedDouble, Bath, Maximize2, Heart, ArrowUpRight } from "lucide-react";

// const formatPrice = (price, listingType) => {
//     if (!price && price !== 0) return "—";
//     if (listingType === "For Rent" || listingType === "PG") {
//         return `₹${price.toLocaleString("en-IN")}/mo`;
//     }
//     if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
//     if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakhs`;
//     return `₹${price.toLocaleString("en-IN")}`;
// };

// const PropertyCard = ({ property, onClick }) => {
//     const [liked, setLiked] = useState(false);

//     const handleCardClick = () => {
//         if (onClick) {
//             onClick(property);
//         }
//     };

//     const handleLike = (e) => {
//         e.stopPropagation();
//         setLiked(!liked);
//     };

//     // Get tag based on listing type
//     const getTag = () => {
//         if (property.listingType === "For Sale") return "For Sell";
//         if (property.listingType === "For Rent") return "For Rent";
//         if (property.listingType === "PG") return "PG";
//         if (property.propertyType === "Office Space") return "Commercial";
//         if (property.propertyType === "Residential Plot") return "Residential Plot";
//         return property.listingType || "Featured";
//     };

//     return (
//         <div
//             onClick={handleCardClick}
//             className="group cursor-pointer rounded-[26px] bg-white p-3 transition-transform duration-500 hover:scale-[1.02]"
//         >
//             {/* IMAGE */}
//             <div className="relative aspect-[1.15/1] overflow-hidden rounded-[18px] bg-[#F0F0F0]">
//                 <img
//                     src={property.mainImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F0F0F0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' fill='%23999' font-family='sans-serif' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E"}
//                     alt={property.title}
//                     className="h-full w-full object-cover transition-transform duration-700 group-hover:brightness-[0.92] group-hover:scale-105"
//                 />

//                 {/* TAG */}
//                 <div className="absolute right-3.5 top-3.5 rounded-full bg-white/90 px-3.5 py-[5px] backdrop-blur-md">
//                     <span className="text-[12px] font-semibold text-[#111]">
//                         {getTag()}
//                     </span>
//                 </div>

//                 {/* HEART BUTTON */}
//                 <button
//                     onClick={handleLike}
//                     className="absolute left-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md"
//                 >
//                     <Heart
//                         size={15}
//                         strokeWidth={2}
//                         color={liked ? "#E53E3E" : "#555"}
//                         fill={liked ? "#E53E3E" : "none"}
//                     />
//                 </button>
//             </div>

//             {/* CONTENT */}
//             <div className="pt-4">
//                 {/* LOCATION */}
//                 <div className="mb-[6px] flex items-center gap-[5px]">
//                     <MapPin size={13} color="#888" strokeWidth={2} />
//                     <span className="text-[13px] font-normal text-[#888]">
//                         {property.location?.city}, {property.location?.state}
//                     </span>
//                 </div>

//                 {/* TITLE + ARROW */}
//                 <div className="mb-[10px] flex items-start justify-between gap-3">
//                     <h3 className="text-[20px] font-bold leading-[1.2] tracking-[-0.5px] text-[#111] line-clamp-1">
//                         {property.title}
//                     </h3>
//                     <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#E0E0E0] transition-all duration-200 group-hover:border-[#111] group-hover:bg-[#111]">
//                         <ArrowUpRight
//                             size={15}
//                             strokeWidth={2}
//                             className="text-[#111] transition-colors duration-200 group-hover:text-white"
//                         />
//                     </div>
//                 </div>

//                 {/* SPECS */}
//                 <div className="mb-3 flex flex-wrap items-center gap-[18px]">
//                     {property.bedrooms > 0 && (
//                         <div className="flex items-center gap-[5px]">
//                             <BedDouble size={14} color="#888" strokeWidth={1.8} />
//                             <span className="text-[13px] font-medium text-[#555]">
//                                 {property.bedrooms}
//                             </span>
//                         </div>
//                     )}
//                     {property.bathrooms > 0 && (
//                         <div className="flex items-center gap-[5px]">
//                             <Bath size={14} color="#888" strokeWidth={1.8} />
//                             <span className="text-[13px] font-medium text-[#555]">
//                                 {property.bathrooms}
//                             </span>
//                         </div>
//                     )}
//                     {property.area?.value > 0 && (
//                         <div className="flex items-center gap-[5px]">
//                             <Maximize2 size={13} color="#888" strokeWidth={1.8} />
//                             <span className="text-[13px] font-medium text-[#555]">
//                                 {property.area.value.toLocaleString()} sq.ft
//                             </span>
//                         </div>
//                     )}
//                 </div>

//                 {/* PRICE */}
//                 <div className="text-[20px] font-bold tracking-[-0.5px] text-[#111]">
//                     {formatPrice(property.price, property.listingType)}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyCard;