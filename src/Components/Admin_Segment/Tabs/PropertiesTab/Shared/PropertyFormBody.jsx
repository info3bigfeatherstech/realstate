import React, { useState, useRef } from "react";
import {
    Info, Building2, Zap, Waves, Camera, FileText, MapPin,
    ChevronUp, ChevronDown, Upload, X,
} from "lucide-react";
import LocationPicker from "./LocationPicker";
import { useGetConstantsQuery } from "../../../../../REDUX_FEATURES/REDUX_SLICES/constantsApi/constantsApi";
import { normalizeListingTypesList, isSellListingType } from "../../../../../utils/listingType";
import { isRentalListingType } from "../../../../../utils/propertyFormPayload";
import RentalDetailsSection from "../../../../Shared/PropertyForm/RentalDetailsSection";
import SaleDetailsSection from "../../../../Shared/PropertyForm/SaleDetailsSection";
import SelectFieldWithOther, { NumberInputField } from "../../../../Shared/PropertyForm/SelectFieldWithOther";
import { OTHER_OPTION } from "../../../../../utils/propertyFormPayload";
import { getPropertyTypeOptions, getTitleOptions } from "../../../../../utils/propertyFormConstants";

// Geocoding aliases → canonical state name from /constants INDIAN_STATE_NAMES
const STATE_ALIASES = {
    "delhi": "Delhi",
};

const normalizeState = (raw, validStates = []) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (!validStates.length) return trimmed;
    const exactMatch = validStates.find(s => s.toLowerCase() === trimmed.toLowerCase());
    if (exactMatch) return exactMatch;
    const key = trimmed.toLowerCase().replace(/\s+/g, "");
    if (STATE_ALIASES[key]) return STATE_ALIASES[key];
    if (STATE_ALIASES[trimmed.toLowerCase()]) return STATE_ALIASES[trimmed.toLowerCase()];
    const partialMatch = validStates.find(s => trimmed.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(trimmed.toLowerCase()));
    if (partialMatch) return partialMatch;
    return trimmed;
};


const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const Field = ({ label, required, children }) => (
    <div>
        <label className={labelCls}>{label} {required && <span className="text-red-500">*</span>}</label>
        {children}
    </div>
);

const InputField = ({ label, required, type = "text", placeholder, value, onChange }) => (
    <Field label={label} required={required}>
        <input className={inputCls} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
);

const OtherSelect = ({ label, required, fieldKey, formData, onChange, options, onSelectChange }) => {
    const otherValues = formData.otherValues || {};
    return (
        <SelectFieldWithOther
            label={label}
            required={required}
            value={formData[fieldKey] ?? ""}
            otherValue={otherValues[fieldKey] ?? ""}
            onChange={(val) => {
                if (onSelectChange) {
                    onSelectChange(val);
                } else {
                    onChange(fieldKey, val);
                    if (val !== OTHER_OPTION) {
                        onChange("otherValues", { ...otherValues, [fieldKey]: "" });
                    }
                }
            }}
            onOtherChange={(val) => onChange("otherValues", { ...otherValues, [fieldKey]: val })}
            options={options}
        />
    );
};

