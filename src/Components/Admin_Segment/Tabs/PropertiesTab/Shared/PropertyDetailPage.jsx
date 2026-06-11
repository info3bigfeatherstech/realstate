// src/Tabs/PropertiesTab/Shared/PropertyDetailPage.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ArrowLeft, MapPin, Pencil, Trash2, Info, Building2,
    ChevronLeft, ChevronRight, FileText, Download, CheckCircle2, Loader2
} from "lucide-react";
import { useGetPropertyByIdQuery, useDeletePropertyMutation } from "../../../Admin_Redux/PropertyApi/propertyApi";

const formatPrice = (n, listingType) => {
    if (!n && n !== 0) return "—";
    if (listingType === "For Rent" || listingType === "PG") {
        return `₹${n.toLocaleString("en-IN")}/mo`;
    }
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakhs`;
    return `₹${n.toLocaleString("en-IN")}`;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${(bytes / 1000).toFixed(0)} KB`;
};

const StatusBadge = ({ status }) => {
    const map = {
        active: "bg-green-100 text-green-700",
        draft: "bg-yellow-100 text-yellow-700",
        pending: "bg-orange-100 text-orange-700",
        inactive: "bg-gray-100 text-gray-500",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] || "bg-gray-100 text-gray-500"}`}>
            {status}
        </span>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="grid grid-cols-3 items-start py-3 border-b border-slate-100 last:border-0">
        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</span>
        <span className="col-span-2 text-slate-800 text-sm font-semibold">{value || "—"}</span>
    </div>
);

const DetailCard = ({ label, value }) => (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
        <p className="text-slate-800 text-sm font-bold">{value || "—"}</p>
    </div>
);

const TagPill = ({ label, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        orange: "bg-orange-50 text-orange-700",
        green: "bg-green-50 text-green-700",
    };
    return (
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {label}
        </span>
    );
};

const Gallery = ({ media }) => {
    const [current, setCurrent] = useState(0);
    if (!media || media.length === 0) {
        return (
            <div className="h-[420px] w-full rounded-xl bg-slate-200 flex items-center justify-center">
                <p className="text-slate-500">No images available</p>
            </div>
        );
    }

    const prev = () => setCurrent((i) => (i === 0 ? media.length - 1 : i - 1));
    const next = () => setCurrent((i) => (i === media.length - 1 ? 0 : i + 1));

    return (
        <div>
            <div className="relative h-[420px] w-full rounded-xl overflow-hidden bg-slate-200 group">
                <img src={media[current].url} alt={media[current].type} className="w-full h-full object-cover" />
                {media.length > 1 && (
                    <>
                        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={prev} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow cursor-pointer">
                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                            </button>
                            <button onClick={next} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow cursor-pointer">
                                <ChevronRight className="w-5 h-5 text-slate-700" />
                            </button>
                        </div>
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {current + 1} / {media.length}
                        </div>
                    </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {media[current].type}
                </div>
            </div>
            {media.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                    {media.map((m, i) => (
                        <img
                            key={i}
                            src={m.url}
                            alt={m.type}
                            onClick={() => setCurrent(i)}
                            className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${i === current ? "ring-2 ring-blue-600 border-2 border-blue-600" : "border border-slate-200 hover:ring-2 hover:ring-blue-300"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const DeleteConfirmModal = ({ property, onConfirm, onCancel, isDeleting }) => {
    if (!property) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Property</h3>
                <p className="text-slate-600 mb-6">
                    Are you sure you want to delete "{property.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer">
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PropertyDetailPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const propertyId = searchParams.get("id");

    const { data: property, isLoading, refetch } = useGetPropertyByIdQuery(propertyId, { skip: !propertyId });
    const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleBack = () => setSearchParams({ tab: "properties" });
    const handleEdit = () => setSearchParams({ tab: "edit-property", id: propertyId });

    const handleDelete = async () => {
        try {
            await deleteProperty(propertyId).unwrap();
            setShowDeleteModal(false);
            setSearchParams({ tab: "properties" });
            refetch();
        } catch (error) {
            console.error("Failed to delete property:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!property) {
        return <div className="text-center py-20 text-slate-400">Property not found.</div>;
    }

    const { location } = property;

    return (
        <div className="min-h-screen bg-slate-50">
            <DeleteConfirmModal
                property={showDeleteModal ? property : null}
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteModal(false)}
                isDeleting={isDeleting}
            />

            <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <button onClick={handleBack} className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-800">{property.title}</h1>
                            <StatusBadge status={property.status} />
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {[location?.fullAddress, location?.city, location?.state, location?.pincode].filter(Boolean).join(", ")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                        Delete Property
                    </button>
                    <button onClick={handleEdit} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow cursor-pointer">
                        <Pencil className="w-4 h-4" />
                        Edit Property
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <section className="p-6 border-b border-slate-100">
                    <Gallery media={property.media} />
                </section>

                <section className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 mb-5 text-blue-600">
                            <Info className="w-5 h-5" />
                            <h4 className="text-base font-bold">Basic Information</h4>
                        </div>
                        <div className="space-y-0">
                            <InfoRow label="Listing ID" value={property.listingId} />
                            <InfoRow label="Listing Type" value={property.listingType} />
                            <InfoRow label="Property Type" value={property.propertyType} />
                            <InfoRow label="Ownership" value={property.ownershipType} />
                            <InfoRow label="Construction" value={property.constructionStatus} />
                            <InfoRow label="Status" value={property.status?.charAt(0).toUpperCase() + property.status?.slice(1)} />
                            <div className="grid grid-cols-3 items-start py-3 border-b border-slate-100">
                                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Price</span>
                                <div className="col-span-2">
                                    <p className="text-blue-600 text-lg font-bold">{formatPrice(property.price, property.listingType)}</p>
                                    {property.area?.value && (
                                        <p className="text-slate-400 text-xs mt-0.5">
                                            ₹{Math.round(property.price / property.area.value).toLocaleString("en-IN")} / sqft
                                        </p>
                                    )}
                                </div>
                            </div>
                            {property.maintenance > 0 && (
                                <InfoRow label="Maintenance" value={`₹${property.maintenance.toLocaleString("en-IN")}/mo`} />
                            )}
                        </div>
                        {property.description && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Description</p>
                                <p className="text-slate-700 text-sm leading-relaxed">{property.description}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-5 text-blue-600">
                            <Building2 className="w-5 h-5" />
                            <h4 className="text-base font-bold">Property Details</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailCard label="Condition" value={property.condition} />
                            <DetailCard label="Furnishing" value={property.furnishing} />
                            <DetailCard label="Facing" value={property.facing} />
                            <DetailCard label="Flooring" value={property.flooringType} />
                            <DetailCard label="Total Area" value={property.area?.value ? `${property.area.value.toLocaleString()} sqft` : "—"} />
                            <DetailCard label="Bedrooms" value={property.bedrooms} />
                            <DetailCard label="Bathrooms" value={property.bathrooms} />
                            <DetailCard label="Floor No." value={property.floorNo} />
                            <DetailCard label="Total Floors" value={property.totalFloors} />
                            <DetailCard label="Water Supply" value={property.waterSupply} />
                            <DetailCard label="Power Backup" value={property.powerBackup} />
                            <DetailCard label="Parking" value={property.parkingType} />
                        </div>
                    </div>
                </section>

                {/* Sale Details Section */}
                {property.saleDetails && (property.listingType === "For Sale" || property.listingType === "BUY") && (
                    <section className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Sale Details
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <DetailCard label="Possession Status" value={property.saleDetails.possessionStatus} />
                            <DetailCard label="Loan Availability" value={property.saleDetails.loanAvailability} />
                        </div>
                    </section>
                )}

                {/* Rental Details Section */}
                {property.rentalDetails && (property.listingType === "For Rent" || property.listingType === "PG") && (
                    <section className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            Rental Details
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailCard label="Tenant Type" value={property.rentalDetails.tenantTypeAllowed?.join(", ")} />
                            <DetailCard label="Rental Duration" value={property.rentalDetails.rentalAgreementDuration} />
                            <DetailCard label="Security Deposit" value={property.rentalDetails.securityDeposit} />
                            <DetailCard label="Availability" value={property.rentalDetails.availability} />
                            <DetailCard label="Food Preference" value={property.rentalDetails.foodPreference} />
                            <DetailCard label="Pets Allowed" value={property.rentalDetails.pets} />
                            <DetailCard label="Smoking" value={property.rentalDetails.smoking} />
                            <DetailCard label="Alcohol" value={property.rentalDetails.alcohol} />
                            <DetailCard label="Guest Policy" value={property.rentalDetails.guestPolicy} />
                        </div>
                    </section>
                )}

                <section className="p-8 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {property.securityFeatures?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Security Features</h4>
                            <div className="flex flex-wrap gap-2">
                                {property.securityFeatures.map((item) => <TagPill key={item} label={item} color="green" />)}
                            </div>
                        </div>
                    )}
                    {property.amenities?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Building Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                                {property.amenities.map((item) => <TagPill key={item} label={item} color="blue" />)}
                            </div>
                        </div>
                    )}
                    {property.connectivity?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Connectivity</h4>
                            <div className="flex flex-wrap gap-2">
                                {property.connectivity.map((item) => <TagPill key={item} label={item} color="orange" />)}
                            </div>
                        </div>
                    )}
                    {property.nearbyFacilities?.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Nearby Facilities</h4>
                            <div className="flex flex-wrap gap-2">
                                {property.nearbyFacilities.map((item) => <TagPill key={item} label={item} color="orange" />)}
                            </div>
                        </div>
                    )}
                </section>

                <section className="p-8 border-b border-slate-100">
                    <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Property Location
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <DetailCard label="Full Address" value={location?.fullAddress} />
                        <DetailCard label="City" value={location?.city} />
                        <DetailCard label="State" value={location?.state} />
                        <DetailCard label="Pincode" value={location?.pincode} />
                        {location?.latitude && <DetailCard label="Latitude" value={location.latitude} />}
                        {location?.longitude && <DetailCard label="Longitude" value={location.longitude} />}
                    </div>
                    <div className="w-full h-64 rounded-xl overflow-hidden relative bg-slate-200 flex items-center justify-center border border-slate-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
                        <div className="relative z-10 flex flex-col items-center text-slate-600">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white mb-3">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200 text-slate-800 text-sm font-semibold">
                                {location?.fullAddress || "Location"}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Created/Updated Info */}
                <section className="p-8 bg-slate-50/50 rounded-b-2xl">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500">Created At</p>
                            <p className="text-slate-800 font-semibold">{new Date(property.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Last Updated</p>
                            <p className="text-slate-800 font-semibold">{new Date(property.updatedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Created By</p>
                            <p className="text-slate-800 font-semibold">{property.createdBy?.name} ({property.createdBy?.email})</p>
                        </div>
                        {property.publishedAt && (
                            <div>
                                <p className="text-slate-500">Published At</p>
                                <p className="text-slate-800 font-semibold">{new Date(property.publishedAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </section>

                {property.documents?.length > 0 && (
                    <section className="p-8 bg-slate-50/50">
                        <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Legal &amp; Documents
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {property.documents.map((doc, i) => (
                                <a key={i} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors group">
                                    <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="ml-4 flex-1 min-w-0">
                                        <p className="text-slate-800 text-sm font-semibold truncate">{doc.type}</p>
                                        <p className="text-slate-400 text-xs mt-0.5">{formatFileSize(doc.fileSize)}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default PropertyDetailPage;

// // src/Tabs/PropertiesTab/Shared/PropertyDetailPage.jsx
// // Read-only detail view — opened from Eye button in PropertiesTab
// // URL: ?tab=property-detail&id=123
// // Future: replace mock data with real API call using propertyId

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//     ArrowLeft, MapPin, Pencil, Trash2, Info, Building2,
//     ChevronLeft, ChevronRight, FileText, Download, CheckCircle2,
// } from "lucide-react";

// // ─── Mock data — replace with API response ──────────────────────────────────
// const getMockProperty = (id) => ({
//     _id: id,
//     listingId: "EA-99283-LP",
//     listingType: "For Sale",
//     propertyType: "Penthouse",
//     ownershipType: "Freehold",
//     title: "Luxury Penthouse - Skyline View",
//     description:
//         "An ultra-premium penthouse offering panoramic city views, bespoke interiors, and world-class amenities. Designed for those who demand the finest living experience.",
//     condition: "Brand New",
//     constructionStatus: "Ready to Move",
//     furnishing: "Fully Furnished",
//     facing: "North-West",
//     flooringType: "Marble",
//     area: { value: 3400, unit: "sqft" },
//     price: 42500000,
//     maintenance: 15000,
//     bedrooms: 4,
//     bathrooms: 5,
//     floorNo: 32,
//     totalFloors: 35,
//     waterSupply: "Municipal Water",
//     powerBackup: "Full Backup",
//     parkingType: "Covered Parking",
//     securityFeatures: ["CCTV", "Security Guard", "Gated Community"],
//     amenities: ["Lift", "Gym", "Swimming Pool", "Club House", "Jogging Track", "EV Charging"],
//     connectivity: ["Near Metro", "Near Highway"],
//     nearbyFacilities: ["School Nearby", "Hospital Nearby", "Mall Nearby", "Bank Nearby"],
//     status: "active",
//     location: {
//         fullAddress: "742 Evergreen Terrace, Tower A",
//         city: "Mumbai",
//         state: "Maharashtra",
//         pincode: "400001",
//         latitude: 19.076,
//         longitude: 72.8777,
//     },
//     media: [
//         { type: "exterior", url: "https://images.unsplash.com/photo-1600585154340-be6161f7e009?w=1200&fit=crop", isMain: true },
//         { type: "livingRoom", url: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?w=400&fit=crop", isMain: false },
//         { type: "kitchen", url: "https://images.unsplash.com/photo-1600607687940-47a001579227?w=400&fit=crop", isMain: false },
//         { type: "bedroom", url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&fit=crop", isMain: false },
//         { type: "bathroom", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&fit=crop", isMain: false },
//     ],
//     documents: [
//         { type: "Sale Deed", category: "ownership", fileName: "sale_deed.pdf", fileSize: 4400000, url: "#" },
//         { type: "RERA Certificate", category: "approval", fileName: "rera_cert.pdf", fileSize: 1100000, url: "#" },
//         { type: "Property Tax Receipt", category: "taxUtility", fileName: "tax_receipt.pdf", fileSize: 800000, url: "#" },
//     ],
//     createdAt: new Date().toISOString(),
//     publishedAt: new Date().toISOString(),
// });

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const formatPrice = (n) => {
//     if (!n) return "—";
//     if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
//     if (n >= 100000) return `₹${(n / 100000).toFixed(2)} Lakhs`;
//     return `₹${n.toLocaleString("en-IN")}`;
// };

// const formatFileSize = (bytes) => {
//     if (!bytes) return "";
//     if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
//     return `${(bytes / 1000).toFixed(0)} KB`;
// };

// const StatusBadge = ({ status }) => {
//     const map = {
//         active: "bg-green-100 text-green-700",
//         draft: "bg-yellow-100 text-yellow-700",
//         pending: "bg-orange-100 text-orange-700",
//         inactive: "bg-gray-100 text-gray-500",
//     };
//     return (
//         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${map[status] || "bg-gray-100 text-gray-500"}`}>
//             {status}
//         </span>
//     );
// };

