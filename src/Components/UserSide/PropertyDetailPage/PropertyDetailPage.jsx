// src/Components/UserSide/PropertyDetail/PropertyDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, MapPin, BedDouble, Bath, Maximize2,
    Building2, ShieldCheck, CheckCircle2,
    ChevronLeft, ChevronRight, Phone, Mail, Tag, Copy, Check, Eye,
} from "lucide-react";
import { useGetPropertyByIdQuery, useGetPropertyFomoQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/userPropertyApi/userPropertyApi";
// import PropertyMap from "./PropertyMap";
import { formatListingTypeLabel } from "../../../utils/listingType";
import PropertyShareModal from "./Shared/PropertyShareModal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price, listingType) {
    if (!price && price !== 0) return "—";
    if (listingType === "For Rent" || listingType === "PG") {
        return `₹${price.toLocaleString("en-IN")}/mo`;
    }
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString("en-IN")}`;
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, title }) {
    const [activeIdx, setActiveIdx] = useState(0);

    const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
    const next = () => setActiveIdx((i) => (i + 1) % images.length);

    if (!images?.length) {
        return (
            <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-[#F0F0F0]">
                <Building2 size={44} className="text-[#CCC]" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-[#F0F0F0]" style={{ aspectRatio: "4/3" }}>
                <img
                    key={activeIdx}
                    src={images[activeIdx]?.url}
                    alt={title}
                    className="h-full w-full object-cover"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition hover:bg-white"
                        >
                            <ChevronLeft size={16} className="text-[#111]" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition hover:bg-white"
                        >
                            <ChevronRight size={16} className="text-[#111]" />
                        </button>
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                            {activeIdx + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={img._id || i}
                            onClick={() => setActiveIdx(i)}
                            className={`h-14 w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === activeIdx
                                ? "border-[#111]"
                                : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                        >
                            <img src={img.url} alt="" className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Spec Card ────────────────────────────────────────────────────────────────