const Section = ({ icon: Icon, title, defaultOpen = true, children, fullWidth = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${fullWidth ? "lg:col-span-2" : ""}`}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full px-6 py-4 flex items-center justify-between border-b hover:bg-slate-50">
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                    <span className="text-base font-semibold text-slate-800">{title}</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {open && <div className="p-6">{children}</div>}
        </div>
    );
};

const CheckItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
        <span className="text-sm text-slate-700">{label}</span>
    </label>
);

// ✅ Handles both File objects and URL strings
const ImageUpload = ({ label, file, url, onFileChange, onRemove, accept = "image/*" }) => {
    const inputRef = useRef(null);
    const previewUrl = file instanceof File ? URL.createObjectURL(file) : (url || null);
    const isVideo = accept.includes("video");

    return (
        <div className="relative group">
            {previewUrl ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                    {isVideo ? (
                        <video src={previewUrl} className="w-full h-full object-cover" controls />
                    ) : (
                        <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
                    )}
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">{label}</span>
                </button>
            )}
            <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
        </div>
    );
};

const DocumentUpload = ({ label, file, url, name, onFileChange, onRemove }) => {
    const inputRef = useRef(null);
    const hasFile = file || url;
    const fileName = file ? file.name : name;

    return (
        <div className="border border-slate-200 rounded-lg p-3">
            {hasFile ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        {url ? (
                            <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[150px] font-medium">
                                {fileName || "View Document"}
                            </a>
                        ) : (
                            <span className="text-sm text-slate-700 truncate max-w-[150px]">{fileName}</span>
                        )}
                    </div>
                    <button type="button" onClick={onRemove} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Upload {label}
                </button>
            )}
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
        </div>
    );
};

const DOCUMENT_SLOTS = [
    { key: "aadhaarCard", label: "Aadhaar Card", type: "Aadhaar Card", category: "identity" },
    { key: "panCard", label: "PAN Card", type: "PAN Card", category: "identity" },
    { key: "passport", label: "Passport", type: "Passport", category: "identity" },
    { key: "drivingLicence", label: "Driving Licence", type: "Driving Licence", category: "identity" },
    { key: "voterId", label: "Voter ID", type: "Voter ID", category: "identity" },
    { key: "saleDeed", label: "Sale Deed", type: "Sale Deed", category: "ownership" },
    { key: "registry", label: "Registry", type: "Registry", category: "ownership" },
    { key: "conveyanceDeed", label: "Conveyance Deed", type: "Conveyance Deed", category: "ownership" },
    { key: "mutationCertificate", label: "Mutation Certificate", type: "Mutation Certificate", category: "ownership" },
    { key: "reraCertificate", label: "RERA Certificate", type: "RERA Certificate", category: "approval" },
    { key: "occupancyCertificate", label: "Occupancy Certificate", type: "Occupancy Certificate", category: "approval" },
    { key: "completionCertificate", label: "Completion Certificate", type: "Completion Certificate", category: "approval" },
    { key: "approvedBuildingPlan", label: "Approved Building Plan", type: "Approved Building Plan", category: "approval" },
    { key: "taxReceipt", label: "Property Tax Receipt", type: "Property Tax Receipt", category: "taxUtility" },
    { key: "electricityBill", label: "Electricity Bill", type: "Electricity Bill", category: "taxUtility" },
    { key: "waterBill", label: "Water Bill", type: "Water Bill", category: "taxUtility" },
    { key: "encumbrance", label: "Encumbrance Certificate", type: "Encumbrance Certificate", category: "legal" },
    { key: "noc", label: "NOC", type: "NOC", category: "legal" },
    { key: "societyShareCertificate", label: "Society Share Certificate", type: "Society Share Certificate", category: "legal" },
];

const PropertyFormBody = ({ formData, onChange }) => {
    const { data: constants } = useGetConstantsQuery();
    const listingTypes = normalizeListingTypesList(constants?.LISTING_TYPES) ?? [];
    const stateNames = constants?.INDIAN_STATE_NAMES ?? ["Delhi"];
    const showRental = isRentalListingType(formData.listingType);
    const showSale = isSellListingType(formData.listingType);
    const propertyTypeOptions = getPropertyTypeOptions(
        constants?.PROPERTY_TYPES ?? [],
        formData.listingType
    );
    const titleOptions = getTitleOptions(formData.listingType);

    const set = (field) => (val) => onChange(field, val);
    const toggleCheck = (field, item) => {
        const current = formData[field] || [];
        onChange(field, current.includes(item) ? current.filter(x => x !== item) : [...current, item]);
    };

    const handleListingTypeChange = (val) => {
        const otherValues = formData.otherValues || {};
        onChange("listingType", val);
        if (val !== OTHER_OPTION) {
            onChange("otherValues", { ...otherValues, listingType: "" });
        }
        const nextPropTypes = getPropertyTypeOptions(constants?.PROPERTY_TYPES ?? [], val);
        const currentProp = formData.propertyType;
        if (currentProp && currentProp !== OTHER_OPTION && !nextPropTypes.includes(currentProp)) {
            onChange("propertyType", "");
            onChange("otherValues", { ...otherValues, propertyType: "" });
        }
        const nextTitleOpts = getTitleOptions(val);
        const currentTitle = formData.title;
        if (currentTitle && currentTitle !== OTHER_OPTION && !nextTitleOpts.includes(currentTitle)) {
            onChange("title", "");
            onChange("otherValues", { ...otherValues, title: "" });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* 1. Basic Listing Info */}
            <Section icon={Info} title="Basic Listing Info" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <OtherSelect
                        label="Listing Type"
                        required
                        fieldKey="listingType"
                        formData={formData}
                        onChange={onChange}
                        options={listingTypes}
                        onSelectChange={handleListingTypeChange}
                    />
                    <OtherSelect
                        label="Property Type"
                        required
                        fieldKey="propertyType"
                        formData={formData}
                        onChange={onChange}
                        options={propertyTypeOptions}
                    />
                    <OtherSelect
                        label="Ownership Type"
                        fieldKey="ownershipType"
                        formData={formData}
                        onChange={onChange}
                        options={constants?.OWNERSHIP_TYPES ?? []}
                    />
                    <div className="md:col-span-3">
                        <OtherSelect
                            label="Listing Title"
                            required
                            fieldKey="title"
                            formData={formData}
                            onChange={onChange}
                            options={titleOptions}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Field label="Description">
                            <textarea
                                rows="4"
                                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-600 outline-none text-sm"
                                placeholder="Enter property description"
                                value={formData.description}
                                onChange={(e) => onChange("description", e.target.value)}
                            />
                        </Field>
                    </div>
                </div>
            </Section>

            {/* 2. Property Details */}
            <Section icon={Building2} title="Property Details">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <OtherSelect
                            label="Condition"
                            fieldKey="condition"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.PROPERTY_CONDITIONS ?? []}
                        />
                        <OtherSelect
                            label="Construction Status"
                            fieldKey="constructionStatus"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.CONSTRUCTION_STATUSES ?? []}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <OtherSelect
                            label="Furnishing"
                            fieldKey="furnishing"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.FURNISHING_STATUSES ?? []}
                        />
                        <OtherSelect
                            label="Facing"
                            fieldKey="facing"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.FACING_DIRECTIONS ?? []}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <NumberInputField
                            label="Area (sq ft)"
                            value={formData.areaValue}
                            onChange={set("areaValue")}
                        />
                        <div className="col-span-2">
                            <NumberInputField
                                label="Price (₹)" required
                                value={formData.price}
                                onChange={set("price")}
                            />
                        </div>
                        <NumberInputField
                            label="ROI (%)"
                            placeholder="0–100"
                            value={formData.roi ?? ""}
                            onChange={set("roi")}
                            max={100}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <NumberInputField label="Bedrooms" value={formData.bedrooms} onChange={set("bedrooms")} />
                        <NumberInputField label="Bathrooms" value={formData.bathrooms} onChange={set("bathrooms")} />
                        <NumberInputField label="Floor No" value={formData.floorNo} onChange={set("floorNo")} />
                        <NumberInputField label="Total Floors" value={formData.totalFloors} onChange={set("totalFloors")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <OtherSelect
                            label="Flooring Type"
                            fieldKey="flooringType"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.FLOORING_TYPES ?? []}
                        />
                        <NumberInputField
                            label="Maintenance (₹/mo)"
                            value={formData.maintenance}
                            onChange={set("maintenance")}
                        />
                    </div>
                </div>
            </Section>

            {/* 3. Utilities & Parking */}
            <Section icon={Zap} title="Utilities & Parking">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <OtherSelect
                            label="Water Supply"
                            fieldKey="waterSupply"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.WATER_SUPPLY_TYPES ?? []}
                        />
                        <OtherSelect
                            label="Power Backup"
                            fieldKey="powerBackup"
                            formData={formData}
                            onChange={onChange}
                            options={constants?.POWER_BACKUP_TYPES ?? []}
                        />
                    </div>
                    <OtherSelect
                        label="Parking Type"
                        fieldKey="parkingType"
                        formData={formData}
                        onChange={onChange}
                        options={constants?.PARKING_TYPES ?? []}
                    />
                    <div>
                        <label className={labelCls}>Security Features</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {(constants?.SECURITY_FEATURES ?? []).map(item => (
                                <CheckItem
                                    key={item} label={item}
                                    checked={formData.securityFeatures?.includes(item)}
                                    onChange={() => toggleCheck("securityFeatures", item)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {showRental && (
                <RentalDetailsSection
                    rentalDetails={formData.rentalDetails}
                    onChange={onChange}
                />
            )}

            {showSale && (
                <SaleDetailsSection
                    saleDetails={formData.saleDetails}
                    onChange={onChange}
                />
            )}

            {/* 4. Amenities */}
            <Section icon={Waves} title="Amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(constants?.AMENITIES ?? []).map(item => (
                        <CheckItem
                            key={item} label={item}
                            checked={formData.amenities?.includes(item)}
                            onChange={() => toggleCheck("amenities", item)}
                        />
                    ))}
                </div>
            </Section>

            {/* 5. Media Uploads */}
            <Section icon={Camera} title="Media Uploads" fullWidth>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { key: "exterior", label: "Exterior" },
                        { key: "livingRoom", label: "Living Room" },
                        { key: "bedroom", label: "Bedroom" },
                        { key: "kitchen", label: "Kitchen" },
                        { key: "bathroom", label: "Bathroom" },
                        { key: "balcony", label: "Balcony" },
                        { key: "society", label: "Society" },
                        { key: "floorPlan", label: "Floor Plan" },
                        { key: "video", label: "Video" },
                    ].map(({ key, label }) => (
                        <ImageUpload
                            key={key}
                            label={label}
                            accept={key === "video" ? "video/*" : "image/*"}
                            file={formData.images?.[key] instanceof File ? formData.images[key] : null}
                            url={typeof formData.images?.[key] === "string" ? formData.images[key] : null}
                            onFileChange={(file) => onChange(`images.${key}`, file)}
                            onRemove={() => onChange(`images.${key}`, null)}
                        />
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">Supported: JPG, PNG. Max 5MB each.</p>
            </Section>

            {/* 6. Documents Upload */}
            <Section icon={FileText} title="Documents Upload" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {DOCUMENT_SLOTS.map(({ key, label, type, category }) => (
                        <DocumentUpload
                            key={key}
                            label={label}
                            file={formData.documents?.[key]?.file}
                            url={formData.documents?.[key]?.url}
                            name={formData.documents?.[key]?.name}
                            onFileChange={(file) => onChange(`documents.${key}`, { file, category, type })}
                            onRemove={() => onChange(`documents.${key}`, null)}
                        />
                    ))}
                </div>
            </Section>

            {/* 7. Connectivity & Nearby */}
            <Section icon={MapPin} title="Connectivity & Nearby" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelCls}>Connectivity</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {(constants?.CONNECTIVITY ?? []).map(item => (
                                <CheckItem
                                    key={item} label={item}
                                    checked={formData.connectivity?.includes(item)}
                                    onChange={() => toggleCheck("connectivity", item)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Nearby Facilities</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {(constants?.NEARBY_FACILITIES ?? []).map(item => (
                                <CheckItem
                                    key={item} label={item}
                                    checked={formData.nearbyFacilities?.includes(item)}
                                    onChange={() => toggleCheck("nearbyFacilities", item)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 8. Location Details */}
            <Section icon={MapPin} title="Location Details" fullWidth>
                <div className="space-y-5">
                    {/*<div>
                        <label className={labelCls}>Pick Location on Map</label>
                        <p className="text-xs text-slate-400 mb-2">Search for an address or click anywhere on the map — all fields below will auto-fill.</p>
                        <LocationPicker
                            onChange={({ lat, lng, fullAddress, city, state, pincode }) => {
                                set("latitude")(String(lat));
                                set("longitude")(String(lng));
                                if (fullAddress) set("fullAddress")(fullAddress);
                                if (city) set("city")(city);
                                // Normalize state to backend-accepted enum value
                                if (state) set("state")(normalizeState(state, stateNames));
                                if (pincode) set("pincode")(pincode);
                            }}
                        />
                    </div>*/}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-3">
                            <InputField
                                label="Full Address"
                                placeholder="Enter Your Address"
                                value={formData.fullAddress}
                                onChange={set("fullAddress")}
                            />
                        </div>
                        <InputField label="City" required placeholder="Enter City" value={formData.city} onChange={set("city")} />
                        <Field label="State" required>
                            <select
                                className={inputCls}
                                value={formData.state ?? ""}
                                onChange={(e) => onChange("state", e.target.value)}
                            >
                                <option value="">Select State</option>
                                <option value="Delhi">Delhi</option>
                            </select>
                        </Field>
                        <InputField label="Pincode" required placeholder="Enter pincode" value={formData.pincode} onChange={set("pincode")} />
                        <InputField label="Latitude" placeholder="optional" value={formData.latitude} onChange={set("latitude")} />
                        <InputField label="Longitude" placeholder="optional" value={formData.longitude} onChange={set("longitude")} />
                    </div>
                </div>
            </Section>

        </div>
    );
};

export default PropertyFormBody;

// down code is working but missing some fields user upper code
// import React, { useState, useRef } from "react";
// import {
//     Info, Building2, Zap, Waves, Camera, FileText, MapPin,
//     ChevronUp, ChevronDown, Upload, X,
// } from "lucide-react";
// import LocationPicker from "./LocationPicker";

// const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
// const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

// const Field = ({ label, required, children }) => (
//     <div>
//         <label className={labelCls}>{label} {required && <span className="text-red-500">*</span>}</label>
//         {children}
//     </div>
// );

// const SelectField = ({ label, required, value, onChange, options }) => (
//     <Field label={label} required={required}>
//         <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
//             <option value="">Select</option>
//             {options.map((o) => <option key={o} value={o}>{o}</option>)}
//         </select>
//     </Field>
// );

// const InputField = ({ label, required, type = "text", placeholder, value, onChange }) => (
//     <Field label={label} required={required}>
//         <input className={inputCls} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
//     </Field>
// );

// const Section = ({ icon: Icon, title, defaultOpen = true, children, fullWidth = false }) => {
//     const [open, setOpen] = useState(defaultOpen);
//     return (
//         <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${fullWidth ? "lg:col-span-2" : ""}`}>
//             <button type="button" onClick={() => setOpen(!open)} className="w-full px-6 py-4 flex items-center justify-between border-b hover:bg-slate-50">
//                 <div className="flex items-center gap-3">
//                     <Icon className="w-5 h-5 text-blue-600" />
//                     <span className="text-base font-semibold text-slate-800">{title}</span>
//                 </div>
//                 {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//             </button>
//             {open && <div className="p-6">{children}</div>}
//         </div>
//     );
// };

// const CheckItem = ({ label, checked, onChange }) => (
//     <label className="flex items-center gap-2 cursor-pointer">
//         <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded accent-blue-600" />
//         <span className="text-sm text-slate-700">{label}</span>
//     </label>
// );

// // ✅ FIXED: ImageUpload component that handles both File objects and URL strings
// const ImageUpload = ({ label, file, url, onFileChange, onRemove }) => {
//     const inputRef = useRef(null);

//     // Determine preview source
//     const previewUrl = file instanceof File ? URL.createObjectURL(file) : (url || null);

//     return (
//         <div className="relative group">
//             {previewUrl ? (
//                 <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
//                     <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
//                     <button
//                         type="button"
//                         onClick={onRemove}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                     >
//                         <X className="w-3 h-3" />
//                     </button>
//                 </div>
//             ) : (
//                 <button
//                     type="button"
//                     onClick={() => inputRef.current?.click()}
//                     className="w-full aspect-square border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
//                 >
//                     <Camera className="w-6 h-6 text-slate-400 mb-1" />
//                     <span className="text-xs text-slate-500">{label}</span>
//                 </button>
//             )}
//             <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
//         </div>
//     );
// };

// // Document Upload Component
// const DocumentUpload = ({ label, file, url, name, onFileChange, onRemove }) => {
//     const inputRef = useRef(null);
//     const hasFile = file || url;
//     const fileName = file ? file.name : name;

//     return (
//         <div className="border border-slate-200 rounded-lg p-3">
//             {hasFile ? (
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <FileText className="w-4 h-4 text-blue-600" />
//                         {url ? (
//                             <a href={url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate max-w-[150px] font-medium">
//                                 {fileName || "View Document"}
//                             </a>
//                         ) : (
//                             <span className="text-sm text-slate-700 truncate max-w-[150px]">{fileName}</span>
//                         )}
//                     </div>
//                     <button type="button" onClick={onRemove} className="p-1 text-red-500 hover:bg-red-50 rounded">
//                         <X className="w-3 h-3" />
//                     </button>
//                 </div>
//             ) : (
//                 <button
//                     type="button"
//                     onClick={() => inputRef.current?.click()}
//                     className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
//                 >
//                     <Upload className="w-4 h-4" />
//                     Upload {label}
//                 </button>
//             )}
//             <input ref={inputRef} type="file" accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
//         </div>
//     );
// };

// const PropertyFormBody = ({ formData, onChange }) => {
//     const set = (field) => (val) => onChange(field, val);
//     const toggleCheck = (field, item) => {
//         const current = formData[field] || [];
//         onChange(field, current.includes(item) ? current.filter(x => x !== item) : [...current, item]);
//     };

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* 1. Basic Listing Info */}
//             <Section icon={Info} title="Basic Listing Info" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <SelectField label="Listing Type" required value={formData.listingType} onChange={set("listingType")} options={["For Sale", "For Rent", "BUY", "PG"]} />
//                     <SelectField label="Property Type" required value={formData.propertyType} onChange={set("propertyType")} options={["Flat", "Villa", "Penthouse", "Studio Apartment", "Office Space", "Shop", "Warehouse"]} />
//                     <SelectField label="Ownership Type" value={formData.ownershipType} onChange={set("ownershipType")} options={["Freehold", "Leasehold", "POA"]} />
//                     <div className="md:col-span-3">
//                         <InputField label="Listing Title" required placeholder="Enter property title" value={formData.title} onChange={set("title")} />
//                     </div>
//                     <div className="md:col-span-3">
//                         <Field label="Description" required>
//                             <textarea rows="4" className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-600 outline-none text-sm" value={formData.description} onChange={(e) => onChange("description", e.target.value)} />
//                         </Field>
//                     </div>
//                 </div>
//             </Section>