// const InfoRow = ({ label, value }) => (
//     <div className="grid grid-cols-3 items-start py-3 border-b border-slate-100 last:border-0">
//         <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{label}</span>
//         <span className="col-span-2 text-slate-800 text-sm font-semibold">{value || "—"}</span>
//     </div>
// );

// const DetailCard = ({ label, value }) => (
//     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
//         <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
//         <p className="text-slate-800 text-sm font-bold">{value || "—"}</p>
//     </div>
// );

// const TagPill = ({ label, color = "blue" }) => {
//     const colors = {
//         blue: "bg-blue-50 text-blue-700",
//         orange: "bg-orange-50 text-orange-700",
//         green: "bg-green-50 text-green-700",
//     };
//     return (
//         <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${colors[color]}`}>
//             <CheckCircle2 className="w-3.5 h-3.5" />
//             {label}
//         </span>
//     );
// };

// // ─── Image Gallery ───────────────────────────────────────────────────────────

// const Gallery = ({ media }) => {
//     const [current, setCurrent] = useState(0);
//     if (!media || media.length === 0) return null;

//     const prev = () => setCurrent((i) => (i === 0 ? media.length - 1 : i - 1));
//     const next = () => setCurrent((i) => (i === media.length - 1 ? 0 : i + 1));

//     return (
//         <div>
//             {/* Main image */}
//             <div className="relative h-[420px] w-full rounded-xl overflow-hidden bg-slate-200 group">
//                 <img
//                     src={media[current].url}
//                     alt={media[current].type}
//                     className="w-full h-full object-cover transition-opacity duration-300"
//                 />
//                 {/* Nav arrows */}
//                 <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <button onClick={prev} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow cursor-pointer">
//                         <ChevronLeft className="w-5 h-5 text-slate-700" />
//                     </button>
//                     <button onClick={next} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center hover:bg-white shadow cursor-pointer">
//                         <ChevronRight className="w-5 h-5 text-slate-700" />
//                     </button>
//                 </div>
//                 {/* Counter badge */}
//                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold">
//                     {current + 1} / {media.length}
//                 </div>
//                 {/* Type label */}
//                 <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold capitalize">
//                     {media[current].type}
//                 </div>
//             </div>
//             {/* Thumbnails */}
//             <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
//                 {media.map((m, i) => (
//                     <img
//                         key={i}
//                         src={m.url}
//                         alt={m.type}
//                         onClick={() => setCurrent(i)}
//                         className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 transition-all ${i === current ? "ring-2 ring-blue-600 border-2 border-blue-600" : "border border-slate-200 hover:ring-2 hover:ring-blue-300"
//                             }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };

// // ─── Main Component ──────────────────────────────────────────────────────────

// const PropertyDetailPage = () => {
//     const [searchParams, setSearchParams] = useSearchParams();
//     const propertyId = searchParams.get("id");

//     const [property, setProperty] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!propertyId) return;
//         // TODO: replace with real API call
//         // dispatch(fetchPropertyById(propertyId)).then(res => setProperty(res))
//         setTimeout(() => {
//             setProperty(getMockProperty(propertyId));
//             setLoading(false);
//         }, 400);
//     }, [propertyId]);

//     const handleBack = () => setSearchParams({ tab: "properties" });
//     const handleEdit = () => setSearchParams({ tab: "edit-property", id: propertyId });
//     const handleDelete = () => {
//         // TODO: call deleteProperty API
//         console.log("Delete property:", propertyId);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             </div>
//         );
//     }

//     if (!property) {
//         return <div className="text-center py-20 text-slate-400">Property not found.</div>;
//     }

//     const { location } = property;

//     return (
//         <div className="min-h-screen bg-slate-50">

//             {/* Page title + action bar */}
//             <div className="flex items-start justify-between mb-6 gap-4">
//                 <div className="flex items-center gap-3">
//                     <button
//                         onClick={handleBack}
//                         className="p-2 rounded-xl text-slate-500 hover:bg-white hover:text-slate-800 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
//                     >
//                         <ArrowLeft className="w-5 h-5" />
//                     </button>
//                     <div>
//                         <div className="flex items-center gap-3">
//                             <h1 className="text-2xl font-bold text-slate-800">{property.title}</h1>
//                             <StatusBadge status={property.status} />
//                         </div>
//                         <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
//                             <MapPin className="w-3.5 h-3.5" />
//                             {[location.fullAddress, location.city, location.state, location.pincode].filter(Boolean).join(", ")}
//                         </p>
//                     </div>
//                 </div>
//                 <div className="flex items-center gap-3 shrink-0">
//                     <button
//                         onClick={handleDelete}
//                         className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
//                     >
//                         <Trash2 className="w-4 h-4" />
//                         Delete Property
//                     </button>
//                     <button
//                         onClick={handleEdit}
//                         className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow cursor-pointer"
//                     >
//                         <Pencil className="w-4 h-4" />
//                         Edit Property
//                     </button>
//                 </div>
//             </div>