function SpecCard({ icon: Icon, value, label }) {
    return (
        <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#EBEBEB] bg-white py-4 px-2">
            <Icon size={18} className="text-[#888]" strokeWidth={1.8} />
            <span className="text-[17px] font-bold text-[#111] leading-none">{value}</span>
            <span className="text-[11px] text-[#AAA]">{label}</span>
        </div>
    );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }) {
    if (!value) return null;
    return (
        <div className="flex items-start justify-between gap-4 border-b border-[#F5F5F5] py-3 last:border-0">
            <span className="text-[13px] text-[#888] shrink-0">{label}</span>
            <span className="text-[13px] font-semibold text-[#111] text-right">{value}</span>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PropertyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: response, isLoading } = useGetPropertyByIdQuery(id);
    const { data: fomoData } = useGetPropertyFomoQuery(id, { skip: !id });
    const [liked, setLiked] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCopyLocation = () => {
        if (property?.location?.fullAddress) {
            navigator.clipboard.writeText(property.location.fullAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ── Loading ──
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#111] border-t-transparent" />
            </div>
        );
    }

    const property = response?.data || response;

    // ── Not found ──
    if (!property) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#FAFAFA]">
                <Building2 size={44} className="text-[#DDD]" />
                <p className="text-[15px] font-medium text-[#888]">Property not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#333]"
                >
                    Go back
                </button>
            </div>
        );
    }

    const allImages = property.media?.length
        ? property.media
        : property.mainImage
            ? [{ url: property.mainImage }]
            : [];

    const hasSpecs = property.bedrooms > 0 || property.bathrooms > 0 || property.area?.value > 0;
    const isRent = property.listingType === "For Rent" || property.listingType === "PG";

    return (
        <div className="min-h-screen bg-[#F8F8F6] font-['satoshi',sans-serif]">

            {/* ── Sticky Top Bar ── */}
            <div className="sticky top-0 z-30 flex items-center border-b border-[#EBEBEB] bg-white/95 px-5 py-3 backdrop-blur-md md:px-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[14px] font-semibold text-[#555] transition-colors hover:text-[#111]"
                >
                    <ArrowLeft size={17} strokeWidth={2.5} />
                    <span>Back</span>
                </button>
            </div>

            {/* ── Page Content ── */}
            {/* pb-28 on mobile to clear sticky CTA bar */}
            <div className="mx-auto max-w-6xl px-4 py-6 pb-28 md:px-8 md:py-8 lg:pb-8">

                {/* ── Desktop: Left + Right | Mobile: stacked ── */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">

                    {/* ════ LEFT COLUMN ════ */}
                    <div className="w-full lg:w-[50%] lg:sticky lg:top-20 lg:self-start flex flex-col gap-4">

                        {/* Gallery */}
                        <ImageGallery images={allImages} title={property.title} />

                        {/* Spec boxes — under image on ALL screen sizes */}
                        {hasSpecs && (
                            <div className="grid grid-cols-3 gap-3">
                                {property.bedrooms > 0 && (
                                    <SpecCard icon={BedDouble} value={property.bedrooms} label="Bedrooms" />
                                )}
                                {property.bathrooms > 0 && (
                                    <SpecCard icon={Bath} value={property.bathrooms} label="Bathrooms" />
                                )}
                                {property.area?.value > 0 && (
                                    <SpecCard icon={Maximize2} value={property.area.value.toLocaleString()} label="sq.ft" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* ════ RIGHT COLUMN ════ */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">

                        {/* Badges + Title + Location */}
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {property.listingType && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                                        <Tag size={9} />
                                        {formatListingTypeLabel(property.listingType)}
                                    </span>
                                )}
                                {property.propertyType && (
                                    <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-[11px] font-semibold text-[#666]">
                                        {property.propertyType}
                                    </span>
                                )}
                                {property.constructionStatus && (
                                    <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-[11px] font-semibold text-[#666]">
                                        {property.constructionStatus}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-[clamp(20px,3vw,28px)] font-black leading-tight tracking-tight text-[#111] mb-2">
                                {property.title}
                            </h1>

                            {/* Location */}
                            <div className="flex items-start gap-1.5 text-[#888]">
                                <MapPin size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
                                <span className="text-[13px] leading-snug">
                                    {[
                                        property.location?.fullAddress,
                                        property.location?.city,
                                        property.location?.state,
                                        property.location?.pincode,
                                    ].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
                            <p className="mb-1 text-[11px] uppercase tracking-widest text-[#AAA]">
                                {isRent ? "Monthly Rent" : "Listing Price"}
                            </p>
                            <p className="text-[32px] font-black tracking-tight text-[#111] leading-none">
                                {formatPrice(property.price, property.listingType)}
                            </p>
                            {property.maintenance > 0 && (
                                <p className="mt-1.5 text-[12px] text-[#999]">
                                    + ₹{property.maintenance.toLocaleString("en-IN")}/mo maintenance
                                </p>
                            )}
                        </div>

                        {(fomoData?.activeViewersMessage || fomoData?.todayViewsMessage) && (
                            <div className="flex flex-col gap-2.5">
                                {fomoData.activeViewersMessage && (
                                    <div className="flex items-center gap-2.5 rounded-2xl border border-orange-100 bg-orange-50/80 px-4 py-3">
                                        <span className="relative flex h-2.5 w-2.5 shrink-0">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                                        </span>
                                        <span className="text-[13px] font-semibold text-orange-900">
                                            {fomoData.activeViewersMessage}
                                        </span>
                                    </div>
                                )}
                                {fomoData.todayViewsMessage && (
                                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-md">
                                        <Eye size={15} className="shrink-0 text-[#666]" strokeWidth={2.5} />
                                        <span className="text-[13px] font-semibold text-[#444]">
                                            {fomoData.todayViewsMessage}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Wishlist + Share */}
                        <PropertyShareModal
                            propertyId={id}
                            liked={liked}
                            onWishlistToggle={() => setLiked((l) => !l)}
                        />

                        {/* Quick details */}
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white px-5 py-1">
                            <InfoRow label="Furnishing" value={property.furnishing} />
                            <InfoRow label="Ownership" value={property.ownershipType} />
                            <InfoRow label="Facing" value={property.facing} />
                            <InfoRow label="Flooring" value={property.flooringType} />
                            <InfoRow label="Floor" value={property.floorNo ? `${property.floorNo} / ${property.totalFloors}` : null} />
                            <InfoRow label="Parking" value={property.parkingType} />
                            <InfoRow label="Water Supply" value={property.waterSupply} />
                            <InfoRow label="Power Backup" value={property.powerBackup} />
                            <InfoRow label="Condition" value={property.condition} />
                        </div>

                        {/* CTA buttons — hidden on mobile (sticky bar handles it) */}
                        <div className="hidden lg:grid grid-cols-2 gap-3">
                            <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#111] py-4 text-[14px] font-bold text-white transition hover:bg-[#333] active:scale-[0.99]">
                                <Phone size={16} />
                                Schedule a Visit
                            </button>
                            <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#DCDCDC] bg-white py-4 text-[14px] font-bold text-[#111] transition hover:border-[#111] hover:bg-[#F5F5F5]">
                                <Mail size={16} />
                                Send Enquiry
                            </button>
                        </div>

                    </div>
                </div>

                {/* ════ Full-width sections below ════ */}
                <div className="mt-6 flex flex-col gap-4">

                    {/* Description */}
                    {property.description && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-3 text-[16px] font-bold tracking-tight text-[#111]">About this Property</h2>
                            <p className="text-[14px] leading-[1.85] text-[#555]">{property.description}</p>
                        </div>
                    )}

                    {/* Amenities */}
                    {property.amenities?.length > 0 && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-4 text-[16px] font-bold tracking-tight text-[#111]">Amenities</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((item) => (
                                    <div key={item} className="flex items-center gap-1.5 rounded-full border border-[#EBEBEB] px-4 py-2">
                                        <CheckCircle2 size={12} className="text-[#555]" strokeWidth={2} />
                                        <span className="text-[13px] font-medium text-[#333]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security features */}
                    {property.securityFeatures?.length > 0 && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-4 text-[16px] font-bold tracking-tight text-[#111]">Security Features</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.securityFeatures.map((item) => (
                                    <div key={item} className="flex items-center gap-1.5 rounded-full border border-[#EBEBEB] px-4 py-2">
                                        <ShieldCheck size={12} className="text-[#555]" strokeWidth={2} />
                                        <span className="text-[13px] font-medium text-[#333]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Connectivity */}
                    {property.connectivity?.length > 0 && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-4 text-[16px] font-bold tracking-tight text-[#111]">Connectivity</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.connectivity.map((item) => (
                                    <span key={item} className="rounded-full border border-[#EBEBEB] px-4 py-2 text-[13px] font-medium text-[#444]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Nearby facilities */}
                    {property.nearbyFacilities?.length > 0 && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-4 text-[16px] font-bold tracking-tight text-[#111]">Nearby Facilities</h2>
                            <div className="flex flex-wrap gap-2">
                                {property.nearbyFacilities.map((item) => (
                                    <span key={item} className="rounded-full border border-[#EBEBEB] px-4 py-2 text-[13px] font-medium text-[#444]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sale details */}
                    {property.saleDetails && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <h2 className="mb-4 text-[16px] font-bold tracking-tight text-[#111]">Sale Details</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                                {[
                                    ["Possession Status", property.saleDetails.possessionStatus],
                                    ["Loan Availability", property.saleDetails.loanAvailability],
                                ].filter(([, v]) => v).map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-[12px] text-[#AAA]">{label}</p>
                                        <p className="mt-0.5 text-[14px] font-semibold text-[#111]">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location + Map */}
                    {property.location?.latitude && property.location?.longitude && (
                        <div className="rounded-2xl border border-[#EBEBEB] bg-white p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="flex items-center gap-2 text-[16px] font-bold tracking-tight text-[#111]">
                                    <MapPin size={16} className="text-[#888]" />
                                    Location
                                </h2>
                                {property.location?.fullAddress && (
                                    <button
                                        onClick={handleCopyLocation}
                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${copied
                                            ? "border-green-200 bg-green-50 text-green-600"
                                            : "border-[#EBEBEB] bg-white text-[#555] hover:bg-gray-50 hover:text-[#111]"
                                            }`}
                                    >
                                        {copied ? (
                                            <><Check size={13} /> Copied!</>
                                        ) : (
                                            <><Copy size={13} /> Copy address</>
                                        )}
                                    </button>
                                )}
                            </div>

                            {property.location?.fullAddress && (
                                <p className="mb-4 text-[13px] text-[#888] leading-relaxed">
                                    {property.location.fullAddress}
                                </p>
                            )}

                            {/* <PropertyMap
                                lat={property.location.latitude}
                                lng={property.location.longitude}
                                title={property.title}
                            /> */}
                        </div>
                    )}

                </div>
            </div>

            {/* ── Mobile Sticky Bottom CTA Bar ── */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#EBEBEB] bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-xl bg-[#111] py-3.5 text-[14px] font-bold text-white transition hover:bg-[#333] active:scale-[0.99]">
                        <Phone size={15} />
                        Schedule Visit
                    </button>
                    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#DCDCDC] bg-white py-3.5 text-[14px] font-bold text-[#111] transition hover:border-[#111]">
                        <Mail size={15} />
                        Send Enquiry
                    </button>
                </div>
            </div>
        </div>
    );
}

// down code is working but ui is poor use upper code
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//     ArrowLeft, MapPin, BedDouble, Bath, Maximize2,
//     Heart, Share2, Building2, ShieldCheck, CheckCircle2,
//     ChevronLeft, ChevronRight, Phone, Mail, Tag,
// } from "lucide-react";
// import { useGetPropertyByIdQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/userPropertyApi/userPropertyApi";
// import PropertyMap from "./PropertyMap";
// import { formatListingTypeLabel } from "../../../utils/listingType";

// function formatPrice(price, listingType) {
//     if (!price && price !== 0) return "—";
//     if (listingType === "For Rent" || listingType === "PG") {
//         return `₹${price.toLocaleString("en-IN")}/mo`;
//     }
//     if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
//     if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
//     return `₹${price.toLocaleString("en-IN")}`;
// }

// function ImageGallery({ images, title }) {
//     const [activeIdx, setActiveIdx] = useState(0);

//     useEffect(() => {
//         window.scrollTo(0, 0);
//     }, []);

//     const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
//     const next = () => setActiveIdx((i) => (i + 1) % images.length);

//     if (!images?.length) {
//         return (
//             <div className="flex h-80 w-full items-center justify-center rounded-2xl bg-[#F0F0F0]">
//                 <Building2 size={48} className="text-[#CCC]" />
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-col gap-3">
//             <div className="relative w-full overflow-hidden rounded-2xl bg-[#F0F0F0]" style={{ aspectRatio: "4/3" }}>
//                 <img
//                     key={activeIdx}
//                     src={images[activeIdx]?.url}
//                     alt={title}
//                     className="h-full w-full object-cover"
//                 />

//                 {images.length > 1 && (
//                     <>
//                         <button
//                             onClick={prev}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:bg-white"
//                         >
//                             <ChevronLeft size={18} className="text-[#111]" />
//                         </button>
//                         <button
//                             onClick={next}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:bg-white"
//                         >
//                             <ChevronRight size={18} className="text-[#111]" />
//                         </button>
//                         <div className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
//                             {activeIdx + 1} / {images.length}
//                         </div>
//                     </>
//                 )}
//             </div>

//             {images.length > 1 && (
//                 <div className="flex gap-2 overflow-x-auto pb-1">
//                     {images.map((img, i) => (
//                         <button
//                             key={img._id || i}
//                             onClick={() => setActiveIdx(i)}
//                             className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === activeIdx ? "border-[#111]" : "border-transparent opacity-55 hover:opacity-80"}`}
//                         >
//                             <img src={img.url} alt="" className="h-full w-full object-cover" />
//                         </button>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// function InfoRow({ label, value }) {
//     if (!value) return null;
//     return (
//         <div className="flex items-start justify-between gap-4 border-b border-[#F5F5F5] py-3 last:border-0">
//             <span className="text-[13px] text-[#888] shrink-0">{label}</span>
//             <span className="text-[13px] font-semibold text-[#111] text-right">{value}</span>
//         </div>
//     );
// }

// export default function PropertyDetailPage() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { data: response, isLoading } = useGetPropertyByIdQuery(id);
//     const [liked, setLiked] = useState(false);
//     const [copied, setCopied] = useState(false);

//     const handleCopyLocation = () => {
//         if (property.location?.fullAddress) {
//             navigator.clipboard.writeText(property.location.fullAddress);
//             setCopied(true);
//             setTimeout(() => setCopied(false), 2000); // 2 second baad wapas normal ho jayega
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
//                 <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#111] border-t-transparent" />
//             </div>
//         );
//     }

//     const property = response?.data || response;

//     if (!property) {
//         return (
//             <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#FAFAFA]">
//                 <Building2 size={44} className="text-[#DDD]" />
//                 <p className="text-[15px] font-medium text-[#888]">Property not found</p>
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="rounded-full bg-[#111] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#333]"
//                 >
//                     Go back
//                 </button>
//             </div>
//         );
//     }

//     const allImages = property.media?.length
//         ? property.media
//         : property.mainImage
//             ? [{ url: property.mainImage }]
//             : [];

//     return (
//         <div className="min-h-screen bg-[#F8F8F6] font-['satoshi',sans-serif]">

//             {/* Top bar */}
//             <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EBEBEB] bg-white/95 px-5 py-3.5 backdrop-blur-md md:px-10">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center gap-2 text-[14px] font-semibold text-[#555] transition-colors hover:text-[#111]"
//                 >
//                     <ArrowLeft size={18} strokeWidth={2.5} />
//                     Back
//                 </button>
//                 <div className="flex items-center gap-2">
//                     <button
//                         onClick={() => setLiked(l => !l)}
//                         className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition hover:border-red-200 hover:bg-red-50"
//                     >
//                         <Heart size={16} strokeWidth={2.5} color={liked ? "#E53E3E" : "#555"} fill={liked ? "#E53E3E" : "none"} />
//                     </button>
//                     <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] bg-white transition hover:border-[#111]">
//                         <Share2 size={16} strokeWidth={2.5} className="text-[#555]" />
//                     </button>
//                 </div>
//             </div>

//             <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">

//                 {/* ── Amazon-style: LEFT image | RIGHT info ── */}
//                 <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 lg:items-start">

//                     {/* LEFT — Sticky image gallery */}
//                     <div className="w-full lg:w-[52%] lg:sticky lg:top-20 lg:self-start">
//                         <ImageGallery images={allImages} title={property.title} />
//                     </div>

//                     {/* RIGHT — Property info */}
//                     <div className="flex-1 min-w-0 flex flex-col gap-5">

//                         {/* Badges */}
//                         <div className="flex flex-wrap gap-2">
//                             {property.listingType && (
//                                 <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
//                                     <Tag size={10} />
//                                     {formatListingTypeLabel(property.listingType)}
//                                 </span>
//                             )}
//                             {property.propertyType && (
//                                 <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-[11px] font-semibold text-[#666]">
//                                     {property.propertyType}
//                                 </span>
//                             )}
//                             {property.constructionStatus && (
//                                 <span className="rounded-full border border-[#E5E5E5] px-3 py-1 text-[11px] font-semibold text-[#666]">
//                                     {property.constructionStatus}
//                                 </span>
//                             )}
//                         </div>

//                         {/* Title */}
//                         <div>
//                             <h1 className="text-[clamp(22px,3vw,30px)] font-black leading-tight tracking-tight text-[#111]">
//                                 {property.title}
//                             </h1>
//                             <div className="mt-2 flex items-start gap-1.5 text-[#888]">
//                                 <MapPin size={14} className="mt-0.5 shrink-0" strokeWidth={2.5} />
//                                 <span className="text-[13px] leading-snug">
//                                     {[property.location?.fullAddress, property.location?.city, property.location?.state, property.location?.pincode]
//                                         .filter(Boolean).join(", ")}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Price */}
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-5">
//                             <p className="mb-0.5 text-[11px] uppercase tracking-widest text-[#AAA]">
//                                 {property.listingType === "For Rent" || property.listingType === "PG" ? "Monthly Rent" : "Listing Price"}
//                             </p>
//                             <p className="text-[34px] font-black tracking-tight text-[#111] leading-none">
//                                 {formatPrice(property.price, property.listingType)}
//                             </p>
//                             {property.maintenance > 0 && (
//                                 <p className="mt-1.5 text-[12px] text-[#999]">
//                                     + ₹{property.maintenance.toLocaleString("en-IN")}/mo maintenance
//                                 </p>
//                             )}
//                         </div>

//                         {/* Key specs row */}
//                         <div className="grid grid-cols-3 gap-3">
//                             {property.bedrooms > 0 && (
//                                 <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#EBEBEB] bg-white py-4">
//                                     <BedDouble size={20} className="text-[#888]" strokeWidth={1.8} />
//                                     <span className="text-[18px] font-bold text-[#111] leading-none">{property.bedrooms}</span>
//                                     <span className="text-[11px] text-[#AAA]">Bedrooms</span>
//                                 </div>
//                             )}
//                             {property.bathrooms > 0 && (
//                                 <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#EBEBEB] bg-white py-4">
//                                     <Bath size={20} className="text-[#888]" strokeWidth={1.8} />
//                                     <span className="text-[18px] font-bold text-[#111] leading-none">{property.bathrooms}</span>
//                                     <span className="text-[11px] text-[#AAA]">Bathrooms</span>
//                                 </div>
//                             )}
//                             {property.area?.value > 0 && (
//                                 <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-[#EBEBEB] bg-white py-4">
//                                     <Maximize2 size={20} className="text-[#888]" strokeWidth={1.8} />
//                                     <span className="text-[18px] font-bold text-[#111] leading-none">{property.area.value.toLocaleString()}</span>
//                                     <span className="text-[11px] text-[#AAA]">sq.ft</span>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Quick details */}
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white px-5 py-1">
//                             <InfoRow label="Furnishing" value={property.furnishing} />
//                             <InfoRow label="Ownership" value={property.ownershipType} />
//                             <InfoRow label="Facing" value={property.facing} />
//                             <InfoRow label="Flooring" value={property.flooringType} />
//                             <InfoRow label="Floor" value={property.floorNo ? `${property.floorNo} / ${property.totalFloors}` : null} />
//                             <InfoRow label="Parking" value={property.parkingType} />
//                             <InfoRow label="Water Supply" value={property.waterSupply} />
//                             <InfoRow label="Power Backup" value={property.powerBackup} />
//                             <InfoRow label="Condition" value={property.condition} />
//                         </div>

//                         {/* CTA buttons */}
//                         <div className="flex flex-col gap-3">
//                             <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#111] py-4 text-[15px] font-bold text-white transition hover:bg-[#333] active:scale-[0.99]">
//                                 <Phone size={17} />
//                                 Schedule a Visit
//                             </button>
//                             <button className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#DCDCDC] bg-white py-4 text-[15px] font-bold text-[#111] transition hover:border-[#111] hover:bg-[#F5F5F5]">
//                                 <Mail size={17} />
//                                 Send Enquiry
//                             </button>
//                         </div>

//                     </div>
//                 </div>

//                 {/* ── Full-width sections below ── */}
//                 <div className="mt-10 flex flex-col gap-6">

//                     {/* Description */}
//                     {property.description && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-4 text-[18px] font-bold tracking-tight text-[#111]">About this Property</h2>
//                             <p className="text-[15px] leading-[1.85] text-[#555]">{property.description}</p>
//                         </div>
//                     )}

//                     {/* Amenities */}
//                     {property.amenities?.length > 0 && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#111]">Amenities</h2>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.amenities.map((item) => (
//                                     <div key={item} className="flex items-center gap-1.5 rounded-full border border-[#EBEBEB] px-4 py-2">
//                                         <CheckCircle2 size={13} className="text-[#555]" strokeWidth={2} />
//                                         <span className="text-[13px] font-medium text-[#333]">{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Security features */}
//                     {property.securityFeatures?.length > 0 && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#111]">Security Features</h2>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.securityFeatures.map((item) => (
//                                     <div key={item} className="flex items-center gap-1.5 rounded-full border border-[#EBEBEB] px-4 py-2">
//                                         <ShieldCheck size={13} className="text-[#555]" strokeWidth={2} />
//                                         <span className="text-[13px] font-medium text-[#333]">{item}</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Connectivity */}
//                     {property.connectivity?.length > 0 && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#111]">Connectivity</h2>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.connectivity.map((item) => (
//                                     <span key={item} className="rounded-full border border-[#EBEBEB] px-4 py-2 text-[13px] font-medium text-[#444]">
//                                         {item}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Nearby */}
//                     {property.nearbyFacilities?.length > 0 && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#111]">Nearby Facilities</h2>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.nearbyFacilities.map((item) => (
//                                     <span key={item} className="rounded-full border border-[#EBEBEB] px-4 py-2 text-[13px] font-medium text-[#444]">
//                                         {item}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Sell Details */}
//                     {property.saleDetails && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             <h2 className="mb-5 text-[18px] font-bold tracking-tight text-[#111]">Sell Details</h2>
//                             <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
//                                 {[
//                                     ["Possession Status", property.saleDetails.possessionStatus],
//                                     ["Loan Availability", property.saleDetails.loanAvailability],
//                                 ].filter(([, v]) => v).map(([label, value]) => (
//                                     <div key={label}>
//                                         <p className="text-[12px] text-[#AAA]">{label}</p>
//                                         <p className="mt-0.5 text-[14px] font-semibold text-[#111]">{value}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Location */}
//                     {property.location?.latitude && property.location?.longitude && (
//                         <div className="rounded-2xl border border-[#EBEBEB] bg-white p-7">
//                             {/* Heading container altered to flex with justify-between */}
//                             <div className="mb-5 flex items-center justify-between">
//                                 <h2 className="text-[18px] font-bold tracking-tight text-[#111]">
//                                     <span className="inline-flex items-center gap-2">
//                                         <MapPin size={18} className="text-[#888]" />
//                                         Location
//                                     </span>
//                                 </h2>

//                                 {/* Copy Location Button */}
//                                 {property.location?.fullAddress && (
//                                     <button
//                                         onClick={handleCopyLocation}
//                                         className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${copied
//                                             ? "border-green-200 bg-green-50 text-green-600"
//                                             : "border-[#EBEBEB] bg-white text-[#555] hover:bg-gray-50 hover:text-[#111]"
//                                             }`}
//                                     >
//                                         {copied ? (
//                                             <>
//                                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
//                                                 Copied!
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
//                                                 Copy Location
//                                             </>
//                                         )}
//                                     </button>
//                                 )}
//                             </div>

//                             {property.location?.fullAddress && (
//                                 <p className="mb-4 text-[13px] text-[#888] leading-relaxed">{property.location.fullAddress}</p>
//                             )}

//                             <PropertyMap
//                                 lat={property.location.latitude}
//                                 lng={property.location.longitude}
//                                 title={property.title}
//                             />
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// }