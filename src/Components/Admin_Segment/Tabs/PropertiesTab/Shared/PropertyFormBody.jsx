import React, { useState, useRef } from "react";
import {
    Info, Building2, Zap, Waves, Camera, FileText, MapPin,
    ChevronUp, ChevronDown, Upload, X,
} from "lucide-react";
import LocationPicker from "./LocationPicker";

const inputCls = "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm";
const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

const Field = ({ label, required, children }) => (
    <div>
        <label className={labelCls}>{label} {required && <span className="text-red-500">*</span>}</label>
        {children}
    </div>
);

const SelectField = ({ label, required, value, onChange, options }) => (
    <Field label={label} required={required}>
        <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">Select</option>
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    </Field>
);

const InputField = ({ label, required, type = "text", placeholder, value, onChange }) => (
    <Field label={label} required={required}>
        <input className={inputCls} type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
);

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

// ✅ FIXED: ImageUpload component that handles both File objects and URL strings
const ImageUpload = ({ label, file, url, onFileChange, onRemove }) => {
    const inputRef = useRef(null);

    // Determine preview source
    const previewUrl = file instanceof File ? URL.createObjectURL(file) : (url || null);

    return (
        <div className="relative group">
            {previewUrl ? (
                <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
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
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e.target.files[0])} />
        </div>
    );
};

// Document Upload Component
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

