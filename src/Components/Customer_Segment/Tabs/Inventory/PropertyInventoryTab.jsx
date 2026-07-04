import React, { useState, useEffect } from "react";
import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
import {
    useGetPropertyInventoryQuery,
    useGetMasterItemsQuery,
    useCreateOrUpdateInventoryMutation,
    useUpdateInventoryItemMutation,
    useDeleteInventoryItemMutation,
    useDeleteEntireInventoryMutation,
    useGetInventorySummaryQuery,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInventoryApi/customerInventoryApi";
import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";
import {
    Plus, Trash2, Pencil, Search, Loader2, RefreshCw, AlertCircle,
    Package, Layers, CheckCircle2, ChevronDown, X, ShieldAlert
} from "lucide-react";

const CONDITIONS = ["Excellent", "Good", "Minor Damage", "Major Damage"];

const CONDITION_BADGES = {
    "Excellent": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Good": "bg-blue-50 text-blue-700 border border-blue-200",
    "Minor Damage": "bg-amber-50 text-amber-700 border border-amber-200",
    "Major Damage": "bg-rose-50 text-rose-700 border border-rose-200",
};

const CATEGORY_BADGES = {
    "Furniture": "bg-slate-100 text-slate-700 border border-slate-200",
    "Appliance": "bg-purple-100 text-purple-700 border border-purple-200",
    "Key": "bg-indigo-100 text-indigo-700 border border-indigo-200",
    "Accessory": "bg-pink-100 text-pink-700 border border-pink-200",
    "Other": "bg-gray-100 text-gray-700 border border-gray-200"
};

const PropertyInventoryTab = () => {
    // Selection state
    const [selectedPropertyId, setSelectedPropertyId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch master resources
    const { data: propertiesData, isLoading: isLoadingProperties } = useGetPropertiesQuery({ limit: 100 });
    const { data: masterItems = [], isLoading: isLoadingMaster } = useGetMasterItemsQuery();
    const { data: summaryData, refetch: refetchSummary, isLoading: isLoadingSummary } = useGetInventorySummaryQuery();

    // Fetch property inventory
    const {
        data: inventoryData,
        isLoading: isLoadingInventory,
        isFetching: isFetchingInventory,
        refetch: refetchInventory,
    } = useGetPropertyInventoryQuery(selectedPropertyId, {
        skip: !selectedPropertyId,
    });

    // Mutations
    const [upsertInventory, { isLoading: isSaving }] = useCreateOrUpdateInventoryMutation();
    const [updateItem, { isLoading: isUpdatingItem }] = useUpdateInventoryItemMutation();
    const [deleteItem, { isLoading: isDeletingItem }] = useDeleteInventoryItemMutation();
    const [deleteEntireInventory, { isLoading: isDeletingEntire }] = useDeleteEntireInventoryMutation();

    // Modal Control States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

    // Form states for Setup/Update Inventory Modal
    const [newItems, setNewItems] = useState([
        { masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }
    ]);

    // Form states for Single Item Edit Modal
    const [editingItem, setEditingItem] = useState(null);

    // Helpers
    const properties = propertiesData?.data || [];
    const inventoryItems = inventoryData?.items || [];
    const inventoryId = inventoryData?._id;

    // Sync form state when setup modal opens
    useEffect(() => {
        if (isAddModalOpen) {
            if (inventoryItems.length > 0) {
                setNewItems(
                    inventoryItems.map(item => ({
                        masterItemId: item.masterItemId?._id || item.masterItemId,
                        totalQuantity: item.totalQuantity,
                        condition: item.condition || "Good",
                        remarks: item.remarks || ""
                    }))
                );
            } else {
                setNewItems([{ masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }]);
            }
        }
    }, [isAddModalOpen]);

    const handleRefresh = async () => {
        refetchSummary();
        if (selectedPropertyId) {
            refetchInventory();
        }
    };

    // Setup / Update Inventory Handlers
    const handleAddRow = () => {
        setNewItems([...newItems, { masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }]);
    };

    const handleRemoveRow = (index) => {
        const updated = [...newItems];
        updated.splice(index, 1);
        setNewItems(updated);
    };

    const handleRowChange = (index, field, value) => {
        const updated = [...newItems];
        updated[index] = { ...updated[index], [field]: value };
        setNewItems(updated);
    };

    const handleSaveInventory = async (e) => {
        e.preventDefault();
        if (!selectedPropertyId) {
            toast.error("Please select a property first.");
            return;
        }

        const validItems = newItems.filter(item => item.masterItemId);
        if (validItems.length === 0) {
            toast.error("Please select at least one master item.");
            return;
        }

        const itemsPayload = validItems.map(item => {
            const master = masterItems.find(m => m._id === item.masterItemId);
            return {
                masterItemId: item.masterItemId,
                name: master ? master.name : "Unknown",
                totalQuantity: Number(item.totalQuantity),
                availableQuantity: Number(item.totalQuantity),
                inUseQuantity: 0,
                condition: item.condition,
                remarks: item.remarks
            };
        });

        try {
            await upsertInventory({
                propertyId: selectedPropertyId,
                items: itemsPayload
            }).unwrap();
            toast.success("Inventory updated successfully!");
            setIsAddModalOpen(false);
            handleRefresh();
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to save inventory."));
        }
    };

    // Single Item Edit Handler
    const handleOpenEditItem = (item) => {
        setEditingItem({
            _id: item._id,
            masterItemId: item.masterItemId?._id || item.masterItemId,
            name: item.name,
            totalQuantity: item.totalQuantity,
            availableQuantity: item.availableQuantity,
            inUseQuantity: item.inUseQuantity || 0,
            condition: item.condition || "Good",
            remarks: item.remarks || ""
        });
        setIsEditModalOpen(true);
    };

    const handleSaveSingleItem = async (e) => {
        e.preventDefault();
        if (!inventoryId || !editingItem) return;

        const inUse = Number(editingItem.inUseQuantity);
        const total = Number(editingItem.totalQuantity);
        if (total < inUse) {
            toast.error(`Total quantity cannot be less than items currently in use (${inUse}).`);
            return;
        }
        const available = total - inUse;

        try {
            await updateItem({
                inventoryId,
                itemId: editingItem._id,
                propertyId: selectedPropertyId,
                totalQuantity: total,
                availableQuantity: available,
                condition: editingItem.condition,
                remarks: editingItem.remarks
            }).unwrap();
            toast.success("Inventory item updated successfully!");
            setIsEditModalOpen(false);
            handleRefresh();
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to update item."));
        }
    };

    // Single Item Delete Handler
    const handleDeleteSingleItem = async (itemId) => {
        if (!window.confirm("Are you sure you want to delete this item from the inventory?")) return;
        try {
            await deleteItem({
                inventoryId,
                itemId,
                propertyId: selectedPropertyId
            }).unwrap();
            toast.success("Item deleted successfully!");
            handleRefresh();
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to delete item."));
        }
    };

    // Delete Entire Inventory Handler
    const handleDeleteEntireInventory = async () => {
        try {
            await deleteEntireInventory(inventoryId).unwrap();
            toast.success("Entire inventory deleted successfully!");
            setIsDeleteAllModalOpen(false);
            handleRefresh();
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Failed to delete inventory."));
        }
    };

    // Filters
    const filteredItems = inventoryItems.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.masterItemId?.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Package className="w-6 h-6 text-blue-600" />
                        Property Inventory
                    </h2>
                    <p className="text-sm text-slate-500">Manage, allocate and monitor asset inventory for your list of properties.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleRefresh}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all duration-200"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-4 h-4 ${(isLoadingSummary || isFetchingInventory) ? "animate-spin" : ""}`} />
                    </button>
                    {selectedPropertyId && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Add Inventory
                        </button>
                    )}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Properties Setup</p>
                        <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                            {isLoadingSummary ? "..." : summaryData?.totalInventories ?? 0}
                        </h4>
                    </div>
                </div>
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Items Qty</p>
                        <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                            {isLoadingSummary ? "..." : summaryData?.totalItems ?? 0}
                        </h4>
                    </div>
                </div>
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Qty</p>
                        <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                            {isLoadingSummary ? "..." : summaryData?.totalAvailable ?? 0}
                        </h4>
                    </div>
                </div>
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In-Use Qty</p>
                        <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
                            {isLoadingSummary ? "..." : summaryData?.totalInUse ?? 0}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Selection and Filter bar */}
            {/* FIX: removed relative wrapper + custom ChevronDown icon from select — was causing double icon */}
            <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-md">
                    <label className="text-sm font-semibold text-slate-600 shrink-0">Select Property:</label>
                    <select
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        disabled={isLoadingProperties}
                        className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:opacity-50 transition-all"
                    >
                        <option value="">-- Choose Property --</option>
                        {properties.map((p) => (
                            <option key={p._id} value={p._id}>
                                {p.title} ({p.location?.city || "No City"})
                            </option>
                        ))}
                    </select>
                </div>

                {/* FIX: removed pl-10 padding shift issue — Search icon was stacking with browser's own input decoration */}
                {selectedPropertyId && (
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search inventory items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400 shadow-sm"
                        />
                    </div>
                )}
            </div>

            {/* Main inventory list */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {!selectedPropertyId ? (
                    <div className="text-center py-20 text-slate-400 space-y-4">
                        <Package className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
                        <div className="space-y-1">
                            <p className="text-base font-bold text-slate-600">No Property Selected</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">Please select a property from the dropdown above to view or update its master inventory list.</p>
                        </div>
                    </div>
                ) : isLoadingInventory ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="text-xs font-semibold">Loading property inventory...</span>
                    </div>
                ) : inventoryItems.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 space-y-4">
                        <Package className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
                        <div className="space-y-2">
                            <p className="text-base font-bold text-slate-600">No Inventory Allocated</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">This property doesn't have any items registered in its inventory yet.</p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 cursor-pointer shadow-sm transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Allocate Items Now
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-xs">
                                        <th className="px-5 py-4 text-left">Item Name</th>
                                        <th className="px-5 py-4 text-left">Category</th>
                                        <th className="px-5 py-4 text-center">Total Qty</th>
                                        <th className="px-5 py-4 text-center">Available Qty</th>
                                        <th className="px-5 py-4 text-center">In-Use Qty</th>
                                        <th className="px-5 py-4 text-left">Condition</th>
                                        <th className="px-5 py-4 text-left">Remarks</th>
                                        <th className="px-5 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">
                                                No items match your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredItems.map((item) => {
                                            const category = item.masterItemId?.category || "Other";
                                            return (
                                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-5 py-4 font-semibold text-slate-800">{item.name}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_BADGES[category] || CATEGORY_BADGES.Other}`}>
                                                            {category}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-center font-bold text-slate-700">{item.totalQuantity}</td>
                                                    <td className="px-5 py-4 text-center font-bold text-emerald-600">{item.availableQuantity}</td>
                                                    <td className="px-5 py-4 text-center font-bold text-amber-600">{item.inUseQuantity ?? 0}</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${CONDITION_BADGES[item.condition] || "bg-slate-100 text-slate-600"}`}>
                                                            {item.condition}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-slate-500 max-w-xs truncate" title={item.remarks}>
                                                        {item.remarks || "—"}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => handleOpenEditItem(item)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                                                                title="Edit Item"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteSingleItem(item._id)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                                                title="Delete Item"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer row */}
                        <div className="flex justify-between items-center px-5 py-4 border-t border-slate-100 bg-slate-50/40">
                            <span className="text-xs text-slate-400">
                                Total distinct items listed: {filteredItems.length}
                            </span>
                            <button
                                onClick={() => setIsDeleteAllModalOpen(true)}
                                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer py-1 px-2.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Entire Inventory
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* ── Add / Allocate Inventory Modal ── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
                    <div className="flex items-start justify-center min-h-screen p-4 md:p-8">
                        <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-3xl border border-slate-100 overflow-hidden mt-8">

                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Add / Allocate Inventory</h3>
                                    <p className="text-xs text-slate-400">Select master items and assign quantities to this property.</p>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleSaveInventory}>
                                <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">

                                    {/* Column headers — desktop only */}
                                    <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-[10px] font-bold text-slate-400 uppercase px-1 pb-1">
                                        <div className="col-span-5">Master Item</div>
                                        <div className="col-span-2 text-center">Qty</div>
                                        <div className="col-span-2">Condition</div>
                                        <div className="col-span-2">Remarks</div>
                                        <div className="col-span-1"></div>
                                    </div>

                                    {newItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50/60 border border-slate-100 rounded-2xl p-3"
                                        >
                                            {/* Item Selector — col-span-5, full width dropdown, no truncation */}
                                            <div className="sm:col-span-5">
                                                <label className="text-[10px] font-bold text-slate-400 block sm:hidden uppercase mb-1">Item:</label>
                                                <select
                                                    value={item.masterItemId}
                                                    onChange={(e) => handleRowChange(index, "masterItemId", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                                    required
                                                >
                                                    <option value="">-- Select Item --</option>
                                                    {masterItems
                                                        .filter(m => m.isActive)
                                                        .map(m => (
                                                            <option key={m._id} value={m._id}>
                                                                {m.name} ({m.category})
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            {/* Quantity */}
                                            <div className="sm:col-span-2">
                                                <label className="text-[10px] font-bold text-slate-400 block sm:hidden uppercase mb-1">Qty:</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.totalQuantity}
                                                    onChange={(e) => handleRowChange(index, "totalQuantity", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    required
                                                />
                                            </div>

                                            {/* Condition */}
                                            <div className="sm:col-span-2">
                                                <label className="text-[10px] font-bold text-slate-400 block sm:hidden uppercase mb-1">Condition:</label>
                                                <select
                                                    value={item.condition}
                                                    onChange={(e) => handleRowChange(index, "condition", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                                >
                                                    {CONDITIONS.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Remarks */}
                                            <div className="sm:col-span-2">
                                                <label className="text-[10px] font-bold text-slate-400 block sm:hidden uppercase mb-1">Remarks:</label>
                                                <input
                                                    type="text"
                                                    placeholder="Notes..."
                                                    value={item.remarks}
                                                    onChange={(e) => handleRowChange(index, "remarks", e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>

                                            {/* Remove row */}
                                            <div className="sm:col-span-1 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRow(index)}
                                                    disabled={newItems.length === 1}
                                                    className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                                    title="Remove row"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add row button */}
                                    <button
                                        type="button"
                                        onClick={handleAddRow}
                                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer border border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 hover:bg-blue-50/40 py-2.5 px-4 w-full rounded-xl justify-center transition-all mt-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Another Item Row
                                    </button>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Single Item Modal ── */}
            {isEditModalOpen && editingItem && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
                    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
                        <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50">
                                <div>
                                    <h3 className="text-lg font-bold text-blue-800">✏️ Edit Item: {editingItem.name}</h3>
                                    <p className="text-xs text-blue-500">Update quantity, condition, or remarks for this single item only.</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-1.5 rounded-xl hover:bg-blue-100 text-blue-400 hover:text-blue-700 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveSingleItem}>
                                <div className="p-6 space-y-4">
                                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5">
                                        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <div className="text-xs text-slate-500 leading-relaxed">
                                            Current items in use: <strong className="text-slate-700">{editingItem.inUseQuantity}</strong>.
                                            You cannot lower the total quantity below this count.
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Total Quantity:</label>
                                        <input
                                            type="number"
                                            min={editingItem.inUseQuantity}
                                            value={editingItem.totalQuantity}
                                            onChange={(e) => setEditingItem({ ...editingItem, totalQuantity: Number(e.target.value) })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 font-semibold"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Condition:</label>
                                        <select
                                            value={editingItem.condition}
                                            onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                                        >
                                            {CONDITIONS.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Remarks / Notes:</label>
                                        <textarea
                                            value={editingItem.remarks}
                                            onChange={(e) => setEditingItem({ ...editingItem, remarks: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
                                            placeholder="Write comments here..."
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdatingItem}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {isUpdatingItem ? "Saving..." : "Save Item"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Entire Inventory Modal ── */}
            {isDeleteAllModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">Delete Entire Inventory</h3>
                                    <p className="text-xs text-slate-400">This action is irreversible.</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                Are you sure you want to completely delete the inventory list for this property? All allocated items and their statuses will be removed.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsDeleteAllModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteEntireInventory}
                                    disabled={isDeletingEntire}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {isDeletingEntire ? "Deleting..." : "Delete All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyInventoryTab;

// import React, { useState, useEffect } from "react";
// import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
// import {
//     useGetPropertyInventoryQuery,
//     useGetMasterItemsQuery,
//     useCreateOrUpdateInventoryMutation,
//     useUpdateInventoryItemMutation,
//     useDeleteInventoryItemMutation,
//     useDeleteEntireInventoryMutation,
//     useGetInventorySummaryQuery,
// } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerInventoryApi/customerInventoryApi";
// import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";
// import {
//     Plus, Trash2, Pencil, Search, Loader2, RefreshCw, AlertCircle,
//     Package, Layers, CheckCircle2, ChevronDown, Check, X, ShieldAlert
// } from "lucide-react";

// const CONDITIONS = ["Excellent", "Good", "Minor Damage", "Major Damage"];

// const CONDITION_BADGES = {
//     "Excellent": "bg-emerald-50 text-emerald-700 border border-emerald-200",
//     "Good": "bg-blue-50 text-blue-700 border border-blue-200",
//     "Minor Damage": "bg-amber-50 text-amber-700 border border-amber-200",
//     "Major Damage": "bg-rose-50 text-rose-700 border border-rose-200",
// };

// const CATEGORY_BADGES = {
//     "Furniture": "bg-slate-100 text-slate-700 border border-slate-200",
//     "Appliance": "bg-purple-100 text-purple-700 border border-purple-200",
//     "Key": "bg-indigo-100 text-indigo-700 border border-indigo-200",
//     "Accessory": "bg-pink-100 text-pink-700 border border-pink-200",
//     "Other": "bg-gray-100 text-gray-700 border border-gray-200"
// };

// const PropertyInventoryTab = () => {
//     // Selection state
//     const [selectedPropertyId, setSelectedPropertyId] = useState("");
//     const [searchQuery, setSearchQuery] = useState("");

//     // Fetch master resources
//     const { data: propertiesData, isLoading: isLoadingProperties } = useGetPropertiesQuery({ limit: 100 });
//     const { data: masterItems = [], isLoading: isLoadingMaster } = useGetMasterItemsQuery();
//     const { data: summaryData, refetch: refetchSummary, isLoading: isLoadingSummary } = useGetInventorySummaryQuery();

//     // Fetch property inventory
//     const {
//         data: inventoryData,
//         isLoading: isLoadingInventory,
//         isFetching: isFetchingInventory,
//         refetch: refetchInventory,
//     } = useGetPropertyInventoryQuery(selectedPropertyId, {
//         skip: !selectedPropertyId,
//     });

//     // Mutations
//     const [upsertInventory, { isLoading: isSaving }] = useCreateOrUpdateInventoryMutation();
//     const [updateItem, { isLoading: isUpdatingItem }] = useUpdateInventoryItemMutation();
//     const [deleteItem, { isLoading: isDeletingItem }] = useDeleteInventoryItemMutation();
//     const [deleteEntireInventory, { isLoading: isDeletingEntire }] = useDeleteEntireInventoryMutation();

//     // Modal Control States
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

//     // Form states for Setup/Update Inventory Modal
//     const [newItems, setNewItems] = useState([
//         { masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }
//     ]);

//     // Form states for Single Item Edit Modal
//     const [editingItem, setEditingItem] = useState(null); // { _id, name, totalQuantity, availableQuantity, condition, remarks }

//     // Helpers
//     const properties = propertiesData?.data || [];
//     const inventoryItems = inventoryData?.items || [];
//     const inventoryId = inventoryData?._id;

//     // Sync form state when setup modal opens
//     useEffect(() => {
//         if (isAddModalOpen) {
//             if (inventoryItems.length > 0) {
//                 // Populate with existing items
//                 setNewItems(
//                     inventoryItems.map(item => ({
//                         masterItemId: item.masterItemId?._id || item.masterItemId,
//                         totalQuantity: item.totalQuantity,
//                         condition: item.condition || "Good",
//                         remarks: item.remarks || ""
//                     }))
//                 );
//             } else {
//                 // Pre-fill with a default empty row
//                 setNewItems([{ masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }]);
//             }
//         }
//     }, [isAddModalOpen]);

//     const handleRefresh = async () => {
//         refetchSummary();
//         if (selectedPropertyId) {
//             refetchInventory();
//         }
//     };

//     // Setup / Update Inventory Handlers
//     const handleAddRow = () => {
//         setNewItems([...newItems, { masterItemId: "", totalQuantity: 1, condition: "Good", remarks: "" }]);
//     };

//     const handleRemoveRow = (index) => {
//         const updated = [...newItems];
//         updated.splice(index, 1);
//         setNewItems(updated);
//     };

//     const handleRowChange = (index, field, value) => {
//         const updated = [...newItems];
//         updated[index] = { ...updated[index], [field]: value };
//         setNewItems(updated);
//     };

//     const handleSaveInventory = async (e) => {
//         e.preventDefault();
//         if (!selectedPropertyId) {
//             toast.error("Please select a property first.");
//             return;
//         }

//         // Validate entries
//         const validItems = newItems.filter(item => item.masterItemId);
//         if (validItems.length === 0) {
//             toast.error("Please select at least one master item.");
//             return;
//         }

//         // Construct payload with item name from master lookup
//         const itemsPayload = validItems.map(item => {
//             const master = masterItems.find(m => m._id === item.masterItemId);
//             return {
//                 masterItemId: item.masterItemId,
//                 name: master ? master.name : "Unknown",
//                 totalQuantity: Number(item.totalQuantity),
//                 availableQuantity: Number(item.totalQuantity), // Initially available matches total
//                 inUseQuantity: 0,
//                 condition: item.condition,
//                 remarks: item.remarks
//             };
//         });

//         try {
//             await upsertInventory({
//                 propertyId: selectedPropertyId,
//                 items: itemsPayload
//             }).unwrap();
//             toast.success("Inventory updated successfully!");
//             setIsAddModalOpen(false);
//             handleRefresh();
//         } catch (error) {
//             toast.error(getApiErrorMessage(error, "Failed to save inventory."));
//         }
//     };

//     // Single Item Edit Handler
//     const handleOpenEditItem = (item) => {
//         setEditingItem({
//             _id: item._id,
//             masterItemId: item.masterItemId?._id || item.masterItemId,
//             name: item.name,
//             totalQuantity: item.totalQuantity,
//             availableQuantity: item.availableQuantity,
//             inUseQuantity: item.inUseQuantity || 0,
//             condition: item.condition || "Good",
//             remarks: item.remarks || ""
//         });
//         setIsEditModalOpen(true);
//     };

//     const handleSaveSingleItem = async (e) => {
//         e.preventDefault();
//         if (!inventoryId || !editingItem) return;

//         // Calculate available qty based on new total and current in use
//         const inUse = Number(editingItem.inUseQuantity);
//         const total = Number(editingItem.totalQuantity);
//         if (total < inUse) {
//             toast.error(`Total quantity cannot be less than items currently in use (${inUse}).`);
//             return;
//         }
//         const available = total - inUse;

//         try {
//             await updateItem({
//                 inventoryId,
//                 itemId: editingItem._id,
//                 propertyId: selectedPropertyId, // required for invalidating tag
//                 totalQuantity: total,
//                 availableQuantity: available,
//                 condition: editingItem.condition,
//                 remarks: editingItem.remarks
//             }).unwrap();
//             toast.success("Inventory item updated successfully!");
//             setIsEditModalOpen(false);
//             handleRefresh();
//         } catch (error) {
//             toast.error(getApiErrorMessage(error, "Failed to update item."));
//         }
//     };

//     // Single Item Delete Handler
//     const handleDeleteSingleItem = async (itemId) => {
//         if (!window.confirm("Are you sure you want to delete this item from the inventory?")) return;
//         try {
//             await deleteItem({
//                 inventoryId,
//                 itemId,
//                 propertyId: selectedPropertyId // required for tag invalidation
//             }).unwrap();
//             toast.success("Item deleted successfully!");
//             handleRefresh();
//         } catch (error) {
//             toast.error(getApiErrorMessage(error, "Failed to delete item."));
//         }
//     };

//     // Delete Entire Inventory Handler
//     const handleDeleteEntireInventory = async () => {
//         try {
//             await deleteEntireInventory(inventoryId).unwrap();
//             toast.success("Entire inventory deleted successfully!");
//             setIsDeleteAllModalOpen(false);
//             handleRefresh();
//         } catch (error) {
//             toast.error(getApiErrorMessage(error, "Failed to delete inventory."));
//         }
//     };

//     // Filters
//     const filteredItems = inventoryItems.filter(item =>
//         item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (item.masterItemId?.category || "").toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="space-y-6">
//             {/* Header section */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
//                         <Package className="w-6 h-6 text-blue-600" />
//                         Property Inventory
//                     </h2>
//                     <p className="text-sm text-slate-500">Manage, allocate and monitor asset inventory for your list of properties.</p>
//                 </div>
//                 <div className="flex items-center gap-2 shrink-0">
//                     <button
//                         onClick={handleRefresh}
//                         className="p-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 cursor-pointer shadow-sm transition-all duration-200"
//                         title="Refresh Data"
//                     >
//                         <RefreshCw className={`w-4 h-4 ${(isLoadingSummary || isFetchingInventory) ? "animate-spin" : ""}`} />
//                     </button>
//                     {selectedPropertyId && (
//                         <button
//                             onClick={() => setIsAddModalOpen(true)}
//                             className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all duration-200"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Add Inventory
//                         </button>
//                     )}
//                 </div>
//             </div>

//             {/* Stats row */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
//                     <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//                         <Layers className="w-6 h-6" />
//                     </div>
//                     <div>
//                         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Properties Setup</p>
//                         <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
//                             {isLoadingSummary ? "..." : summaryData?.totalInventories ?? 0}
//                         </h4>
//                     </div>
//                 </div>

//                 <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
//                     <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//                         <Package className="w-6 h-6" />
//                     </div>
//                     <div>
//                         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Items Qty</p>
//                         <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
//                             {isLoadingSummary ? "..." : summaryData?.totalItems ?? 0}
//                         </h4>
//                     </div>
//                 </div>

//                 <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
//                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
//                         <CheckCircle2 className="w-6 h-6" />
//                     </div>
//                     <div>
//                         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Qty</p>
//                         <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
//                             {isLoadingSummary ? "..." : summaryData?.totalAvailable ?? 0}
//                         </h4>
//                     </div>
//                 </div>

//                 <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
//                     <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
//                         <AlertCircle className="w-6 h-6" />
//                     </div>
//                     <div>
//                         <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In-Use Qty</p>
//                         <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5">
//                             {isLoadingSummary ? "..." : summaryData?.totalInUse ?? 0}
//                         </h4>
//                     </div>
//                 </div>
//             </div>

//             {/* Selection and Filter bar */}
//             <div className="bg-white p-4 border border-slate-200 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
//                 <div className="flex items-center gap-3 flex-1 min-w-[280px] max-w-md">
//                     <label className="text-sm font-semibold text-slate-600 shrink-0">Select Property:</label>
//                     <div className="relative flex-1">
//                         <select
//                             value={selectedPropertyId}
//                             onChange={(e) => setSelectedPropertyId(e.target.value)}
//                             disabled={isLoadingProperties}
//                             className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 font-medium cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:opacity-50 transition-all appearance-none pr-10"
//                         >
//                             <option value="">-- Choose Property --</option>
//                             {properties.map((p) => (
//                                 <option key={p._id} value={p._id}>
//                                     {p.title} ({p.location?.city || "No City"})
//                                 </option>
//                             ))}
//                         </select>
//                         <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
//                     </div>
//                 </div>

//                 {selectedPropertyId && (
//                     <div className="relative flex-1 min-w-[200px] max-w-xs">
//                         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//                         <input
//                             type="text"
//                             placeholder="Search inventory items..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400 shadow-sm"
//                         />
//                     </div>
//                 )}
//             </div>

//             {/* Main inventory list */}
//             <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//                 {!selectedPropertyId ? (
//                     <div className="text-center py-20 text-slate-400 space-y-4">
//                         <Package className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
//                         <div className="space-y-1">
//                             <p className="text-base font-bold text-slate-600">No Property Selected</p>
//                             <p className="text-xs text-slate-400 max-w-sm mx-auto">Please select a property from the dropdown above to view or update its master inventory list.</p>
//                         </div>
//                     </div>
//                 ) : isLoadingInventory ? (
//                     <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
//                         <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//                         <span className="text-xs font-semibold">Loading property inventory...</span>
//                     </div>
//                 ) : inventoryItems.length === 0 ? (
//                     <div className="text-center py-20 text-slate-400 space-y-4">
//                         <Package className="w-12 h-12 mx-auto text-slate-300 stroke-[1.5]" />
//                         <div className="space-y-2">
//                             <p className="text-base font-bold text-slate-600">No Inventory Allocated</p>
//                             <p className="text-xs text-slate-400 max-w-sm mx-auto">This property doesn't have any items registered in its inventory yet.</p>
//                             <button
//                                 onClick={() => setIsAddModalOpen(true)}
//                                 className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 cursor-pointer shadow-sm transition-colors"
//                             >
//                                 <Plus className="w-3.5 h-3.5" />
//                                 Allocate Items Now
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                                 <thead>
//                                     <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold uppercase tracking-wider text-xs">
//                                         <th className="px-5 py-4 text-left">Item Name</th>
//                                         <th className="px-5 py-4 text-left">Category</th>
//                                         <th className="px-5 py-4 text-center">Total Qty</th>
//                                         <th className="px-5 py-4 text-center">Available Qty</th>
//                                         <th className="px-5 py-4 text-center">In-Use Qty</th>
//                                         <th className="px-5 py-4 text-left">Condition</th>
//                                         <th className="px-5 py-4 text-left">Remarks</th>
//                                         <th className="px-5 py-4 text-right">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-100">
//                                     {filteredItems.length === 0 ? (
//                                         <tr>
//                                             <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">
//                                                 No items match your search.
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         filteredItems.map((item) => {
//                                             const category = item.masterItemId?.category || "Other";
//                                             return (
//                                                 <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
//                                                     <td className="px-5 py-4 font-semibold text-slate-800">
//                                                         {item.name}
//                                                     </td>
//                                                     <td className="px-5 py-4">
//                                                         <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${CATEGORY_BADGES[category] || CATEGORY_BADGES.Other}`}>
//                                                             {category}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-5 py-4 text-center font-bold text-slate-700">
//                                                         {item.totalQuantity}
//                                                     </td>
//                                                     <td className="px-5 py-4 text-center font-bold text-emerald-600">
//                                                         {item.availableQuantity}
//                                                     </td>
//                                                     <td className="px-5 py-4 text-center font-bold text-amber-600">
//                                                         {item.inUseQuantity ?? 0}
//                                                     </td>
//                                                     <td className="px-5 py-4">
//                                                         <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${CONDITION_BADGES[item.condition] || "bg-slate-100 text-slate-600"}`}>
//                                                             {item.condition}
//                                                         </span>
//                                                     </td>
//                                                     <td className="px-5 py-4 text-slate-500 max-w-xs truncate" title={item.remarks}>
//                                                         {item.remarks || "—"}
//                                                     </td>
//                                                     <td className="px-5 py-4 text-right">
//                                                         <div className="flex items-center justify-end gap-1">
//                                                             <button
//                                                                 onClick={() => handleOpenEditItem(item)}
//                                                                 className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
//                                                                 title="Edit Item"
//                                                             >
//                                                                 <Pencil className="w-4 h-4" />
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => handleDeleteSingleItem(item._id)}
//                                                                 className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
//                                                                 title="Delete Item"
//                                                             >
//                                                                 <Trash2 className="w-4 h-4" />
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Footer row */}
//                         <div className="flex justify-between items-center px-5 py-4 border-t border-slate-100 bg-slate-50/40">
//                             <span className="text-xs text-slate-400">
//                                 Total distinct items listed: {filteredItems.length}
//                             </span>
//                             <button
//                                 onClick={() => setIsDeleteAllModalOpen(true)}
//                                 className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer py-1 px-2.5 rounded-lg hover:bg-red-50 transition-colors"
//                             >
//                                 <Trash2 className="w-3.5 h-3.5" />
//                                 Delete Entire Inventory
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Setup / Add Inventory Modal */}
//             {isAddModalOpen && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
//                     <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
//                         <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-4xl border border-slate-100 overflow-hidden transform transition-all">
//                             {/* Modal Header */}
//                             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
//                                 <div>
//                                     <h3 className="text-lg font-bold text-slate-800">
//                                         Add / Allocate Inventory
//                                     </h3>
//                                     <p className="text-xs text-slate-400">Select master items and assign quantities to this property.</p>
//                                 </div>
//                                 <button
//                                     onClick={() => setIsAddModalOpen(false)}
//                                     className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
//                                 >
//                                     <X className="w-5 h-5" />
//                                 </button>
//                             </div>