//             {/* 2. Property Details */}
//             <Section icon={Building2} title="Property Details">
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Condition" value={formData.condition} onChange={set("condition")} options={["Brand New", "Excellent", "Good", "Average"]} />
//                         <SelectField label="Construction Status" value={formData.constructionStatus} onChange={set("constructionStatus")} options={["Ready to Move", "Under Construction"]} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Furnishing" value={formData.furnishing} onChange={set("furnishing")} options={["Unfurnished", "Semi-Furnished", "Fully Furnished"]} />
//                         <SelectField label="Facing" value={formData.facing} onChange={set("facing")} options={["North", "South", "East", "West", "North-East", "North-West"]} />
//                     </div>
//                     <div className="grid grid-cols-3 gap-4">
//                         <InputField label="Area (sq ft)" type="number" value={formData.areaValue} onChange={set("areaValue")} />
//                         <div className="col-span-2">
//                             <InputField label="Price (₹)" required type="number" value={formData.price} onChange={set("price")} />
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-4 gap-4">
//                         <InputField label="Bedrooms" type="number" value={formData.bedrooms} onChange={set("bedrooms")} />
//                         <InputField label="Bathrooms" type="number" value={formData.bathrooms} onChange={set("bathrooms")} />
//                         <InputField label="Floor No" type="number" value={formData.floorNo} onChange={set("floorNo")} />
//                         <InputField label="Total Floors" type="number" value={formData.totalFloors} onChange={set("totalFloors")} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Flooring Type" value={formData.flooringType} onChange={set("flooringType")} options={["Marble", "Granite", "Wooden Flooring"]} />
//                         <InputField label="Maintenance (₹/mo)" type="number" value={formData.maintenance} onChange={set("maintenance")} />
//                     </div>
//                 </div>
//             </Section>