const PropertyFormBody = ({ formData, onChange }) => {
    const set = (field) => (val) => onChange(field, val);
    const toggleCheck = (field, item) => {
        const current = formData[field] || [];
        onChange(field, current.includes(item) ? current.filter(x => x !== item) : [...current, item]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Basic Listing Info */}
            <Section icon={Info} title="Basic Listing Info" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SelectField label="Listing Type" required value={formData.listingType} onChange={set("listingType")} options={["For Sale", "For Rent", "BUY", "PG"]} />
                    <SelectField label="Property Type" required value={formData.propertyType} onChange={set("propertyType")} options={["Flat", "Villa", "Penthouse", "Studio Apartment", "Office Space", "Shop", "Warehouse"]} />
                    <SelectField label="Ownership Type" value={formData.ownershipType} onChange={set("ownershipType")} options={["Freehold", "Leasehold", "POA"]} />
                    <div className="md:col-span-3">
                        <InputField label="Listing Title" required placeholder="Enter property title" value={formData.title} onChange={set("title")} />
                    </div>
                    <div className="md:col-span-3">
                        <Field label="Description" required>
                            <textarea rows="4" className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-600 outline-none text-sm" value={formData.description} onChange={(e) => onChange("description", e.target.value)} />
                        </Field>
                    </div>
                </div>
            </Section>

            {/* 2. Property Details */}
            <Section icon={Building2} title="Property Details">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Condition" value={formData.condition} onChange={set("condition")} options={["Brand New", "Excellent", "Good", "Average"]} />
                        <SelectField label="Construction Status" value={formData.constructionStatus} onChange={set("constructionStatus")} options={["Ready to Move", "Under Construction"]} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Furnishing" value={formData.furnishing} onChange={set("furnishing")} options={["Unfurnished", "Semi-Furnished", "Fully Furnished"]} />
                        <SelectField label="Facing" value={formData.facing} onChange={set("facing")} options={["North", "South", "East", "West", "North-East", "North-West"]} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <InputField label="Area (sq ft)" type="number" value={formData.areaValue} onChange={set("areaValue")} />
                        <div className="col-span-2">
                            <InputField label="Price (₹)" required type="number" value={formData.price} onChange={set("price")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <InputField label="Bedrooms" type="number" value={formData.bedrooms} onChange={set("bedrooms")} />
                        <InputField label="Bathrooms" type="number" value={formData.bathrooms} onChange={set("bathrooms")} />
                        <InputField label="Floor No" type="number" value={formData.floorNo} onChange={set("floorNo")} />
                        <InputField label="Total Floors" type="number" value={formData.totalFloors} onChange={set("totalFloors")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Flooring Type" value={formData.flooringType} onChange={set("flooringType")} options={["Marble", "Granite", "Wooden Flooring"]} />
                        <InputField label="Maintenance (₹/mo)" type="number" value={formData.maintenance} onChange={set("maintenance")} />
                    </div>
                </div>
            </Section>

            {/* 3. Utilities & Parking */}
            <Section icon={Zap} title="Utilities & Parking">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField label="Water Supply" value={formData.waterSupply} onChange={set("waterSupply")} options={["Municipal Water", "Borewell", "Both"]} />
                        <SelectField label="Power Backup" value={formData.powerBackup} onChange={set("powerBackup")} options={["No Backup", "Full Backup"]} />
                    </div>
                    <SelectField label="Parking Type" value={formData.parkingType} onChange={set("parkingType")} options={["No Parking", "Open Parking", "Covered Parking", "Basement Parking"]} />
                    <div>
                        <label className={labelCls}>Security Features</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {["CCTV", "Security Guard", "Gated Community"].map(item => (
                                <CheckItem key={item} label={item} checked={formData.securityFeatures?.includes(item)} onChange={() => toggleCheck("securityFeatures", item)} />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 4. Amenities */}
            <Section icon={Waves} title="Amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["Lift", "Gym", "Swimming Pool", "Club House", "Park", "Kids Play Area", "Jogging Track", "Visitor Parking", "EV Charging", "Temple", "Sports Court"].map(item => (
                        <CheckItem key={item} label={item} checked={formData.amenities?.includes(item)} onChange={() => toggleCheck("amenities", item)} />
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
                    ].map(({ key, label }) => (
                        <ImageUpload
                            key={key}
                            label={label}
                            file={formData.images?.[key] instanceof File ? formData.images[key] : null}
                            url={typeof formData.images?.[key] === 'string' ? formData.images[key] : null}
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
                    {[
                        { key: "saleDeed", label: "Sale Deed", type: "Sale Deed", category: "ownership" },
                        { key: "reraCertificate", label: "RERA Certificate", type: "RERA Certificate", category: "approval" },
                        { key: "taxReceipt", label: "Tax Receipt", type: "Property Tax Receipt", category: "taxUtility" },
                        { key: "electricityBill", label: "Electricity Bill", type: "Electricity Bill", category: "taxUtility" },
                        { key: "occupancyCertificate", label: "Occupancy Certificate", type: "Occupancy Certificate", category: "approval" },
                        { key: "encumbrance", label: "Encumbrance Certificate", type: "Encumbrance Certificate", category: "legal" },
                    ].map(({ key, label, type, category }) => (
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
                            {["Near Metro", "Near Railway Station", "Near Airport", "Near Highway", "Near Bus Stand"].map(item => (
                                <CheckItem key={item} label={item} checked={formData.connectivity?.includes(item)} onChange={() => toggleCheck("connectivity", item)} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Nearby Facilities</label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                            {["School Nearby", "Hospital Nearby", "Market Nearby", "Mall Nearby", "Bank Nearby", "Park Nearby"].map(item => (
                                <CheckItem key={item} label={item} checked={formData.nearbyFacilities?.includes(item)} onChange={() => toggleCheck("nearbyFacilities", item)} />
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 8. Location Details */}
            <Section icon={MapPin} title="Location Details" fullWidth>
                <div className="space-y-5">
                    {/* Map Picker */}
                    <div>
                        <label className={labelCls}>Pick Location on Map</label>
                        <p className="text-xs text-slate-400 mb-2">Search for an address or click anywhere on the map — all fields below will auto-fill.</p>
                        <LocationPicker
                            onChange={({ lat, lng, fullAddress, city, state, pincode }) => {
                                set("latitude")(String(lat));
                                set("longitude")(String(lng));
                                if (fullAddress) set("fullAddress")(fullAddress);
                                if (city) set("city")(city);
                                if (state) set("state")(state);
                                if (pincode) set("pincode")(pincode);
                            }}
                        />
                    </div>

                    {/* Auto-filled fields (editable) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-3">
                            <InputField label="Full Address" required placeholder="Auto-filled from map or type manually" value={formData.fullAddress} onChange={set("fullAddress")} />
                        </div>
                        <InputField label="City" required placeholder="Auto-filled" value={formData.city} onChange={set("city")} />
                        <InputField label="State" required placeholder="Auto-filled" value={formData.state} onChange={set("state")} />
                        <InputField label="Pincode" required placeholder="Auto-filled" value={formData.pincode} onChange={set("pincode")} />
                        <InputField label="Latitude" placeholder="Auto-filled" value={formData.latitude} onChange={set("latitude")} />
                        <InputField label="Longitude" placeholder="Auto-filled" value={formData.longitude} onChange={set("longitude")} />
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default PropertyFormBody;


// // src/components/PropertyFormBody.jsx
// // Reusable form body — used in AddPropertyPage AND EditPropertyPage
// // Props:
// //   formData  — controlled state object
// //   onChange  — fn(field, value) called on every change
// //   mode      — "add" | "edit" (optional, for future conditional rendering)

// import React, { useState, useRef } from "react";
// import {
//     Info, Building2, Zap, Waves, Camera, FileText, MapPin,
//     ChevronUp, ChevronDown, Upload, X,
// } from "lucide-react";

// // ─── Reusable primitives ────────────────────────────────────────────────────

// const inputCls =
//     "w-full h-10 px-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-slate-800 bg-white transition-all";

// const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

// const Field = ({ label, required, children }) => (
//     <div>
//         <label className={labelCls}>
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         {children}
//     </div>
// );

// const SelectField = ({ label, required, value, onChange, options }) => (
//     <Field label={label} required={required}>
//         <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
//             {options.map((o) =>
//                 typeof o === "string" ? (
//                     <option key={o} value={o}>{o}</option>
//                 ) : (
//                     <option key={o.value} value={o.value}>{o.label}</option>
//                 )
//             )}
//         </select>
//     </Field>
// );

// const InputField = ({ label, required, type = "text", placeholder, value, onChange, min }) => (
//     <Field label={label} required={required}>
//         <input
//             className={inputCls}
//             type={type}
//             placeholder={placeholder}
//             value={value}
//             min={min}
//             onChange={(e) => onChange(e.target.value)}
//         />
//     </Field>
// );

// // ─── Collapsible Section ────────────────────────────────────────────────────

// const Section = ({ icon: Icon, title, defaultOpen = true, children, fullWidth = false }) => {
//     const [open, setOpen] = useState(defaultOpen);
//     return (
//         <div
//             className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm ${fullWidth ? "lg:col-span-2" : ""
//                 }`}
//         >
//             <button
//                 type="button"
//                 onClick={() => setOpen((v) => !v)}
//                 className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
//             >
//                 <div className="flex items-center gap-3">
//                     <Icon className="w-5 h-5 text-blue-600" />
//                     <span className="text-base font-semibold text-slate-800">{title}</span>
//                 </div>
//                 {open ? (
//                     <ChevronUp className="w-4 h-4 text-slate-400" />
//                 ) : (
//                     <ChevronDown className="w-4 h-4 text-slate-400" />
//                 )}
//             </button>
//             {open && <div className="p-6">{children}</div>}
//         </div>
//     );
// };

// // ─── Checkbox item ──────────────────────────────────────────────────────────

// const CheckItem = ({ label, checked, onChange }) => (
//     <label className="flex items-center gap-2.5 cursor-pointer group">
//         <input
//             type="checkbox"
//             checked={checked}
//             onChange={(e) => onChange(e.target.checked)}
//             className="w-4 h-4 rounded border-slate-300 text-blue-600 accent-blue-600 cursor-pointer"
//         />
//         <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{label}</span>
//     </label>
// );

// // ─── Image Upload Slot ──────────────────────────────────────────────────────

// const ImageSlot = ({ label, file, onFile }) => {
//     const ref = useRef();
//     const preview = file ? URL.createObjectURL(file) : null;
//     return (
//         <div className="relative group aspect-square">
//             {preview ? (
//                 <>
//                     <img src={preview} alt={label} className="w-full h-full object-cover rounded-lg border border-slate-200" />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
//                         <button
//                             type="button"
//                             onClick={() => onFile(null)}
//                             className="bg-red-500 text-white p-1.5 rounded-full"
//                         >
//                             <X className="w-3.5 h-3.5" />
//                         </button>
//                     </div>
//                 </>
//             ) : (
//                 <div
//                     onClick={() => ref.current?.click()}
//                     className="w-full h-full bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
//                 >
//                     <Camera className="w-5 h-5 text-slate-400 mb-1" />
//                     <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</span>
//                 </div>
//             )}
//             <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files[0])} />
//         </div>
//     );
// };

// // ─── Document Upload Card ───────────────────────────────────────────────────

// const DocCard = ({ label }) => (
//     <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
//         <div className="flex items-center justify-between mb-3">
//             <span className="text-sm font-medium text-slate-700">{label}</span>
//             <Upload className="w-4 h-4 text-blue-600" />
//         </div>
//         <button
//             type="button"
//             className="w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-semibold cursor-pointer"
//         >
//             Upload PDF
//         </button>
//     </div>
// );

// // ─── Main Form Body ─────────────────────────────────────────────────────────

// const PropertyFormBody = ({ formData, onChange }) => {
//     const set = (field) => (val) => onChange(field, val);
//     const toggleCheck = (field, item) => {
//         const current = formData[field] || [];
//         onChange(
//             field,
//             current.includes(item) ? current.filter((x) => x !== item) : [...current, item]
//         );
//     };

//     const [images, setImages] = useState({
//         exterior: null, livingRoom: null, kitchen: null, bedroom: null,
//     });

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//             {/* 1. Basic Listing Info */}
//             <Section icon={Info} title="Basic Listing Info" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <SelectField
//                         label="Listing Type" required
//                         value={formData.listingType}
//                         onChange={set("listingType")}
//                         options={["Select Type", "For Sale", "For Rent", "BUY", "PG"]}
//                     />
//                     <SelectField
//                         label="Property Type" required
//                         value={formData.propertyType}
//                         onChange={set("propertyType")}
//                         options={["Select Property", "Flat", "Builder Floor", "Independent House", "Villa", "Penthouse", "Farmhouse", "Studio Apartment", "Office Space", "Shop", "Showroom", "Warehouse", "Factory", "Co-working Space", "Residential Plot", "Commercial Plot", "Agricultural Land", "Industrial Land"]}
//                     />
//                     <SelectField
//                         label="Ownership Type"
//                         value={formData.ownershipType}
//                         onChange={set("ownershipType")}
//                         options={["Freehold", "Leasehold", "POA", "Co-operative Society"]}
//                     />
//                     <div className="md:col-span-3">
//                         <InputField
//                             label="Listing Title" required
//                             placeholder="E.g. Modern 3BHK Apartment in Sky Heights"
//                             value={formData.title}
//                             onChange={set("title")}
//                         />
//                     </div>
//                     <div className="md:col-span-3">
//                         <Field label="Property Description" required>
//                             <textarea
//                                 rows={4}
//                                 className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none text-sm text-slate-800 resize-none transition-all"
//                                 placeholder="Describe the key highlights, environment, and features..."
//                                 value={formData.description}
//                                 onChange={(e) => onChange("description", e.target.value)}
//                             />
//                         </Field>
//                     </div>
//                 </div>
//             </Section>

//             {/* 2. Property Details */}
//             <Section icon={Building2} title="Property Details">
//                 <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Condition" value={formData.condition} onChange={set("condition")}
//                             options={["Brand New", "Excellent", "Good", "Average", "Needs Renovation"]} />
//                         <SelectField label="Construction Status" value={formData.constructionStatus} onChange={set("constructionStatus")}
//                             options={["Ready to Move", "Under Construction"]} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Furnishing" value={formData.furnishing} onChange={set("furnishing")}
//                             options={["Unfurnished", "Semi-Furnished", "Fully Furnished"]} />
//                         <SelectField label="Facing" value={formData.facing} onChange={set("facing")}
//                             options={["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]} />
//                     </div>
//                     <div className="grid grid-cols-3 gap-4">
//                         <InputField label="Area (sq ft)" type="number" placeholder="0"
//                             value={formData.area} onChange={set("area")} />
//                         <div className="col-span-2">
//                             <InputField label="Price / Rent (₹)" required type="number" placeholder="E.g. 50,00,000"
//                                 value={formData.price} onChange={set("price")} />
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-4 gap-4">
//                         <InputField label="Bedrooms" type="number" min="0" value={formData.bedrooms} onChange={set("bedrooms")} />
//                         <InputField label="Bathrooms" type="number" min="0" value={formData.bathrooms} onChange={set("bathrooms")} />
//                         <InputField label="Floor No" type="number" min="0" value={formData.floorNo} onChange={set("floorNo")} />
//                         <InputField label="Total Floors" type="number" min="0" value={formData.totalFloors} onChange={set("totalFloors")} />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Flooring Type" value={formData.flooringType} onChange={set("flooringType")}
//                             options={["Marble", "Granite", "Wooden Flooring"]} />
//                         <InputField label="Maintenance (₹/mo)" type="number" min="0" value={formData.maintenance} onChange={set("maintenance")} />
//                     </div>
//                 </div>
//             </Section>

//             {/* 3. Utilities & Parking */}
//             <Section icon={Zap} title="Utilities & Parking">
//                 <div className="space-y-5">
//                     <div className="grid grid-cols-2 gap-4">
//                         <SelectField label="Water Supply" value={formData.waterSupply} onChange={set("waterSupply")}
//                             options={["Municipal Water", "Borewell", "Both"]} />
//                         <SelectField label="Power Backup" value={formData.powerBackup} onChange={set("powerBackup")}
//                             options={["No Backup", "Full Backup"]} />
//                     </div>
//                     <SelectField label="Parking Type" value={formData.parkingType} onChange={set("parkingType")}
//                         options={["No Parking", "Open Parking", "Covered Parking", "Basement Parking", "Stilt Parking"]} />
//                     <div>
//                         <label className={labelCls}>Security Features</label>
//                         <div className="grid grid-cols-2 gap-3 mt-1">
//                             {["CCTV", "Security Guard", "Gated Community"].map((item) => (
//                                 <CheckItem key={item} label={item}
//                                     checked={(formData.security || []).includes(item)}
//                                     onChange={() => toggleCheck("security", item)} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </Section>

//             {/* 4. Amenities */}
//             <Section icon={Waves} title="Amenities">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-2">
//                     {["Lift", "Gym", "Swimming Pool", "Club House", "Park", "Kids Play Area",
//                         "Jogging Track", "Community Hall", "Visitor Parking", "EV Charging",
//                         "Temple", "Sports Court"].map((item) => (
//                             <CheckItem key={item} label={item}
//                                 checked={(formData.amenities || []).includes(item)}
//                                 onChange={() => toggleCheck("amenities", item)} />
//                         ))}
//                 </div>
//             </Section>

//             {/* 5. Connectivity & Nearby */}
//             <Section icon={MapPin} title="Connectivity & Nearby">
//                 <div className="space-y-4">
//                     <div>
//                         <label className={labelCls}>Connectivity</label>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-2 mt-1">
//                             {["Near Metro", "Near Railway Station", "Near Airport", "Near Highway", "Near Bus Stand"].map((item) => (
//                                 <CheckItem key={item} label={item}
//                                     checked={(formData.connectivity || []).includes(item)}
//                                     onChange={() => toggleCheck("connectivity", item)} />
//                             ))}
//                         </div>
//                     </div>
//                     <div>
//                         <label className={labelCls}>Nearby Facilities</label>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-2 mt-1">
//                             {["School Nearby", "Hospital Nearby", "Market Nearby", "Mall Nearby", "Bank Nearby", "Park Nearby"].map((item) => (
//                                 <CheckItem key={item} label={item}
//                                     checked={(formData.nearbyFacilities || []).includes(item)}
//                                     onChange={() => toggleCheck("nearbyFacilities", item)} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </Section>

//             {/* 6. Media Uploads */}
//             <Section icon={Camera} title="Media Uploads" fullWidth>
//                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
//                     {Object.entries(images).map(([key, file]) => (
//                         <ImageSlot
//                             key={key}
//                             label={key.replace(/([A-Z])/g, " $1").trim()}
//                             file={file}
//                             onFile={(f) => setImages((prev) => ({ ...prev, [key]: f }))}
//                         />
//                     ))}
//                 </div>
//                 <p className="mt-4 text-xs text-slate-400">Supported formats: JPG, PNG. Max size 5MB per image.</p>
//             </Section>

//             {/* 7. Documents Upload */}
//             <Section icon={FileText} title="Documents Upload" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <DocCard label="Tax Receipt" />
//                     <DocCard label="Electricity Bill" />
//                     <DocCard label="RERA Certificate" />
//                 </div>
//             </Section>

//             {/* 8. Location Details */}
//             <Section icon={MapPin} title="Location Details" fullWidth>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div className="md:col-span-3">
//                         <InputField label="Full Address" required placeholder="House No, Street, Landmark"
//                             value={formData.address} onChange={set("address")} />
//                     </div>
//                     <InputField label="City" required placeholder="E.g. Mumbai"
//                         value={formData.city} onChange={set("city")} />
//                     <SelectField label="State" required value={formData.state} onChange={set("state")}
//                         options={["Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Jammu and Kashmir", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Maharashtra", "Meghalaya", "Manipur", "Madhya Pradesh", "Mizoram", "Nagaland", "Odisha", "Punjab", "Puducherry", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal"]} />
//                     <InputField label="Pincode" required placeholder="6-digit code"
//                         value={formData.pincode} onChange={set("pincode")} />
//                     <InputField label="Latitude" placeholder="E.g. 19.0760"
//                         value={formData.latitude} onChange={set("latitude")} />
//                     <InputField label="Longitude" placeholder="E.g. 72.8777"
//                         value={formData.longitude} onChange={set("longitude")} />

//                     {/* Map Placeholder */}
//                     <div className="md:col-span-3 mt-2 h-56 bg-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center">
//                         <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
//                         <div className="relative z-10 flex flex-col items-center text-slate-600">
//                             <MapPin className="w-8 h-8 mb-2" />
//                             <span className="font-semibold text-sm">Interactive Map Picker</span>
//                             <p className="text-xs opacity-70 mt-1">Click to set precise property location</p>
//                         </div>
//                     </div>
//                 </div>
//             </Section>

//         </div>
//     );
// };

// export default PropertyFormBody;