//                             {/* Modal Form */}
//                             <form onSubmit={handleSaveInventory}>
//                                 <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
//                                     <div className="hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-bold text-slate-400 uppercase px-2 mb-2">
//                                         <div className="col-span-5">Master Item Name</div>
//                                         <div className="col-span-2 text-center">Total Qty</div>
//                                         <div className="col-span-2">Initial Condition</div>
//                                         <div className="col-span-2">Remarks</div>
//                                         <div className="col-span-1 text-right">Remove</div>
//                                     </div>

//                                     {newItems.map((item, index) => (
//                                         <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border border-slate-100 sm:border-0 rounded-2xl p-4 sm:p-0">
//                                             {/* Item Selector */}
//                                             <div className="col-span-5">
//                                                 <label className="text-xs font-bold text-slate-400 block sm:hidden uppercase mb-1">Item:</label>
//                                                 <select
//                                                     value={item.masterItemId}
//                                                     onChange={(e) => handleRowChange(index, "masterItemId", e.target.value)}
//                                                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                                     required
//                                                 >
//                                                     <option value="">-- Select Master Item --</option>
//                                                     {masterItems
//                                                         .filter(m => m.isActive)
//                                                         .map(m => (
//                                                             <option key={m._id} value={m._id}>
//                                                                 {m.name} ({m.category})
//                                                             </option>
//                                                         ))
//                                                     }
//                                                 </select>
//                                             </div>

