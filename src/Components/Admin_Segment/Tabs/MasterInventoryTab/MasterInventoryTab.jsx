import React, { useState, useMemo } from "react";
import {
    useGetInventoryItemsQuery,
    useCreateInventoryItemMutation,
    useUpdateInventoryItemMutation,
    useToggleInventoryItemStatusMutation,
    useDeleteInventoryItemMutation,
    useSeedDefaultInventoryItemsMutation,
} from "../../Admin_Redux/InventoryItemApi/inventoryItemApi";
import { useGetInventoryCategoriesQuery } from "../../Admin_Redux/InventoryCategoryApi/inventoryCategoryApi";
import CategoryManagerModal from "./Shared/CategoryManagerModal";
import { toast, getApiErrorMessage } from "../../../Shared/ToastConfig";

const MasterInventoryTab = () => {
    // Search and filters
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Queries & Mutations
    const { data: inventoryData, isLoading, refetch } = useGetInventoryItemsQuery({
        page,
        limit,
        search: search || undefined,
        category: categoryFilter || undefined,
        isActive: statusFilter === "" ? undefined : statusFilter === "active",
    });

    const { data: categoriesData } = useGetInventoryCategoriesQuery({ limit: 100 });
    const categoriesList = useMemo(() => categoriesData?.data || [], [categoriesData]);

    const [createItem, { isLoading: isCreating }] = useCreateInventoryItemMutation();
    const [updateItem, { isLoading: isUpdating }] = useUpdateInventoryItemMutation();
    const [toggleStatus] = useToggleInventoryItemStatusMutation();
    const [deleteItem] = useDeleteInventoryItemMutation();
    const [seedDefaults, { isLoading: isSeeding }] = useSeedDefaultInventoryItemsMutation();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemName, setItemName] = useState("");
    const [itemCategory, setItemCategory] = useState("");

    // Set first category _id as default when list loads
    React.useEffect(() => {
        if (categoriesList.length > 0 && !editingItem && !itemCategory) {
            setItemCategory(categoriesList[0]._id);
        }
    }, [categoriesList, editingItem, itemCategory]);

    // Handlers
    const handleOpenCreateModal = () => {
        setEditingItem(null);
        setItemName("");
        setItemCategory(categoriesList[0]?._id || "");
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item) => {
        setEditingItem(item);
        setItemName(item.name);
        // item.category may be populated object or string id
        setItemCategory(item.categoryId?._id || item.categoryId || item.category?._id || "");
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!itemName.trim()) {
            toast.error("Please enter item name");
            return;
        }

        try {
            if (editingItem) {
                await updateItem({
                    id: editingItem._id,
                    name: itemName,
                    categoryId: itemCategory,
                }).unwrap();
                toast.success("Inventory item updated successfully");
            } else {
                await createItem({
                    name: itemName,
                    categoryId: itemCategory,
                }).unwrap();
                toast.success("Inventory item created successfully");
            }
            setIsModalOpen(false);
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to save item"));
        }
    };

    const handleToggleStatus = async (item) => {
        try {
            await toggleStatus({
                id: item._id,
                isActive: !item.isActive,
            }).unwrap();
            toast.success(`Item ${item.isActive ? "deactivated" : "activated"} successfully`);
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to toggle status"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inventory item?")) return;
        try {
            await deleteItem(id).unwrap();
            toast.success("Item deleted successfully");
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to delete item"));
        }
    };

    const handleSeed = async () => {
        try {
            await seedDefaults().unwrap();
            toast.success("Default inventory items seeded successfully!");
            refetch();
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Failed to seed default items"));
        }
    };

    const items = inventoryData?.data || [];
    const meta = inventoryData?.meta || { page: 1, totalPages: 1, total: 0 };

    return (
        <div className="p-6">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Master Inventory Items</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage global inventory items list available for properties</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.884 2.223v6.34a2.25 2.25 0 002.25 2.25h15.75a2.25 2.25 0 002.25-2.25v-6.34a2.25 2.25 0 00-1.884-2.223m-16.5 0c.23-.034.47-.052.714-.052h14.88c.245 0 .484.018.714.052m-16.5 0V7.5A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5v2.276M9 14.25h6M9 17.25h3" />
                        </svg>
                        Manage Categories
                    </button>
                    {/* <button
                        onClick={handleSeed}
                        disabled={isSeeding}
                        className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-55"
                    >
                        <svg className={`w-4 h-4 ${isSeeding ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                        </svg>
                        {isSeeding ? "Seeding..." : "Seed Defaults"}
                    </button> */}
                    <button
                        onClick={handleOpenCreateModal}
                        className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Item
                    </button>
                </div>
            </div>

            {/* Filter section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search Name</label>
                    <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Search item name..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categoriesList.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Table or loader */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-9 h-9 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    <p className="text-slate-500 font-medium">No items found</p>
                    <p className="text-slate-400 text-xs mt-1">Try tweaking filters or seed the default list.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50">
                                    <th className="py-4 px-6 font-semibold">Name</th>
                                    <th className="py-4 px-6 font-semibold">Category</th>
                                    <th className="py-4 px-6 font-semibold">Status</th>
                                    <th className="py-4 px-6 font-semibold">Created By</th>
                                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-slate-800">{item.name}</td>
                                        <td className="py-4 px-6">
                                            {(() => {
                                                const catName =
                                                    item.categoryId?.name ||
                                                    item.category?.name ||
                                                    (typeof item.category === "string" ? item.category : "") ||
                                                    "—";
                                                const colorClass =
                                                    catName === "Furniture" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                    catName === "Appliance" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                                                    catName === "Key" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                    catName === "Accessory" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                                                    "bg-slate-100 text-slate-700";
                                                return (
                                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${colorClass}`}>
                                                        {catName}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleToggleStatus(item)}
                                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.isActive ? "bg-emerald-500" : "bg-slate-200"}`}
                                            >
                                                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.isActive ? "translate-x-5" : "translate-x-0"}`} />
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-slate-500 font-medium">{item.createdBy?.name || "System"}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <button
                                                    onClick={() => handleOpenEditModal(item)}
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Item"
                                                >
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Item"
                                                >
                                                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                            <span className="text-xs text-slate-500 font-medium">Page {page} of {meta.totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                                    disabled={page === meta.totalPages}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="text-lg font-bold text-slate-900">{editingItem ? "Edit Inventory Item" : "Add Inventory Item"}</h4>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="p-6 space-y-4.5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Name</label>
                                    <input
                                        type="text"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                        placeholder="e.g. Double Bed, Split AC..."
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
                                    <select
                                        value={itemCategory}
                                        onChange={(e) => setItemCategory(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
                                    >
                                        {categoriesList.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/10 transition-all disabled:opacity-60 cursor-pointer"
                                >
                                    {isCreating || isUpdating ? "Saving..." : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Manager Modal */}
            {isCategoryModalOpen && (
                <CategoryManagerModal
                    onClose={() => setIsCategoryModalOpen(false)}
                    onCategoriesUpdated={refetch}
                />
            )}
        </div>
    );
};

export default MasterInventoryTab;