//             {/* 3. Utilities & Parking */}
//             <Section icon={Zap} title="Utilities & Parking">
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Water Supply" value={formData.waterSupply} onChange={set("waterSupply")} options={["Municipal Water", "Borewell", "Both"]} />
//                         <SelectField label="Power Backup" value={formData.powerBackup} onChange={set("powerBackup")} options={["No Backup", "Full Backup"]} />
//                     </div>
//                     <SelectField label="Parking Type" value={formData.parkingType} onChange={set("parkingType")} options={["No Parking", "Open Parking", "Covered Parking", "Basement Parking"]} />
//                     <div>
//                         <label className={labelCls}>Security Features</label>
//                         <div className="grid grid-cols-2 gap-2 mt-1">
//                             {["CCTV", "Security Guard", "Gated Community"].map(item => (
//                                 <CheckItem key={item} label={item} checked={formData.securityFeatures?.includes(item)} onChange={() => toggleCheck("securityFeatures", item)} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </Section>

//             {/* 4. Amenities */}
//             <Section icon={Waves} title="Amenities">
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {["Lift", "Gym", "Swimming Pool", "Club House", "Park", "Kids Play Area", "Jogging Track", "Visitor Parking", "EV Charging", "Temple", "Sports Court"].map(item => (
//                         <CheckItem key={item} label={item} checked={formData.amenities?.includes(item)} onChange={() => toggleCheck("amenities", item)} />
//                     ))}
//                 </div>
//             </Section>

//             {/* 5. Media Uploads */}
//             <Section icon={Camera} title="Media Uploads" fullWidth>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     {[
//                         { key: "exterior", label: "Exterior" },
//                         { key: "livingRoom", label: "Living Room" },
//                         { key: "bedroom", label: "Bedroom" },
//                         { key: "kitchen", label: "Kitchen" },
//                         { key: "bathroom", label: "Bathroom" },
//                         { key: "balcony", label: "Balcony" },
//                         { key: "society", label: "Society" },
//                         { key: "floorPlan", label: "Floor Plan" },
//                     ].map(({ key, label }) => (
//                         <ImageUpload
//                             key={key}
//                             label={label}
//                             file={formData.images?.[key] instanceof File ? formData.images[key] : null}
//                             url={typeof formData.images?.[key] === 'string' ? formData.images[key] : null}
//                             onFileChange={(file) => onChange(`images.${key}`, file)}
//                             onRemove={() => onChange(`images.${key}`, null)}
//                         />
//                     ))}
//                 </div>
//                 <p className="text-xs text-slate-400 mt-3">Supported: JPG, PNG. Max 5MB each.</p>
//             </Section>

//             {/* 6. Documents Upload */}
//             <Section icon={FileText} title="Documents Upload" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {[
//                         { key: "saleDeed", label: "Sale Deed", type: "Sale Deed", category: "ownership" },
//                         { key: "reraCertificate", label: "RERA Certificate", type: "RERA Certificate", category: "approval" },
//                         { key: "taxReceipt", label: "Tax Receipt", type: "Property Tax Receipt", category: "taxUtility" },
//                         { key: "electricityBill", label: "Electricity Bill", type: "Electricity Bill", category: "taxUtility" },
//                         { key: "occupancyCertificate", label: "Occupancy Certificate", type: "Occupancy Certificate", category: "approval" },
//                         { key: "encumbrance", label: "Encumbrance Certificate", type: "Encumbrance Certificate", category: "legal" },
//                     ].map(({ key, label, type, category }) => (
//                         <DocumentUpload
//                             key={key}
//                             label={label}
//                             file={formData.documents?.[key]?.file}
//                             url={formData.documents?.[key]?.url}
//                             name={formData.documents?.[key]?.name}
//                             onFileChange={(file) => onChange(`documents.${key}`, { file, category, type })}
//                             onRemove={() => onChange(`documents.${key}`, null)}
//                         />
//                     ))}
//                 </div>
//             </Section>

//             {/* 7. Connectivity & Nearby */}
//             <Section icon={MapPin} title="Connectivity & Nearby" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label className={labelCls}>Connectivity</label>
//                         <div className="grid grid-cols-2 gap-2 mt-1">
//                             {["Near Metro", "Near Railway Station", "Near Airport", "Near Highway", "Near Bus Stand"].map(item => (
//                                 <CheckItem key={item} label={item} checked={formData.connectivity?.includes(item)} onChange={() => toggleCheck("connectivity", item)} />
//                             ))}
//                         </div>
//                     </div>
//                     <div>
//                         <label className={labelCls}>Nearby Facilities</label>
//                         <div className="grid grid-cols-2 gap-2 mt-1">
//                             {["School Nearby", "Hospital Nearby", "Market Nearby", "Mall Nearby", "Bank Nearby", "Park Nearby"].map(item => (
//                                 <CheckItem key={item} label={item} checked={formData.nearbyFacilities?.includes(item)} onChange={() => toggleCheck("nearbyFacilities", item)} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </Section>

//             {/* 8. Location Details */}
//             <Section icon={MapPin} title="Location Details" fullWidth>
//                 <div className="space-y-5">
//                     {/* Map Picker */}
//                     <div>
//                         <label className={labelCls}>Pick Location on Map</label>
//                         <p className="text-xs text-slate-400 mb-2">Search for an address or click anywhere on the map — all fields below will auto-fill.</p>
//                         <LocationPicker
//                             onChange={({ lat, lng, fullAddress, city, state, pincode }) => {
//                                 set("latitude")(String(lat));
//                                 set("longitude")(String(lng));
//                                 if (fullAddress) set("fullAddress")(fullAddress);
//                                 if (city) set("city")(city);
//                                 if (state) set("state")(state);
//                                 if (pincode) set("pincode")(pincode);
//                             }}
//                         />
//                     </div>

//                     {/* Auto-filled fields (editable) */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                         <div className="md:col-span-3">
//                             <InputField label="Full Address" required placeholder="Auto-filled from map or type manually" value={formData.fullAddress} onChange={set("fullAddress")} />
//                         </div>
//                         <InputField label="City" required placeholder="Auto-filled" value={formData.city} onChange={set("city")} />
//                         <InputField label="State" required placeholder="Auto-filled" value={formData.state} onChange={set("state")} />
//                         <InputField label="Pincode" required placeholder="Auto-filled" value={formData.pincode} onChange={set("pincode")} />
//                         <InputField label="Latitude" placeholder="Auto-filled" value={formData.latitude} onChange={set("latitude")} />
//                         <InputField label="Longitude" placeholder="Auto-filled" value={formData.longitude} onChange={set("longitude")} />
//                     </div>
//                 </div>
//             </Section>
//         </div>
//     );
// };

// export default PropertyFormBody;