//                                             {/* Quantity */}
//                                             <div className="col-span-2 text-center">
//                                                 <label className="text-xs font-bold text-slate-400 block sm:hidden uppercase mb-1">Qty:</label>
//                                                 <input
//                                                     type="number"
//                                                     min="1"
//                                                     value={item.totalQuantity}
//                                                     onChange={(e) => handleRowChange(index, "totalQuantity", e.target.value)}
//                                                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                                     required
//                                                 />
//                                             </div>

//                                             {/* Condition */}
//                                             <div className="col-span-2">
//                                                 <label className="text-xs font-bold text-slate-400 block sm:hidden uppercase mb-1">Condition:</label>
//                                                 <select
//                                                     value={item.condition}
//                                                     onChange={(e) => handleRowChange(index, "condition", e.target.value)}
//                                                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                                 >
//                                                     {CONDITIONS.map(c => (
//                                                         <option key={c} value={c}>{c}</option>
//                                                     ))}
//                                                 </select>
//                                             </div>

//                                             {/* Remarks */}
//                                             <div className="col-span-2">
//                                                 <label className="text-xs font-bold text-slate-400 block sm:hidden uppercase mb-1">Remarks:</label>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Notes..."
//                                                     value={item.remarks}
//                                                     onChange={(e) => handleRowChange(index, "remarks", e.target.value)}
//                                                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                                 />
//                                             </div>

