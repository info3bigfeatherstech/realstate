import React, { useState, useEffect } from "react";
import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
import {
    useGetTenantEntriesQuery,
    useCreateTenantEntryMutation,
    useGetTenantSummaryQuery,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/tenantEntryApi/tenantEntryApi";
import { useGetPropertyInventoryQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInventoryApi/customerInventoryApi";
import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";
const OCCUPANT_TYPES = ["Family", "Bachelor", "Student", "Working Professional"];
const CONDITIONS = ["Excellent", "Good", "Minor Damage", "Major Damage"];
const TenantEntryTab = () => {
    // List & Filter states
    const [search, setSearch] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("active");
    const [page, setPage] = useState(1);
    const limit = 10;
    const { data: propertiesData } = useGetPropertiesQuery({ limit: 100 });
    const { data: summaryData, refetch: refetchSummary } = useGetTenantSummaryQuery();
    const { data: entriesData, isLoading, refetch: refetchEntries } = useGetTenantEntriesQuery({
        page,
        limit,
        search: search || undefined,
        propertyId: propertyFilter || undefined,
        status: statusFilter || undefined,
    });
    const [createTenant, { isLoading: isSubmitting }] = useCreateTenantEntryMutation();
    // UI View states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);
    // FORM STATES
    const [tenantName, setTenantName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [occupantType, setOccupantType] = useState("Working Professional");
    const [propertyId, setPropertyId] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [bedNumber, setBedNumber] = useState("");
    const [agreementStartDate, setAgreementStartDate] = useState("");
    const [agreementEndDate, setAgreementEndDate] = useState("");
    const [monthlyRent, setMonthlyRent] = useState("");
    const [securityDeposit, setSecurityDeposit] = useState("");
    const [lockInPeriod, setLockInPeriod] = useState("");
    const [keys, setKeys] = useState({
        mainDoor: 0,
        room: 0,
        cupboard: 0,
        drawer: 0,
        accessCard: 0,
        parkingRemote: 0,
        other: "",
    });
    const [meters, setMeters] = useState({
        electricity: "",
        water: "",
        gas: "",
    });
    const [propertyCondition, setPropertyCondition] = useState({
        walls: "Good",
        floor: "Good",
        doors: "Good",
        windows: "Good",
        bathroom: "Good",
        kitchen: "Good",
    });
    const [remarks, setRemarks] = useState({
        existingDamage: "",
        missingItems: "",
    });
    const [tenantSignature, setTenantSignature] = useState("");
    const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split("T")[0]);
    // Dynamic property inventory selection
    const { data: propertyInventory } = useGetPropertyInventoryQuery(propertyId, {
        skip: !propertyId,
    });
    const [allocatedItems, setAllocatedItems] = useState({}); // { [itemId]: quantity }
    const [allocatedConditions, setAllocatedConditions] = useState({}); // { [itemId]: condition }
    // Photos
    const [roomPhotos, setRoomPhotos] = useState([]);
    const [furniturePhotos, setFurniturePhotos] = useState([]);
    const [appliancePhotos, setAppliancePhotos] = useState([]);
    const [meterPhotos, setMeterPhotos] = useState([]);
    // Reset allocated items when inventory changes
    useEffect(() => {
        if (propertyInventory?.items) {
            const initialAlloc = {};
            const initialCond = {};
            propertyInventory.items.forEach((item) => {
                initialAlloc[item._id] = 0;
                initialCond[item._id] = "Good";
            });
            setAllocatedItems(initialAlloc);
            setAllocatedConditions(initialCond);
        } else {
            setAllocatedItems({});
            setAllocatedConditions({});
        }
    }, [propertyInventory]);
    const handleKeyChange = (field, val) => {
        setKeys((prev) => ({ ...prev, [field]: val }));
    };
    const handleMeterChange = (field, val) => {
        setMeters((prev) => ({ ...prev, [field]: val }));
    };
    const handleConditionChange = (field, val) => {
        setPropertyCondition((prev) => ({ ...prev, [field]: val }));
    };
    const handleRemarksChange = (field, val) => {
        setRemarks((prev) => ({ ...prev, [field]: val }));
    };
    const handleAllocQuantityChange = (itemId, max, val) => {
        const num = Math.min(Math.max(Number(val) || 0, 0), max);
        setAllocatedItems((prev) => ({ ...prev, [itemId]: num }));
    };
    const handleAllocConditionChange = (itemId, val) => {
        setAllocatedConditions((prev) => ({ ...prev, [itemId]: val }));
    };
    // Form Submit Handler
    const handleSubmitCheckIn = async (e) => {
        e.preventDefault();
        if (!tenantName || !mobile || !propertyId || !agreementStartDate || !agreementEndDate || !monthlyRent || !securityDeposit) {
            toast.error("Please fill all required fields in the previous steps.");
            return;
        }
        const formData = new FormData();
        formData.append("tenantName", tenantName);
        formData.append("mobile", mobile);
        if (email) formData.append("email", email);
        formData.append("occupantType", occupantType);
        formData.append("propertyId", propertyId);
        if (roomNumber) formData.append("roomNumber", roomNumber);
        if (bedNumber) formData.append("bedNumber", bedNumber);
        formData.append("agreementStartDate", agreementStartDate);
        formData.append("agreementEndDate", agreementEndDate);
        formData.append("monthlyRent", monthlyRent);
        formData.append("securityDeposit", securityDeposit);
        if (lockInPeriod) formData.append("lockInPeriod", lockInPeriod);
        // Keys
        formData.append("keys[mainDoor][count]", keys.mainDoor);
        formData.append("keys[room][count]", keys.room);
        formData.append("keys[cupboard][count]", keys.cupboard);
        formData.append("keys[drawer][count]", keys.drawer);
        formData.append("keys[accessCard][count]", keys.accessCard);
        formData.append("keys[parkingRemote][count]", keys.parkingRemote);
        if (keys.other) formData.append("keys[other]", keys.other);
        // Meters
        if (meters.electricity) formData.append("meters[electricity]", meters.electricity);
        if (meters.water) formData.append("meters[water]", meters.water);
        if (meters.gas) formData.append("meters[gas]", meters.gas);
        // Allocated items
        let furnitureIdx = 0;
        let applianceIdx = 0;
        if (propertyInventory?.items) {
            propertyInventory.items.forEach((item) => {
                const qty = allocatedItems[item._id] || 0;
                if (qty > 0) {
                    const masterId = item.masterItemId?._id || item.masterItemId;
                    const cat = item.masterItemId?.category || "";
                    if (cat === "Furniture") {
                        formData.append(`furniture[${furnitureIdx}][inventoryItemId]`, masterId);
                        formData.append(`furniture[${furnitureIdx}][name]`, item.name);
                        formData.append(`furniture[${furnitureIdx}][quantity]`, qty);
                        formData.append(`furniture[${furnitureIdx}][condition]`, allocatedConditions[item._id] || "Good");
                        furnitureIdx++;
                    } else if (cat === "Appliance") {
                        formData.append(`appliances[${applianceIdx}][inventoryItemId]`, masterId);
                        formData.append(`appliances[${applianceIdx}][name]`, item.name);
                        formData.append(`appliances[${applianceIdx}][quantity]`, qty);
                        formData.append(`appliances[${applianceIdx}][condition]`, allocatedConditions[item._id] || "Good");
                        applianceIdx++;
                    }
                }
            });
        }
        // Property condition
        formData.append("propertyCondition[walls]", propertyCondition.walls);
        formData.append("propertyCondition[floor]", propertyCondition.floor);
        formData.append("propertyCondition[doors]", propertyCondition.doors);
        formData.append("propertyCondition[windows]", propertyCondition.windows);
        formData.append("propertyCondition[bathroom]", propertyCondition.bathroom);
        formData.append("propertyCondition[kitchen]", propertyCondition.kitchen);
        // Remarks
        if (remarks.existingDamage) formData.append("remarks[existingDamage]", remarks.existingDamage);
        if (remarks.missingItems) formData.append("remarks[missingItems]", remarks.missingItems);
        // Signatures
        if (tenantSignature) formData.append("tenantSignature", tenantSignature);
        formData.append("signatureDate", signatureDate);
        // Photos files
        roomPhotos.forEach((file) => formData.append("roomPhotos", file));
        furniturePhotos.forEach((file) => formData.append("furniturePhotos", file));
        appliancePhotos.forEach((file) => formData.append("appliancePhotos", file));
        meterPhotos.forEach((file) => formData.append("meterPhotos", file));
        try {
            await createTenant(formData).unwrap();
            toast.success("Tenant checked in successfully!");
            setIsCreateOpen(false);
            resetForm();
            refetchEntries();
            refetchSummary();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to create tenant check-in"));
        }
    };
    const resetForm = () => {
        setTenantName("");
        setMobile("");
        setEmail("");
        setPropertyId("");
        setRoomNumber("");
        setBedNumber("");
        setAgreementStartDate("");
        setAgreementEndDate("");
        setMonthlyRent("");
        setSecurityDeposit("");
        setLockInPeriod("");
        setKeys({ mainDoor: 0, room: 0, cupboard: 0, drawer: 0, accessCard: 0, parkingRemote: 0, other: "" });
        setMeters({ electricity: "", water: "", gas: "" });
        setPropertyCondition({ walls: "Good", floor: "Good", doors: "Good", windows: "Good", bathroom: "Good", kitchen: "Good" });
        setRemarks({ existingDamage: "", missingItems: "" });
        setTenantSignature("");
        setRoomPhotos([]);
        setFurniturePhotos([]);
        setAppliancePhotos([]);
        setMeterPhotos([]);
        setCurrentStep(1);
    };
    const properties = propertiesData?.data || [];
    const entries = entriesData?.data || [];
    const meta = entriesData?.meta || { page: 1, totalPages: 1, total: 0 };
    return (
        <div className="space-y-8">
            {/* Top Summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Checked-In</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">{summaryData?.totalTenants || 0}</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Active Tenants</span>
                        <span className="text-2xl font-black text-emerald-600 mt-1 block">{summaryData?.activeTenants || 0}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Monthly Rent</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">₹{summaryData?.totalMonthlyRent || 0}</span>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Security Deposits Held</span>
                        <span className="text-2xl font-black text-purple-600 mt-1 block">₹{summaryData?.totalSecurityDeposit || 0}</span>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                </div>
            </div>
            {/* List and Filters */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Tenant Records</h3>
                        <p className="text-sm text-slate-500 mt-1">Manage check-in agreements, checklists, and photo logs</p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start lg:self-center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        New Check-In
                    </button>
                </div>
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Name / Mobile</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Type tenant name, phone..."
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Property</label>
                        <select
                            value={propertyFilter}
                            onChange={(e) => { setPropertyFilter(e.target.value); setPage(1); }}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="">All Properties</option>
                            {properties.map((p) => (
                                <option key={p._id} value={p._id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lease Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="disputed">Disputed</option>
                        </select>
                    </div>
                </div>
                {/* List Table */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-semibold">No tenant check-in records found</p>
                    </div>
                ) : (
                    <div className="border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                                        <th className="py-4 px-6 font-semibold">Tenant ID / Name</th>
                                        <th className="py-4 px-6 font-semibold">Property / Space</th>
                                        <th className="py-4 px-6 font-semibold">Mobile</th>
                                        <th className="py-4 px-6 font-semibold">Rent</th>
                                        <th className="py-4 px-6 font-semibold">Lease Period</th>
                                        <th className="py-4 px-6 font-semibold">Status</th>
                                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entries.map((entry) => (
                                        <tr key={entry._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="font-semibold text-slate-800">{entry.tenantName}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{entry.tenantId}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-slate-700 font-medium">{entry.propertyId?.title || "Property"}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    Room: {entry.roomNumber || "-"} | Bed: {entry.bedNumber || "-"}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-600 font-medium">{entry.mobile}</td>
                                            <td className="py-4 px-6 font-bold text-slate-800">₹{entry.monthlyRent}</td>
                                            <td className="py-4 px-6 text-slate-500 font-medium">
                                                {new Date(entry.agreementStartDate).toLocaleDateString()} - {new Date(entry.agreementEndDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${entry.status === "active" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                        entry.status === "completed" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                            "bg-red-50 text-red-700 border border-red-100"
                                                    }`}>
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setSelectedEntry(entry)}
                                                    className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            {/* Check-In Multi-Step Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">Tenant Check-In (New Entry)</h4>
                                <span className="text-xs text-slate-400">Step {currentStep} of 5</span>
                            </div>
                            <button
                                onClick={() => { setIsCreateOpen(false); resetForm(); }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-slate-100">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(currentStep / 5) * 100}%` }} />
                        </div>
                        <form onSubmit={handleSubmitCheckIn} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                                {/* Step 1: Basic Info */}
                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider">Step 1: Tenant Information</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tenant Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={tenantName}
                                                    onChange={(e) => setTenantName(e.target.value)}
                                                    placeholder="Enter tenant's full name"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mobile Phone *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    placeholder="Enter mobile number"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter email (optional)"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Occupant Type *</label>
                                                <select
                                                    value={occupantType}
                                                    onChange={(e) => setOccupantType(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                                                >
                                                    {OCCUPANT_TYPES.map((o) => (
                                                        <option key={o} value={o}>{o}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Allocate Property *</label>
                                                <select
                                                    required
                                                    value={propertyId}
                                                    onChange={(e) => setPropertyId(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                                                >
                                                    <option value="">Select property...</option>
                                                    {properties.map((p) => (
                                                        <option key={p._id} value={p._id}>{p.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Room / Flat Number</label>
                                                <input
                                                    type="text"
                                                    value={roomNumber}
                                                    onChange={(e) => setRoomNumber(e.target.value)}
                                                    placeholder="e.g. 101"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bed Number</label>
                                                <input
                                                    type="text"
                                                    value={bedNumber}
                                                    onChange={(e) => setBedNumber(e.target.value)}
                                                    placeholder="e.g. B-1 (optional)"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Step 2: Lease Details */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider">Step 2: Agreement & Lease Details</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Agreement Start Date *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={agreementStartDate}
                                                    onChange={(e) => setAgreementStartDate(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Agreement End Date *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={agreementEndDate}
                                                    onChange={(e) => setAgreementEndDate(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Monthly Rent (INR) *</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={monthlyRent}
                                                    onChange={(e) => setMonthlyRent(e.target.value)}
                                                    placeholder="e.g. 15000"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Deposit (INR) *</label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={securityDeposit}
                                                    onChange={(e) => setSecurityDeposit(e.target.value)}
                                                    placeholder="e.g. 30000"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lock-In Period</label>
                                                <input
                                                    type="text"
                                                    value={lockInPeriod}
                                                    onChange={(e) => setLockInPeriod(e.target.value)}
                                                    placeholder="e.g. 11 Months"
                                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Step 3: Handover Checklist */}
                                {currentStep === 3 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider mb-4">Step 3: Keys Handed Over</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Main Door Keys</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={keys.mainDoor}
                                                        onChange={(e) => handleKeyChange("mainDoor", Number(e.target.value))}
                                                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Keys</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={keys.room}
                                                        onChange={(e) => handleKeyChange("room", Number(e.target.value))}
                                                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cupboard Keys</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={keys.cupboard}
                                                        onChange={(e) => handleKeyChange("cupboard", Number(e.target.value))}
                                                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Access Cards</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={keys.accessCard}
                                                        onChange={(e) => handleKeyChange("accessCard", Number(e.target.value))}
                                                        className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Parking Remote count</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={keys.parkingRemote}
                                                        onChange={(e) => handleKeyChange("parkingRemote", Number(e.target.value))}
                                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Other Keys Description</label>
                                                    <input
                                                        type="text"
                                                        value={keys.other}
                                                        onChange={(e) => handleKeyChange("other", e.target.value)}
                                                        placeholder="e.g. Mailbox, Balcony"
                                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider mb-4">Initial Utility Meter Readings</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Electricity Meter Reading</label>
                                                    <input
                                                        type="number"
                                                        value={meters.electricity}
                                                        onChange={(e) => handleMeterChange("electricity", e.target.value)}
                                                        placeholder="e.g. 1040"
                                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Water Meter Reading</label>
                                                    <input
                                                        type="number"
                                                        value={meters.water}
                                                        onChange={(e) => handleMeterChange("water", e.target.value)}
                                                        placeholder="e.g. 520"
                                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gas Meter Reading</label>
                                                    <input
                                                        type="number"
                                                        value={meters.gas}
                                                        onChange={(e) => handleMeterChange("gas", e.target.value)}
                                                        placeholder="e.g. 210"
                                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Step 4: Checklist & Status */}
                                {currentStep === 4 && (
                                    <div className="space-y-6">
                                        <div>
                                            <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider mb-3">Step 4: Property Structures Condition</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {Object.keys(propertyCondition).map((field) => (
                                                    <div key={field}>
                                                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{field} Condition</label>
                                                        <select
                                                            value={propertyCondition[field]}
                                                            onChange={(e) => handleConditionChange(field, e.target.value)}
                                                            className="w-full px-3 py-1.5 text-sm border rounded-xl cursor-pointer"
                                                        >
                                                            {CONDITIONS.map((c) => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider mb-3">Allocation of Property Inventory</h5>
                                            {!propertyId ? (
                                                <p className="text-slate-400 text-xs italic">Please select a property in Step 1 to load inventory items.</p>
                                            ) : !propertyInventory?.items || propertyInventory.items.length === 0 ? (
                                                <p className="text-slate-400 text-xs italic">No items set up in property inventory. Add items first or skip allocation.</p>
                                            ) : (
                                                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                                    <table className="w-full text-left border-collapse text-xs">
                                                        <thead>
                                                            <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase">
                                                                <th className="py-2.5 px-4 font-semibold">Item Name</th>
                                                                <th className="py-2.5 px-4 font-semibold">Available Qty</th>
                                                                <th className="py-2.5 px-4 font-semibold w-24">Assign Qty</th>
                                                                <th className="py-2.5 px-4 font-semibold w-36">Handover Condition</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {propertyInventory.items.map((item) => (
                                                                <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/30">
                                                                    <td className="py-2.5 px-4 font-semibold text-slate-800">{item.name}</td>
                                                                    <td className="py-2.5 px-4 text-slate-600 font-bold">{item.availableQuantity}</td>
                                                                    <td className="py-2.5 px-4">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            max={item.availableQuantity}
                                                                            value={allocatedItems[item._id] || 0}
                                                                            onChange={(e) => handleAllocQuantityChange(item._id, item.availableQuantity, e.target.value)}
                                                                            className="w-full px-2 py-1 text-xs border rounded-lg focus:outline-none"
                                                                        />
                                                                    </td>
                                                                    <td className="py-2.5 px-4">
                                                                        <select
                                                                            value={allocatedConditions[item._id] || "Good"}
                                                                            onChange={(e) => handleAllocConditionChange(item._id, e.target.value)}
                                                                            className="w-full px-2 py-1 text-xs border rounded-lg focus:outline-none cursor-pointer"
                                                                        >
                                                                            {CONDITIONS.map((c) => (
                                                                                <option key={c} value={c}>{c}</option>
                                                                            ))}
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Existing Damage Remarks</label>
                                                <input
                                                    type="text"
                                                    value={remarks.existingDamage}
                                                    onChange={(e) => handleRemarksChange("existingDamage", e.target.value)}
                                                    placeholder="Describe any existing damages..."
                                                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Missing Items Remarks</label>
                                                <input
                                                    type="text"
                                                    value={remarks.missingItems}
                                                    onChange={(e) => handleRemarksChange("missingItems", e.target.value)}
                                                    placeholder="Mention any missing checklist items..."
                                                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Step 5: Uploads & Signatures */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        <h5 className="font-bold text-slate-800 border-b pb-2 text-sm uppercase tracking-wider">Step 5: Photo Logs & Signatures</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Room Photos</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => setRoomPhotos(Array.from(e.target.files))}
                                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Furniture Photos</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => setFurniturePhotos(Array.from(e.target.files))}
                                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Appliance Photos</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => setAppliancePhotos(Array.from(e.target.files))}
                                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Meter Readings Photos</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) => setMeterPhotos(Array.from(e.target.files))}
                                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tenant Signature *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={tenantSignature}
                                                    onChange={(e) => setTenantSignature(e.target.value)}
                                                    placeholder="Type tenant name to sign..."
                                                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Signature Date *</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={signatureDate}
                                                    onChange={(e) => setSignatureDate(e.target.value)}
                                                    className="w-full px-3.5 py-2.5 text-sm border rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Footer */}
                            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
                                    disabled={currentStep === 1}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-30 cursor-pointer"
                                >
                                    Previous Step
                                </button>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { setIsCreateOpen(false); resetForm(); }}
                                        className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    {currentStep < 5 ? (
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep((s) => Math.min(s + 1, 5))}
                                            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer"
                                        >
                                            Next Step
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-500/10 cursor-pointer disabled:opacity-60"
                                        >
                                            {isSubmitting ? "Saving Check-In..." : "Complete Check-In"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Tenant Details Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{selectedEntry.tenantName}</h4>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{selectedEntry.tenantId}</span>
                            </div>
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-6 text-slate-700 text-sm overflow-y-auto flex-1">
                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Occupant Type</span>
                                    <span className="text-sm font-black block mt-0.5 text-slate-800">{selectedEntry.occupantType}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Monthly Rent</span>
                                    <span className="text-sm font-black block mt-0.5 text-slate-800">₹{selectedEntry.monthlyRent}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Security Deposit</span>
                                    <span className="text-sm font-black block mt-0.5 text-slate-800">₹{selectedEntry.securityDeposit}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Lease Status</span>
                                    <span className="text-sm font-black block mt-0.5 capitalize text-slate-800">{selectedEntry.status}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Tenant & Lease Information</h6>
                                    <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Property:</span> <span className="font-semibold text-slate-800">{selectedEntry.propertyId?.title || "Property"}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Space Details:</span> <span className="font-semibold text-slate-800">Room: {selectedEntry.roomNumber || "-"} | Bed: {selectedEntry.bedNumber || "-"}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Agreement Period:</span> <span className="font-semibold text-slate-800">{new Date(selectedEntry.agreementStartDate).toLocaleDateString()} - {new Date(selectedEntry.agreementEndDate).toLocaleDateString()}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Lock-In Period:</span> <span className="font-semibold text-slate-800">{selectedEntry.lockInPeriod || "-"}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Utility Readings & Keys</h6>
                                    <div className="space-y-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Meters:</span> <span className="font-semibold text-slate-800">Elec: {selectedEntry.meters?.electricity || "-"} | Water: {selectedEntry.meters?.water || "-"} | Gas: {selectedEntry.meters?.gas || "-"}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Keys Count:</span> <span className="font-semibold text-slate-800">Door: {selectedEntry.keys?.mainDoor?.count || 0} | Room: {selectedEntry.keys?.room?.count || 0} | Cup: {selectedEntry.keys?.cupboard?.count || 0}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Access Cards / Remote:</span> <span className="font-semibold text-slate-800">Cards: {selectedEntry.keys?.accessCard?.count || 0} | Remote: {selectedEntry.keys?.parkingRemote?.count || 0}</span></div>
                                        <div className="flex justify-between"><span className="text-xs text-slate-400">Other Keys:</span> <span className="font-semibold text-slate-800">{selectedEntry.keys?.other || "-"}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                <div>
                                    <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Property Condition</h6>
                                    <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Walls</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.walls || "Good"}</span></div>
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Floor</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.floor || "Good"}</span></div>
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Doors</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.doors || "Good"}</span></div>
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Windows</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.windows || "Good"}</span></div>
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Bathroom</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.bathroom || "Good"}</span></div>
                                        <div><span className="text-[10px] text-slate-400 uppercase font-bold block">Kitchen</span> <span className="font-semibold text-slate-700 text-xs">{selectedEntry.propertyCondition?.kitchen || "Good"}</span></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Remarks & Notes</h6>
                                    <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Existing Damages</span>
                                            <span className="font-semibold text-slate-700 text-xs block">{selectedEntry.remarks?.existingDamage || "None"}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Missing Items</span>
                                            <span className="font-semibold text-slate-700 text-xs block">{selectedEntry.remarks?.missingItems || "None"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                                <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400">Allocated Property Inventory</h6>
                                <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                                    <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 border-b text-slate-400 font-bold uppercase">
                                                <th className="py-2.5 px-4 font-semibold">Item Name</th>
                                                <th className="py-2.5 px-4 font-semibold">Qty</th>
                                                <th className="py-2.5 px-4 font-semibold">Check-In Condition</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Furniture */}
                                            {selectedEntry.furniture?.map((item, i) => (
                                                <tr key={`f-${i}`} className="border-b border-slate-50">
                                                    <td className="py-2 px-4 font-semibold text-slate-800">{item.name} <span className="text-[10px] text-slate-400">(Furniture)</span></td>
                                                    <td className="py-2 px-4 text-slate-600 font-bold">{item.quantity}</td>
                                                    <td className="py-2 px-4">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">{item.condition}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Appliances */}
                                            {selectedEntry.appliances?.map((item, i) => (
                                                <tr key={`a-${i}`} className="border-b border-slate-50">
                                                    <td className="py-2 px-4 font-semibold text-slate-800">{item.name} <span className="text-[10px] text-slate-400">(Appliance)</span></td>
                                                    <td className="py-2 px-4 text-slate-600 font-bold">{item.quantity}</td>
                                                    <td className="py-2 px-4">
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">{item.condition}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!selectedEntry.furniture?.length && !selectedEntry.appliances?.length) && (
                                                <tr>
                                                    <td colSpan="3" className="py-4 px-4 text-center text-slate-400 italic">No inventory allocated to this tenant check-in</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h6 className="font-bold text-xs uppercase tracking-wider text-slate-400">Photo Logs Logged</h6>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedEntry.roomPhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Room Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedEntry.roomPhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Room" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedEntry.furniturePhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Furniture Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedEntry.furniturePhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Furniture" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedEntry.appliancePhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Appliance Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedEntry.appliancePhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Appliance" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedEntry.meterPhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Meter Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedEntry.meterPhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Meters" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="text-xs text-slate-400 font-medium">
                                Checked-In: {new Date(selectedEntry.createdAt).toLocaleString()} | Signed by: {selectedEntry.tenantSignature || "Tenant"}
                            </div>
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default TenantEntryTab;