//             {/* Main card */}
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

//                 {/* Gallery */}
//                 <section className="p-6 border-b border-slate-100">
//                     <Gallery media={property.media} />
//                 </section>

//                 {/* Basic Info + Property Details */}
//                 <section className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 border-b border-slate-100">

//                     {/* Left: Basic Info */}
//                     <div>
//                         <div className="flex items-center gap-2 mb-5 text-blue-600">
//                             <Info className="w-5 h-5" />
//                             <h4 className="text-base font-bold">Basic Information</h4>
//                         </div>
//                         <div className="space-y-0">
//                             <InfoRow label="Listing ID" value={property.listingId} />
//                             <InfoRow label="Listing Type" value={property.listingType} />
//                             <InfoRow label="Property Type" value={property.propertyType} />
//                             <InfoRow label="Ownership" value={property.ownershipType} />
//                             <InfoRow label="Construction" value={property.constructionStatus} />
//                             <InfoRow label="Status" value={property.status?.charAt(0).toUpperCase() + property.status?.slice(1)} />
//                             <div className="grid grid-cols-3 items-start py-3 border-b border-slate-100">
//                                 <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Price</span>
//                                 <div className="col-span-2">
//                                     <p className="text-blue-600 text-lg font-bold">{formatPrice(property.price)}</p>
//                                     {property.area?.value && (
//                                         <p className="text-slate-400 text-xs mt-0.5">
//                                             ₹{Math.round(property.price / property.area.value).toLocaleString("en-IN")} / sqft
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                             {property.maintenance && (
//                                 <InfoRow label="Maintenance" value={`₹${property.maintenance.toLocaleString("en-IN")} / mo`} />
//                             )}
//                         </div>
//                         {/* Description */}
//                         {property.description && (
//                             <div className="mt-6">
//                                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Description</p>
//                                 <p className="text-slate-700 text-sm leading-relaxed">{property.description}</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Right: Property Details */}
//                     <div>
//                         <div className="flex items-center gap-2 mb-5 text-blue-600">
//                             <Building2 className="w-5 h-5" />
//                             <h4 className="text-base font-bold">Property Details</h4>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <DetailCard label="Condition" value={property.condition} />
//                             <DetailCard label="Furnishing" value={property.furnishing} />
//                             <DetailCard label="Facing" value={property.facing} />
//                             <DetailCard label="Flooring" value={property.flooringType} />
//                             <DetailCard label="Total Area" value={property.area?.value ? `${property.area.value.toLocaleString()} sqft` : "—"} />
//                             <DetailCard label="Bedrooms" value={property.bedrooms} />
//                             <DetailCard label="Bathrooms" value={property.bathrooms} />
//                             <DetailCard label="Floor No." value={property.floorNo} />
//                             <DetailCard label="Total Floors" value={property.totalFloors} />
//                             <DetailCard label="Water Supply" value={property.waterSupply} />
//                             <DetailCard label="Power Backup" value={property.powerBackup} />
//                             <DetailCard label="Parking" value={property.parkingType} />
//                         </div>
//                     </div>
//                 </section>

//                 {/* Amenities & Facilities */}
//                 <section className="p-8 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-10">
//                     {/* Security */}
//                     {property.securityFeatures?.length > 0 && (
//                         <div>
//                             <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Security Features</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.securityFeatures.map((item) => (
//                                     <TagPill key={item} label={item} color="green" />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Amenities */}
//                     {property.amenities?.length > 0 && (
//                         <div>
//                             <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Building Amenities</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.amenities.map((item) => (
//                                     <TagPill key={item} label={item} color="blue" />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Connectivity */}
//                     {property.connectivity?.length > 0 && (
//                         <div>
//                             <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Connectivity</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.connectivity.map((item) => (
//                                     <TagPill key={item} label={item} color="orange" />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Nearby Facilities */}
//                     {property.nearbyFacilities?.length > 0 && (
//                         <div>
//                             <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Nearby Facilities</h4>
//                             <div className="flex flex-wrap gap-2">
//                                 {property.nearbyFacilities.map((item) => (
//                                     <TagPill key={item} label={item} color="orange" />
//                                 ))}
//                             </div>
//                         </div>
//                     )}
//                 </section>

//                 {/* Location */}
//                 <section className="p-8 border-b border-slate-100">
//                     <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
//                         <MapPin className="w-5 h-5 text-blue-600" />
//                         Property Location
//                     </h4>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                         <DetailCard label="Full Address" value={location.fullAddress} />
//                         <DetailCard label="City" value={location.city} />
//                         <DetailCard label="State" value={location.state} />
//                         <DetailCard label="Pincode" value={location.pincode} />
//                         {location.latitude && <DetailCard label="Latitude" value={location.latitude} />}
//                         {location.longitude && <DetailCard label="Longitude" value={location.longitude} />}
//                     </div>
//                     {/* Map placeholder */}
//                     <div className="w-full h-64 rounded-xl overflow-hidden relative bg-slate-200 flex items-center justify-center border border-slate-200">
//                         <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
//                         <div className="relative z-10 flex flex-col items-center text-slate-600">
//                             <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-white mb-3">
//                                 <MapPin className="w-6 h-6" />
//                             </div>
//                             <div className="bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200 text-slate-800 text-sm font-semibold">
//                                 {location.fullAddress || "Location"}
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Documents */}
//                 {property.documents?.length > 0 && (
//                     <section className="p-8 bg-slate-50/50">
//                         <h4 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
//                             <FileText className="w-5 h-5 text-blue-600" />
//                             Legal &amp; Documents
//                         </h4>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                             {property.documents.map((doc, i) => (
//                                 <a
//                                     key={i}
//                                     href={doc.url}
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     className="flex items-center p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors group"
//                                 >
//                                     <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
//                                         <FileText className="w-5 h-5" />
//                                     </div>
//                                     <div className="ml-4 flex-1 min-w-0">
//                                         <p className="text-slate-800 text-sm font-semibold truncate">{doc.type}</p>
//                                         <p className="text-slate-400 text-xs mt-0.5">
//                                             {doc.mimeType?.includes("pdf") ? "PDF" : "File"} • {formatFileSize(doc.fileSize)}
//                                         </p>
//                                     </div>
//                                     <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
//                                 </a>
//                             ))}
//                         </div>
//                     </section>
//                 )}

//             </div>
//         </div>
//     );
// };

// export default PropertyDetailPage;