//                                             {/* Remove row button */}
//                                             <div className="col-span-1 text-right">
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => handleRemoveRow(index)}
//                                                     disabled={newItems.length === 1}
//                                                     className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
//                                                 >
//                                                     <Trash2 className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}

//                                     <button
//                                         type="button"
//                                         onClick={handleAddRow}
//                                         className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer border border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/20 py-2.5 px-4 w-full rounded-xl justify-center transition-all mt-4"
//                                     >
//                                         <Plus className="w-4 h-4" />
//                                         Add Another Item Row
//                                     </button>
//                                 </div>

//                                 {/* Modal Actions */}
//                                 <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsAddModalOpen(false)}
//                                         className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={isSaving}
//                                         className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
//                                     >
//                                         {isSaving ? "Saving..." : "Save Changes"}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Single Item Modal */}
//             {isEditModalOpen && editingItem && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
//                     <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
//                         <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all">
//                             <div className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-blue-50">
//                                 <div>
//                                     <h3 className="text-lg font-bold text-blue-800">✏️ Edit Item: {editingItem.name}</h3>
//                                     <p className="text-xs text-blue-500">Update quantity, condition, or remarks for this single item only.</p>
//                                 </div>
//                                 <button
//                                     onClick={() => setIsEditModalOpen(false)}
//                                     className="p-1.5 rounded-xl hover:bg-blue-100 text-blue-400 hover:text-blue-700 transition-colors"
//                                 >
//                                     <X className="w-5 h-5" />
//                                 </button>
//                             </div>

