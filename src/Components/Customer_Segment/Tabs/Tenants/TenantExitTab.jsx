import React, { useState, useEffect } from "react";
import { useGetTenantEntriesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/tenantEntryApi/tenantEntryApi";
import {
    useGetTenantExitsQuery,
    useCreateTenantExitMutation,
    useGetEntryForAutoFillQuery,
    useGetTenantExitSummaryQuery,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/tenantExitApi/tenantExitApi";
import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
import { toast } from "../../../Shared/ToastConfig";

const EXIT_REASONS = ["Lease End", "Relocation", "Upgrade", "Personal Reasons", "Other"];
const HANDOVER_STATUSES = ["Completed Successfully", "Pending Verification", "Damage Dispute", "Deposit Hold"];

const TenantExitTab = () => {
    // List & Filters
    const [search, setSearch] = useState("");
    const [propertyFilter, setPropertyFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: propertiesData } = useGetPropertiesQuery({ limit: 100 });
    const { data: summaryData, refetch: refetchSummary } = useGetTenantExitSummaryQuery();
    const { data: exitsData, isLoading, refetch: refetchExits } = useGetTenantExitsQuery({
        page,
        limit,
        search: search || undefined,
        propertyId: propertyFilter || undefined,
        handoverStatus: statusFilter || undefined,
    });

    const [createExit, { isLoading: isSubmitting }] = useCreateTenantExitMutation();

    // UI Panel / Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedExit, setSelectedExit] = useState(null);

    // Active tenants for dropdown selection
    const { data: activeEntriesData } = useGetTenantEntriesQuery({ status: "active", limit: 100 });
    const activeEntries = activeEntriesData?.data || [];

    // Form fields
    const [entryId, setEntryId] = useState("");
    const [exitDate, setExitDate] = useState(new Date().toISOString().split("T")[0]);
    const [exitTime, setExitTime] = useState("11:00 AM");
    const [reasonForLeaving, setReasonForLeaving] = useState("Lease End");
    const [reasonOther, setReasonOther] = useState("");

    const [exitMeters, setExitMeters] = useState({
        electricity: "",
        water: "",
        gas: "",
    });

    const [charges, setCharges] = useState({
        pendingRent: 0,
        electricityCharges: 0,
        waterCharges: 0,
        maintenanceCharges: 0,
        damageCharges: 0,
        cleaningCharges: 0,
        otherCharges: 0,
    });

    const [missingItemsList, setMissingItemsList] = useState("");
    const [damageNotes, setDamageNotes] = useState("");
    const [handoverStatus, setHandoverStatus] = useState("Pending Verification");
    const [tenantSignature, setTenantSignature] = useState("");
    const [propertyManagerSignature, setPropertyManagerSignature] = useState("");
    const [handoverDate, setHandoverDate] = useState(new Date().toISOString().split("T")[0]);

    // Photos
    const [exitRoomPhotos, setExitRoomPhotos] = useState([]);
    const [exitDamagePhotos, setExitDamagePhotos] = useState([]);
    const [exitMeterPhotos, setExitMeterPhotos] = useState([]);

    // Query Check-in Details for Auto-Fill
    const { data: autoFillData } = useGetEntryForAutoFillQuery(entryId, {
        skip: !entryId,
    });

    // Handle single field charge updates
    const handleChargeChange = (field, val) => {
        setCharges((prev) => ({ ...prev, [field]: Math.max(Number(val) || 0, 0) }));
    };

    // Auto-filled security deposit values
    const originalDeposit = autoFillData?.securityDeposit || 0;

    // Derived calculations
    const totalDeductions = Object.values(charges).reduce((sum, curr) => sum + curr, 0);
    const finalRefund = Math.max(originalDeposit - totalDeductions, 0);

    const handleSubmitCheckOut = async (e) => {
        e.preventDefault();

        if (!entryId || !exitDate || !reasonForLeaving) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        formData.append("entryRecordId", entryId);
        formData.append("exitDate", exitDate);
        if (exitTime) formData.append("exitTime", exitTime);
        formData.append("reasonForLeaving", reasonForLeaving);
        if (reasonForLeaving === "Other" && reasonOther) formData.append("reasonOther", reasonOther);

        // Meters
        if (exitMeters.electricity) formData.append("exitMeters[electricity]", exitMeters.electricity);
        if (exitMeters.water) formData.append("exitMeters[water]", exitMeters.water);
        if (exitMeters.gas) formData.append("exitMeters[gas]", exitMeters.gas);

        // Charges
        formData.append("charges[pendingRent]", charges.pendingRent);
        formData.append("charges[electricityCharges]", charges.electricityCharges);
        formData.append("charges[waterCharges]", charges.waterCharges);
        formData.append("charges[maintenanceCharges]", charges.maintenanceCharges);
        formData.append("charges[damageCharges]", charges.damageCharges);
        formData.append("charges[cleaningCharges]", charges.cleaningCharges);
        formData.append("charges[otherCharges]", charges.otherCharges);
        formData.append("charges[totalDeductions]", totalDeductions);

        // Security Deposit Refund Maths
        formData.append("securityDeposit[depositAmount]", originalDeposit);
        formData.append("securityDeposit[amountDeducted]", totalDeductions);
        formData.append("securityDeposit[refundAmount]", finalRefund);

        if (missingItemsList) formData.append("missingItemsList", missingItemsList);
        if (damageNotes) formData.append("damageNotes", damageNotes);
        formData.append("handoverStatus", handoverStatus);

        if (tenantSignature) formData.append("tenantSignature", tenantSignature);
        if (propertyManagerSignature) formData.append("propertyManagerSignature", propertyManagerSignature);
        formData.append("handoverDate", handoverDate);

        // Photos files
        exitRoomPhotos.forEach((file) => formData.append("exitRoomPhotos", file));
        exitDamagePhotos.forEach((file) => formData.append("exitDamagePhotos", file));
        exitMeterPhotos.forEach((file) => formData.append("exitMeterPhotos", file));

        try {
            await createExit(formData).unwrap();
            toast.success("Tenant exit recorded successfully!");
            setIsCreateOpen(false);
            resetForm();
            refetchExits();
            refetchSummary();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to submit check-out");
        }
    };

    const resetForm = () => {
        setEntryId("");
        setExitDate(new Date().toISOString().split("T")[0]);
        setExitTime("11:00 AM");
        setReasonForLeaving("Lease End");
        setReasonOther("");
        setExitMeters({ electricity: "", water: "", gas: "" });
        setCharges({
            pendingRent: 0,
            electricityCharges: 0,
            waterCharges: 0,
            maintenanceCharges: 0,
            damageCharges: 0,
            cleaningCharges: 0,
            otherCharges: 0,
        });
        setMissingItemsList("");
        setDamageNotes("");
        setHandoverStatus("Pending Verification");
        setTenantSignature("");
        setPropertyManagerSignature("");
        setExitRoomPhotos([]);
        setExitDamagePhotos([]);
        setExitMeterPhotos([]);
    };

    const exits = exitsData?.data || [];
    const meta = exitsData?.meta || { page: 1, totalPages: 1, total: 0 };
    const properties = propertiesData?.data || [];

    return (
        <div className="space-y-8">
            {/* Top Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total checkouts</span>
                        <span className="text-2xl font-black text-slate-800 mt-1 block">{summaryData?.totalExits || 0}</span>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pending review</span>
                        <span className="text-2xl font-black text-amber-600 mt-1 block">{summaryData?.pendingExits || 0}</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Deductions collected</span>
                        <span className="text-2xl font-black text-red-600 mt-1 block">₹{summaryData?.totalDeductions || 0}</span>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Refunds disbursed</span>
                        <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{summaryData?.totalRefundAmount || 0}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* List area */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Tenant Exit Check-Out Logs</h3>
                        <p className="text-sm text-slate-500 mt-1">Review finalized deductions, safety refunds, and checkout reports</p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer self-start lg:self-center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16" />
                        </svg>
                        Initiate Checkout
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Tenant Name / Mobile</label>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Type tenant name, phone..."
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none"
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
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Handover Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            {HANDOVER_STATUSES.map((hs) => (
                                <option key={hs} value={hs}>{hs}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table list */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : exits.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-semibold">No tenant checkout records found</p>
                    </div>
                ) : (
                    <div className="border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                                        <th className="py-4 px-6 font-semibold">Tenant Name</th>
                                        <th className="py-4 px-6 font-semibold">Exit Date</th>
                                        <th className="py-4 px-6 font-semibold">Reason for leaving</th>
                                        <th className="py-4 px-6 font-semibold">Total Deductions</th>
                                        <th className="py-4 px-6 font-semibold">Refund Amount</th>
                                        <th className="py-4 px-6 font-semibold">Handover Status</th>
                                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exits.map((item) => (
                                        <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                            <td className="py-4 px-6 font-semibold text-slate-800">{item.tenantName}</td>
                                            <td className="py-4 px-6 text-slate-500 font-medium">{new Date(item.exitDate).toLocaleDateString()}</td>
                                            <td className="py-4 px-6 text-slate-600 font-medium">{item.reasonForLeaving}</td>
                                            <td className="py-4 px-6 font-bold text-red-600">₹{item.charges?.totalDeductions || 0}</td>
                                            <td className="py-4 px-6 font-bold text-emerald-600">₹{item.securityDeposit?.refundAmount || 0}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                                                    item.handoverStatus === "Completed Successfully" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                    item.handoverStatus === "Pending Verification" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                    item.handoverStatus === "Damage Dispute" ? "bg-red-50 text-red-700 border border-red-100" :
                                                    "bg-purple-50 text-purple-700 border border-purple-100"
                                                }`}>
                                                    {item.handoverStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setSelectedExit(item)}
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

            {/* Check-Out Form Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">Tenant Check-Out (Exit Form)</h4>
                                <span className="text-xs text-slate-400">Record deductions, verify readings, release deposit</span>
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

                        <form onSubmit={handleSubmitCheckOut} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
                                {/* Step 1: Select Tenant Entry */}
                                <div className="space-y-4">
                                    <h5 className="font-bold text-slate-900 border-b pb-2 text-xs uppercase tracking-wider">1. Select Active Tenant Check-In</h5>
                                    <div>
                                        <select
                                            required
                                            value={entryId}
                                            onChange={(e) => setEntryId(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
                                        >
                                            <option value="">Choose tenant...</option>
                                            {activeEntries.map((e) => (
                                                <option key={e._id} value={e._id}>{e.tenantName} - Room: {e.roomNumber || "-"} ({e.propertyId?.title || "Property"})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Auto-filled Basic details */}
                                    {autoFillData && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700">
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Phone Number</span>
                                                <span className="font-bold block text-slate-800">{autoFillData.mobile}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Agreement End Date</span>
                                                <span className="font-bold block text-slate-800">{new Date(autoFillData.agreementEndDate).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Security Deposit</span>
                                                <span className="font-bold block text-slate-800">₹{autoFillData.securityDeposit}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Monthly Rent</span>
                                                <span className="font-bold block text-slate-800">₹{autoFillData.monthlyRent}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Step 2: Exit Date and Reason */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Exit Date *</label>
                                        <input
                                            type="date"
                                            required
                                            value={exitDate}
                                            onChange={(e) => setExitDate(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Exit Time</label>
                                        <input
                                            type="text"
                                            value={exitTime}
                                            onChange={(e) => setExitTime(e.target.value)}
                                            placeholder="e.g. 11:00 AM"
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason for leaving *</label>
                                        <select
                                            value={reasonForLeaving}
                                            onChange={(e) => setReasonForLeaving(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl cursor-pointer"
                                        >
                                            {EXIT_REASONS.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {reasonForLeaving === "Other" && (
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Specify Other Reason</label>
                                            <input
                                                type="text"
                                                value={reasonOther}
                                                onChange={(e) => setReasonOther(e.target.value)}
                                                placeholder="Describe the reason for checkout..."
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Step 3: Exit Meter Readings */}
                                <div className="space-y-3 border-t pt-4">
                                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">2. Utility Meter Checkout Readings</h5>
                                    {autoFillData?.meters && (
                                        <div className="text-[11px] text-slate-400 font-medium">
                                            Original starting readings: Electricity ({autoFillData.meters.electricity || "-"}) | Water ({autoFillData.meters.water || "-"}) | Gas ({autoFillData.meters.gas || "-"})
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Exit Electricity reading</label>
                                            <input
                                                type="number"
                                                value={exitMeters.electricity}
                                                onChange={(e) => setExitMeters({ ...exitMeters, electricity: e.target.value })}
                                                placeholder="Ending reading..."
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Exit Water reading</label>
                                            <input
                                                type="number"
                                                value={exitMeters.water}
                                                onChange={(e) => setExitMeters({ ...exitMeters, water: e.target.value })}
                                                placeholder="Ending reading..."
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Exit Gas reading</label>
                                            <input
                                                type="number"
                                                value={exitMeters.gas}
                                                onChange={(e) => setExitMeters({ ...exitMeters, gas: e.target.value })}
                                                placeholder="Ending reading..."
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Charges / Deductions */}
                                <div className="space-y-4 border-t pt-4">
                                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">3. Exit Deductions & Penalties</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Rent</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.pendingRent}
                                                onChange={(e) => handleChargeChange("pendingRent", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Electricity Bills</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.electricityCharges}
                                                onChange={(e) => handleChargeChange("electricityCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Water Bills</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.waterCharges}
                                                onChange={(e) => handleChargeChange("waterCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Maintenance</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.maintenanceCharges}
                                                onChange={(e) => handleChargeChange("maintenanceCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Damage Charges</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.damageCharges}
                                                onChange={(e) => handleChargeChange("damageCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cleaning Fee</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.cleaningCharges}
                                                onChange={(e) => handleChargeChange("cleaningCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Other Penalties</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={charges.otherCharges}
                                                onChange={(e) => handleChargeChange("otherCharges", e.target.value)}
                                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 flex flex-col justify-center">
                                            <span className="text-[10px] text-red-500 font-bold uppercase">Total Deductions</span>
                                            <span className="text-base font-black text-red-700 block mt-0.5">₹{totalDeductions}</span>
                                        </div>
                                    </div>

                                    {/* Security deposit maths display */}
                                    {autoFillData && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                                            <div>
                                                <span className="text-xs text-slate-400 block font-medium">Security Deposit Held:</span>
                                                <span className="text-sm font-black text-slate-800">₹{originalDeposit}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-slate-400 block font-medium">Total Deductible:</span>
                                                <span className="text-sm font-black text-red-600">- ₹{totalDeductions}</span>
                                            </div>
                                            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                                                <span className="text-xs text-slate-400 block font-medium">Final Refund Amount:</span>
                                                <span className="text-base font-black text-emerald-600">₹{finalRefund}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Step 5: Remarks & Uploads */}
                                <div className="space-y-4 border-t pt-4">
                                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">4. Damages Checklist & Status</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Missing items checklist</label>
                                            <input
                                                type="text"
                                                value={missingItemsList}
                                                onChange={(e) => setMissingItemsList(e.target.value)}
                                                placeholder="e.g. 1 fan remote, 2 bathroom bulbs"
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Damage Description notes</label>
                                            <input
                                                type="text"
                                                value={damageNotes}
                                                onChange={(e) => setDamageNotes(e.target.value)}
                                                placeholder="e.g. Scratched living room wall paint"
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Checkout Status *</label>
                                            <select
                                                value={handoverStatus}
                                                onChange={(e) => setHandoverStatus(e.target.value)}
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl cursor-pointer"
                                            >
                                                {HANDOVER_STATUSES.map((hs) => (
                                                    <option key={hs} value={hs}>{hs}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Checkout Date</label>
                                            <input
                                                type="date"
                                                value={handoverDate}
                                                onChange={(e) => setHandoverDate(e.target.value)}
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Exit Room Photos</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setExitRoomPhotos(Array.from(e.target.files))}
                                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Damage Photos</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setExitDamagePhotos(Array.from(e.target.files))}
                                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Meter checkout photos</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setExitMeterPhotos(Array.from(e.target.files))}
                                                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tenant signature confirmation</label>
                                            <input
                                                type="text"
                                                value={tenantSignature}
                                                onChange={(e) => setTenantSignature(e.target.value)}
                                                placeholder="Type tenant name for exit authorization"
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Owner / Manager signature</label>
                                            <input
                                                type="text"
                                                value={propertyManagerSignature}
                                                onChange={(e) => setPropertyManagerSignature(e.target.value)}
                                                placeholder="Type manager name for exit authorization"
                                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => { setIsCreateOpen(false); resetForm(); }}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-60"
                                >
                                    {isSubmitting ? "Completing Checkout..." : "Finalize checkout"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {selectedExit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 overflow-hidden transform transition-all flex flex-col max-h-[85vh]">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">{selectedExit.tenantName} - Checkout Report</h4>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Exit Date: {new Date(selectedExit.exitDate).toLocaleDateString()}</span>
                            </div>
                            <button
                                onClick={() => setSelectedExit(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
                            {/* Summary cards for exit financials */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Handover Status</span>
                                    <span className="text-sm font-black block mt-0.5 text-slate-800">{selectedExit.handoverStatus}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Original Deposit</span>
                                    <span className="text-sm font-black block mt-0.5 text-slate-800">₹{selectedExit.securityDeposit?.depositAmount || 0}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Amount Deducted</span>
                                    <span className="text-sm font-black block mt-0.5 text-red-600">₹{selectedExit.securityDeposit?.amountDeducted || 0}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Amount Refunded</span>
                                    <span className="text-sm font-black block mt-0.5 text-emerald-600">₹{selectedExit.securityDeposit?.refundAmount || 0}</span>
                                </div>
                            </div>

                            {/* Main Details and Billing info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Details column */}
                                <div className="space-y-4">
                                    <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                                        <h6 className="font-bold text-slate-900 border-b pb-1.5">Checkout Parameters</h6>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Reason for leaving</span>
                                            <span className="font-bold text-slate-800">{selectedExit.reasonForLeaving}</span>
                                        </div>
                                        {selectedExit.reasonOther && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Other description</span>
                                                <span className="font-bold text-slate-800">{selectedExit.reasonOther}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Time of Exit</span>
                                            <span className="font-bold text-slate-800">{selectedExit.exitTime || "-"}</span>
                                        </div>
                                    </div>

                                    <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                                        <h6 className="font-bold text-slate-900 border-b pb-1.5">Checkout Meters</h6>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Electricity Reading</span>
                                            <span className="font-bold text-slate-800">{selectedExit.exitMeters?.electricity || "Not Recorded"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Water Reading</span>
                                            <span className="font-bold text-slate-800">{selectedExit.exitMeters?.water || "Not Recorded"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Gas Reading</span>
                                            <span className="font-bold text-slate-800">{selectedExit.exitMeters?.gas || "Not Recorded"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Billing column */}
                                <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-2">
                                    <h6 className="font-bold text-slate-900 border-b pb-1.5">Final Billing deductions</h6>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Pending Rent</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.pendingRent || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Electricity Charges</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.electricityCharges || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Water Charges</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.waterCharges || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Maintenance Charges</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.maintenanceCharges || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Damage Charges</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.damageCharges || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-xs py-1 border-b">
                                        <span className="text-slate-400">Cleaning Charges</span>
                                        <span className="font-semibold text-slate-800">₹{selectedExit.charges?.cleaningCharges || 0}</span>
                                    </div>
                                    {selectedExit.charges?.otherCharges > 0 && (
                                        <div className="flex justify-between text-xs py-1 border-b">
                                            <span className="text-slate-400">Other Charges</span>
                                            <span className="font-semibold text-slate-800">₹{selectedExit.charges.otherCharges}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs font-black pt-2 text-red-600">
                                        <span>Total deductions</span>
                                        <span>₹{selectedExit.charges?.totalDeductions || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Damage remarks and missing items */}
                            {(selectedExit.damageNotes || selectedExit.missingItemsList) && (
                                <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedExit.damageNotes && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1">Damage description</span>
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border">{selectedExit.damageNotes}</p>
                                        </div>
                                    )}
                                    {selectedExit.missingItemsList && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1">Missing items report</span>
                                            <p className="text-sm font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border">{selectedExit.missingItemsList}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Exit photos gallery */}
                            <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm space-y-4">
                                <h6 className="font-bold text-slate-900 border-b pb-2">Checkout Photo Logs</h6>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {selectedExit.exitRoomPhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Room Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedExit.exitRoomPhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Exit Room" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedExit.exitDamagePhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Damage Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedExit.exitDamagePhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Exit Damage" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedExit.exitMeterPhotos?.length > 0 && (
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 block mb-1.5 uppercase">Meter Photos</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedExit.exitMeterPhotos.map((photo, i) => (
                                                    <a key={i} href={photo.url} target="_blank" rel="noreferrer" className="block w-full h-16 rounded-lg overflow-hidden border">
                                                        <img src={photo.url} alt="Exit Meters" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                            <div className="text-xs text-slate-400 font-medium">
                                Checked-Out: {new Date(selectedExit.createdAt).toLocaleString()} | Signed by: {selectedExit.tenantSignature || "Tenant"} & {selectedExit.propertyManagerSignature || "Manager"}
                            </div>
                            <button
                                onClick={() => setSelectedExit(null)}
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

export default TenantExitTab;