//                             <form onSubmit={handleSaveSingleItem}>
//                                 <div className="p-6 space-y-4">
//                                     {/* Info text */}
//                                     <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-2.5">
//                                         <AlertCircle className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
//                                         <div className="text-xs text-slate-500 leading-relaxed">
//                                             Current items in use: <strong className="text-slate-700">{editingItem.inUseQuantity}</strong>.
//                                             You cannot lower the total quantity below this count.
//                                         </div>
//                                     </div>

//                                     {/* Total Quantity */}
//                                     <div className="space-y-1">
//                                         <label className="text-xs font-bold text-slate-500 uppercase">Total Quantity:</label>
//                                         <input
//                                             type="number"
//                                             min={editingItem.inUseQuantity}
//                                             value={editingItem.totalQuantity}
//                                             onChange={(e) => setEditingItem({ ...editingItem, totalQuantity: Number(e.target.value) })}
//                                             className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-800 font-semibold"
//                                             required
//                                         />
//                                     </div>

//                                     {/* Condition */}
//                                     <div className="space-y-1">
//                                         <label className="text-xs font-bold text-slate-500 uppercase">Condition:</label>
//                                         <select
//                                             value={editingItem.condition}
//                                             onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
//                                             className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
//                                         >
//                                             {CONDITIONS.map(c => (
//                                                 <option key={c} value={c}>{c}</option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     {/* Remarks */}
//                                     <div className="space-y-1">
//                                         <label className="text-xs font-bold text-slate-500 uppercase">Remarks / Notes:</label>
//                                         <textarea
//                                             value={editingItem.remarks}
//                                             onChange={(e) => setEditingItem({ ...editingItem, remarks: e.target.value })}
//                                             rows={3}
//                                             className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 text-slate-700"
//                                             placeholder="Write comments here..."
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Modal Actions */}
//                                 <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
//                                     <button
//                                         type="button"
//                                         onClick={() => setIsEditModalOpen(false)}
//                                         className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         disabled={isUpdatingItem}
//                                         className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
//                                     >
//                                         {isUpdatingItem ? "Saving..." : "Save Item"}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Entire Inventory Confirmation Modal */}
//             {isDeleteAllModalOpen && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
//                     <div className="flex items-center justify-center min-h-screen p-4">
//                         <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all p-6">
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
//                                     <ShieldAlert className="w-6 h-6" />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg font-bold text-slate-800">Delete Entire Inventory</h3>
//                                     <p className="text-xs text-slate-400">This action is irreversible.</p>
//                                 </div>
//                             </div>
//                             <p className="text-sm text-slate-600 mb-6 leading-relaxed">
//                                 Are you sure you want to completely delete the inventory list for this property? All allocated items and their statuses will be removed.
//                             </p>
//                             <div className="flex items-center justify-end gap-3">
//                                 <button
//                                     onClick={() => setIsDeleteAllModalOpen(false)}
//                                     className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 bg-white hover:bg-slate-50 text-sm font-semibold cursor-pointer"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleDeleteEntireInventory}
//                                     disabled={isDeletingEntire}
//                                     className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm cursor-pointer disabled:opacity-50"
//                                 >
//                                     {isDeletingEntire ? "Deleting..." : "Delete All"}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PropertyInventoryTab;