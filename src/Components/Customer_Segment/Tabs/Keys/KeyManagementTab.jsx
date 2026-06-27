import React, { useState, useMemo } from "react";
import {
  Key,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  History,
  User,
  Share2,
  CheckCircle,
  AlertTriangle,
  Trash2,
  Calendar,
  FileText,
  Filter,
  ArrowRight,
  UserCheck,
  MapPin,
} from "lucide-react";
import { useGetPropertiesQuery } from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
import {
  useGetKeysQuery,
  useGetKeySummaryQuery,
  useCreateKeyMutation,
  useMoveKeyMutation,
  useReturnKeyMutation,
  useUpdateKeyStatusMutation,
  useDeleteKeyMutation,
  useGetKeyHistoryQuery,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/customerKeysApi/customerKeysApi";
const KEY_TYPES = [
  "Room",
  "Main Entrance",
  "Locker",
  "Maintenance",
  "Mailbox",
  "Other",
];
const STATUS_OPTIONS = [
  {
    value: "returned",
    label: "Returned / Available",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "with_person",
    label: "In Circulation",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "lost",
    label: "Lost",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    value: "damaged",
    label: "Damaged",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
];
const KeyManagementTab = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // Active Key states for modals const [activeKeyForMove, setActiveKeyForMove] = useState(null); const [activeKeyForReturn, setActiveKeyForReturn] = useState(null); const [activeKeyForHistory, setActiveKeyForHistory] = useState(null); const [showCreateModal, setShowCreateModal] = useState(false); const [keyToDelete, setKeyToDelete] = useState(null); // Queries const { data: propertiesData, isLoading: isPropertiesLoading } = useGetPropertiesQuery({ limit: 100 }); const propertiesList = useMemo(() => propertiesData?.data || [], [propertiesData]); const { data: summaryData, isLoading: isSummaryLoading, refetch: refetchSummary } = useGetKeySummaryQuery(); const queryParams = { page, limit, ...(selectedPropertyId && { propertyId: selectedPropertyId }), ...(searchQuery && { search: searchQuery }) }; const { data: keysData, isLoading: isKeysLoading, isFetching: isKeysFetching, refetch: refetchKeys } = useGetKeysQuery(queryParams); const keysList = useMemo(() => keysData?.data || [], [keysData]); const keysMeta = useMemo(() => keysData?.meta || { page: 1, limit: 8, total: 0, totalPages: 1 }, [keysData]); // Mutations const [createKey, { isLoading: isCreating }] = useCreateKeyMutation(); const [moveKey, { isLoading: isMoving }] = useMoveKeyMutation(); const [returnKey, { isLoading: isReturning }] = useReturnKeyMutation(); const [updateKeyStatus, { isLoading: isUpdatingStatus }] = useUpdateKeyStatusMutation(); const [deleteKey, { isLoading: isDeleting }] = useDeleteKeyMutation(); // Create Form State const [createForm, setCreateForm] = useState({ propertyId: "", keyType: "Room", keyIdentifier: "", keyDescription: "", totalKeys: 1, currentHolderType: "owner", currentHolderName: "", currentHolderMobile: "" }); // Move Form State const [moveForm, setMoveForm] = useState({ toPersonType: "tenant", toPersonName: "", toPersonMobile: "", expectedReturnDate: "", notes: "" }); // Return Form State const [returnForm, setReturnForm] = useState({ returnedToName: "", returnNotes: "" }); // Handlers const handleRefresh = () => { refetchSummary(); refetchKeys(); }; const handleCreateSubmit = async (e) => { e.preventDefault(); if (!createForm.propertyId || !createForm.keyIdentifier) return; try { await createKey(createForm).unwrap(); setShowCreateModal(false); // Reset form setCreateForm({ propertyId: "", keyType: "Room", keyIdentifier: "", keyDescription: "", totalKeys: 1, currentHolderType: "owner", currentHolderName: "", currentHolderMobile: "" }); handleRefresh(); } catch (err) { console.error("Failed to create key:", err); } }; const handleMoveSubmit = async (e) => { e.preventDefault(); if (!activeKeyForMove || !moveForm.toPersonName) return; try { await moveKey({ id: activeKeyForMove._id, keyId: activeKeyForMove._id, ...moveForm }).unwrap(); setActiveKeyForMove(null); setMoveForm({ toPersonType: "tenant", toPersonName: "", toPersonMobile: "", expectedReturnDate: "", notes: "" }); handleRefresh(); } catch (err) { console.error("Failed to transfer key:", err); } }; const handleReturnSubmit = async (e) => { e.preventDefault(); if (!activeKeyForReturn || !returnForm.returnedToName) return; try { await returnKey({ id: activeKeyForReturn._id, keyId: activeKeyForReturn._id, ...returnForm }).unwrap(); setActiveKeyForReturn(null); setReturnForm({ returnedToName: "", returnNotes: "" }); handleRefresh(); } catch (err) { console.error("Failed to return key:", err); } }; const handleStatusChange = async (keyId, newStatus) => { try { await updateKeyStatus({ id: keyId, status: newStatus }).unwrap(); handleRefresh(); } catch (err) { console.error("Failed to update status:", err); } }; const handleDeleteSubmit = async () => { if (!keyToDelete) return; try { await deleteKey(keyToDelete).unwrap(); setKeyToDelete(null); handleRefresh(); } catch (err) { console.error("Failed to delete key:", err); } }; return ( <div className="p-6 space-y-6 max-w-7xl mx-auto "> {/* Header */} <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> <div> <h2 className="text-xl font-bold text-slate-800">Key Management Inventory</h2> <p className="text-sm text-slate-500 mt-1"> Track ownership, check handovers, and monitor physical key custody logs across your properties. </p> </div> <div className="flex items-center gap-3"> <button onClick={handleRefresh} className="flex items-center justify-center p-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer shadow-sm transition-all" title="Refresh list" > <RefreshCw className={`w-4 h-4 ${(isSummaryLoading || isKeysFetching) ? "animate-spin" : ""}`} /> </button> <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all" > <Plus className="w-4 h-4" /> Register Key </button> </div> </div> {/* Summary Cards */} {isSummaryLoading ? ( <div className="grid grid-cols-2 md:grid-cols-5 gap-4"> {[...Array(5)].map((_, i) => ( <div key={i} className="h-20 bg-slate-50 animate-pulse border border-slate-100 rounded-2xl" /> ))} </div> ) : ( <div className="grid grid-cols-2 md:grid-cols-5 gap-4"> <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex items-center gap-3.5"> <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Key className="w-5 h-5" /></div> <div> <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Keys</div> <div className="text-lg font-bold text-slate-800 mt-0.5">{summaryData?.totalKeys ?? 0}</div> </div> </div> <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex items-center gap-3.5"> <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><UserCheck className="w-5 h-5" /></div> <div> <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">In Circulation</div> <div className="text-lg font-bold text-slate-800 mt-0.5">{summaryData?.withPerson ?? 0}</div> </div> </div> <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex items-center gap-3.5"> <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="w-5 h-5" /></div> <div> <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Returned / Avail.</div> <div className="text-lg font-bold text-slate-800 mt-0.5">{summaryData?.returned ?? 0}</div> </div> </div> <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex items-center gap-3.5"> <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div> <div> <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lost Keys</div> <div className="text-lg font-bold text-slate-800 mt-0.5">{summaryData?.lost ?? 0}</div> </div> </div> <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex items-center gap-3.5"> <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl"><AlertTriangle className="w-5 h-5" /></div> <div> <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Damaged Keys</div> <div className="text-lg font-bold text-slate-800 mt-0.5">{summaryData?.damaged ?? 0}</div> </div> </div> </div> )} {/* Filter and Search Bar */} <div className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-150 rounded-2xl p-4 shadow-sm"> <div className="relative flex-1 w-full"> <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> <input type="text" placeholder="Search by key identifier, holder info..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white" /> </div> <div className="flex items-center gap-3 w-full md:w-auto"> <Filter className="w-4 h-4 text-slate-400 shrink-0" /> <select value={selectedPropertyId} onChange={(e) => setSelectedPropertyId(e.target.value)} className="w-full md:w-60 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer font-medium" > <option value="">All Properties</option> {propertiesList.map((p) => ( <option key={p._id} value={p._id}> {p.title} </option> ))} </select> </div> </div> {/* Keys Inventory list */} {isKeysLoading ? ( <div className="flex items-center justify-center py-20 bg-white border border-slate-150 rounded-2xl shadow-sm"> <Loader2 className="w-8 h-8 text-blue-600 animate-spin" /> </div> ) : keysList.length === 0 ? ( <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50"> <Key className="w-12 h-12 text-slate-300 mb-2" /> <p className="text-sm font-semibold text-slate-500">No registered keys found</p> <p className="text-xs text-slate-400 mt-1">Register a new key to track status and custody</p> </div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"> {keysList.map((item) => { const currentStatus = STATUS_OPTIONS.find((s) => s.value === item.status) || STATUS_OPTIONS[0]; const isCirculating = item.status === "with_person"; return ( <div key={item._id} className="bg-white border border-slate-150 hover:border-slate-300 rounded-2xl p-4.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4" > {/* Identifier & Type */} <div className="space-y-1"> <div className="flex items-start justify-between"> <span className="font-bold text-slate-800 text-sm">{item.keyIdentifier}</span> <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider ${currentStatus.color}`}> {item.status.replace("_", " ")} </span> </div> <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium"> <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold"> {item.keyType} </span> <span>• {item.totalKeys} {item.totalKeys > 1 ? "copies" : "copy"}</span> </div> <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mt-1"> <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" /> <span className="truncate">{item.propertyId?.title || "Unknown Property"}</span> </div> </div> {/* Custody Info */} <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1.5"> <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Current Custody</div> {isCirculating ? ( <div className="space-y-1 text-xs"> <div className="flex items-center gap-1.5 font-bold text-slate-700"> <User className="w-3.5 h-3.5 text-slate-400" /> <span>{item.currentHolderName || "Unknown"}</span> <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-bold uppercase"> {item.currentHolderType} </span> </div> {item.currentHolderMobile && ( <div className="text-slate-500 font-medium text-[11px] pl-5"> Phone: {item.currentHolderMobile} </div> )} {item.expectedReturnDate && ( <div className="text-slate-500 font-medium text-[11px] pl-5 flex items-center gap-1 text-amber-700"> <Calendar className="w-3 h-3 text-amber-500" /> <span>Due: {new Date(item.expectedReturnDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span> </div> )} </div> ) : ( <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium py-0.5"> <CheckCircle className="w-4 h-4 text-emerald-500" /> <span>Returned / Available</span> </div> )} </div> {/* Status Toggle & Action Controls */} <div className="space-y-2.5"> {/* Status update select */} <div className="flex items-center justify-between gap-2 text-xs border-t border-slate-100 pt-3"> <span className="text-slate-400 font-semibold">Change Status:</span> <select value={item.status} disabled={isUpdatingStatus} onChange={(e) => handleStatusChange(item._id, e.target.value)} className="px-2 py-1 text-[11px] border border-slate-200 rounded-lg text-slate-700 bg-white font-medium focus:outline-none focus:border-blue-400 cursor-pointer" > {STATUS_OPTIONS.map((opt) => ( <option key={opt.value} value={opt.value}> {opt.label.split(" / ")[0]} </option> ))} </select> </div> {/* Actions buttons */} <div className="flex items-center gap-2 border-t border-slate-100 pt-3"> {isCirculating ? ( <button onClick={() => { setActiveKeyForReturn(item); setReturnForm({ returnedToName: item.propertyId?.createdBy?.fullName || "Owner", returnNotes: "" }); }} className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-center font-bold py-1.5 rounded-lg text-[11px] cursor-pointer transition-all" > Return Key </button> ) : ( <button onClick={() => setActiveKeyForMove(item)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 text-center font-bold py-1.5 rounded-lg text-[11px] cursor-pointer transition-all" > Move (Give) </button> )} <button onClick={() => setActiveKeyForHistory(item)} className="p-1.5 border border-slate-200 hover:border-slate-300 text-slate-500 rounded-lg hover:bg-slate-50 cursor-pointer transition-all" title="Movement History" > <History className="w-3.5 h-3.5" /> </button> <button onClick={() => setKeyToDelete(item._id)} className="p-1.5 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition-all" title="Delete Key" > <Trash2 className="w-3.5 h-3.5" /> </button> </div> </div> </div> ); })} </div> )} {/* Pagination */} {keysMeta.totalPages > 1 && ( <div className="flex flex-wrap items-center justify-between border-t border-slate-150 bg-white p-4.5 rounded-2xl shadow-sm gap-4"> <div className="text-xs text-slate-500 font-medium"> Showing {(keysMeta.page - 1) * keysMeta.limit + 1}– {Math.min(keysMeta.page * keysMeta.limit, keysMeta.total)} of {keysMeta.total} keys </div> <div className="flex items-center gap-1.5"> <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer" > <ChevronLeft className="w-4 h-4" /> </button> <span className="text-xs font-bold text-slate-700 px-2"> Page {page} of {keysMeta.totalPages} </span> <button onClick={() => setPage((p) => Math.min(keysMeta.totalPages, p + 1))} disabled={page === keysMeta.totalPages} className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer" > <ChevronRight className="w-4 h-4" /> </button> </div> </div> )} {/* MODAL 1: REGISTER NEW KEY */} {showCreateModal && ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"> <h3 className="text-lg font-bold text-slate-800 mb-1">Register Key</h3> <p className="text-xs text-slate-400 font-medium mb-5">Create a physical key registry record in inventory</p> <form onSubmit={handleCreateSubmit} className="space-y-4"> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Associated Property</label> <select required value={createForm.propertyId} onChange={(e) => setCreateForm({ ...createForm, propertyId: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100" > <option value="" disabled>Select Property...</option> {propertiesList.map((p) => ( <option key={p._id} value={p._id}>{p.title}</option> ))} </select> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Key Type</label> <select value={createForm.keyType} onChange={(e) => setCreateForm({ ...createForm, keyType: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100" > {KEY_TYPES.map((t) => ( <option key={t} value={t}>{t}</option> ))} </select> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Total Copies</label> <input type="number" min="1" required value={createForm.totalKeys} onChange={(e) => setCreateForm({ ...createForm, totalKeys: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Key Identifier</label> <input type="text" required placeholder="e.g. Room 102 Master Key" value={createForm.keyIdentifier} onChange={(e) => setCreateForm({ ...createForm, keyIdentifier: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Key Description</label> <textarea placeholder="Optional details, cupboard details, locker description..." value={createForm.keyDescription} onChange={(e) => setCreateForm({ ...createForm, keyDescription: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 h-16 resize-none" /> </div> {/* Initial Custody fields */} <div className="border-t border-slate-100 pt-4 space-y-3"> <span className="block text-xs font-bold text-slate-700">Initial Custody</span> <div className="grid grid-cols-3 gap-3"> <div> <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">Holder Type</label> <select value={createForm.currentHolderType} onChange={(e) => setCreateForm({ ...createForm, currentHolderType: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white" > <option value="owner">Owner</option> <option value="agent">Agent</option> <option value="tenant">Tenant</option> </select> </div> <div className="col-span-2"> <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">Holder Full Name</label> <input type="text" placeholder="Owner" value={createForm.currentHolderName} onChange={(e) => setCreateForm({ ...createForm, currentHolderName: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> </div> <div> <label className="block text-[9px] font-bold text-slate-400 mb-1 uppercase">Holder Mobile Number</label> <input type="text" placeholder="e.g. +91 98765 43210" value={createForm.currentHolderMobile} onChange={(e) => setCreateForm({ ...createForm, currentHolderMobile: e.target.value })} className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> </div> <div className="flex gap-3 justify-end pt-4 border-t border-slate-100"> <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer" > Cancel </button> <button type="submit" disabled={isCreating} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50" > {isCreating ? "Registering..." : "Create Registry"} </button> </div> </form> </div> </div> )} {/* MODAL 2: MOVE / HANDOVER KEY */} {activeKeyForMove && ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"> <h3 className="text-lg font-bold text-slate-800 mb-1">Hand Over Key</h3> <p className="text-xs text-slate-400 font-medium mb-5"> Record hand-over of key <b>{activeKeyForMove.keyIdentifier}</b> to another person </p> <form onSubmit={handleMoveSubmit} className="space-y-4"> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Recipient Type</label> <select value={moveForm.toPersonType} onChange={(e) => setMoveForm({ ...moveForm, toPersonType: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100" > <option value="tenant">Tenant</option> <option value="owner">Owner</option> <option value="agent">Agent / Broker</option> <option value="maintenance">Maintenance Staff</option> <option value="other">Other / Guest</option> </select> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Recipient Name</label> <input type="text" required placeholder="e.g. Rahul Sharma" value={moveForm.toPersonName} onChange={(e) => setMoveForm({ ...moveForm, toPersonName: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Recipient Phone Number</label> <input type="text" placeholder="e.g. +919876543211" value={moveForm.toPersonMobile} onChange={(e) => setMoveForm({ ...moveForm, toPersonMobile: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Expected Return Date</label> <input type="date" value={moveForm.expectedReturnDate} onChange={(e) => setMoveForm({ ...moveForm, expectedReturnDate: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Movement Notes</label> <textarea placeholder="Reason, specific rooms access details..." value={moveForm.notes} onChange={(e) => setMoveForm({ ...moveForm, notes: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 h-16 resize-none" /> </div> <div className="flex gap-3 justify-end pt-4 border-t border-slate-100"> <button type="button" onClick={() => setActiveKeyForMove(null)} className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer" > Cancel </button> <button type="submit" disabled={isMoving} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50" > {isMoving ? "Transferring..." : "Confirm Handover"} </button> </div> </form> </div> </div> )} {/* MODAL 3: RETURN KEY */} {activeKeyForReturn && ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"> <h3 className="text-lg font-bold text-slate-800 mb-1">Return Key to Inventory</h3> <p className="text-xs text-slate-400 font-medium mb-5"> Record custody return of key <b>{activeKeyForReturn.keyIdentifier}</b> </p> <form onSubmit={handleReturnSubmit} className="space-y-4"> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Returned To (Recipient Name)</label> <input type="text" required placeholder="e.g. Vikas Owner" value={returnForm.returnedToName} onChange={(e) => setReturnForm({ ...returnForm, returnedToName: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" /> </div> <div> <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Return Condition & Notes</label> <textarea placeholder="e.g. Key returned in good condition" value={returnForm.returnNotes} onChange={(e) => setReturnForm({ ...returnForm, returnNotes: e.target.value })} className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 h-20 resize-none" /> </div> <div className="flex gap-3 justify-end pt-4 border-t border-slate-100"> <button type="button" onClick={() => setActiveKeyForReturn(null)} className="px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer" > Cancel </button> <button type="submit" disabled={isReturning} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50" > {isReturning ? "Returning..." : "Confirm Return"} </button> </div> </form> </div> </div> )} {/* MODAL 4: DELETE KEY CONFIRMATION */} {keyToDelete && ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"> <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Key Registry</h3> <p className="text-slate-600 text-sm mb-6"> Are you sure you want to delete this key from inventory? All logs and custody details will be deleted permanently. </p> <div className="flex gap-3 justify-end"> <button onClick={() => setKeyToDelete(null)} className="px-4 py-2 text-xs rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer" > Cancel </button> <button onClick={handleDeleteSubmit} disabled={isDeleting} className="px-4 py-2 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold cursor-pointer disabled:opacity-50" > {isDeleting ? "Deleting..." : "Confirm Delete"} </button> </div> </div> </div> )} {/* MODAL 5: MOVEMENT LOGS / HISTORY DIALOG */} {activeKeyForHistory && ( <HistoryModal keyObj={activeKeyForHistory} onClose={() => setActiveKeyForHistory(null)} /> )} </div> );
}; // Sub-Component: Key History movement logs loader
const HistoryModal = ({ keyObj, onClose }) => {
  const [historyPage, setHistoryPage] = useState(1);
  const historyLimit = 6;
  const {
    data: historyData,
    isLoading,
    isFetching,
  } = useGetKeyHistoryQuery({
    id: keyObj._id,
    params: { page: historyPage, limit: historyLimit },
  });
  const historyList = useMemo(() => historyData?.data || [], [historyData]);
  const historyMeta = useMemo(
    () => historyData?.meta || { page: 1, limit: 6, total: 0, totalPages: 1 },
    [historyData],
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {" "}
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col justify-between min-h-[380px] max-h-[85vh]">
        {" "}
        <div className="space-y-4 overflow-y-auto pr-1">
          {" "}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            {" "}
            <div>
              {" "}
              <h3 className="font-bold text-slate-800 text-base">
                Movement Logs
              </h3>{" "}
              <p className="text-xs text-slate-400 font-semibold">
                {keyObj.keyIdentifier}
              </p>{" "}
            </div>{" "}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-bold text-sm bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              {" "}
              ✕{" "}
            </button>{" "}
          </div>{" "}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              {" "}
              <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />{" "}
            </div>
          ) : historyList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              {" "}
              <History className="w-8 h-8 text-slate-200 mb-1" />{" "}
              <p className="text-xs font-semibold">
                No movement logs found
              </p>{" "}
            </div>
          ) : (
            <div className="relative pl-5 border-l-2 border-slate-100 space-y-6 py-2 ml-2">
              {" "}
              {historyList.map((log, idx) => {
                const isReturn = log.status === "returned";
                const date = new Date(log.movementDate || log.returnedDate);
                const formattedDate = date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });
                const formattedTime = date.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div key={idx} className="relative space-y-1">
                    {" "}
                    {/* Circle timeline indicator */}{" "}
                    <span
                      className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-4 ring-white ${isReturn ? "bg-emerald-500" : "bg-blue-500"}`}
                    />{" "}
                    <div className="flex flex-col">
                      {" "}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {" "}
                        <span className="text-[11px] font-bold text-slate-700">
                          {" "}
                          {isReturn
                            ? `Returned to ${log.returnedToName || "Owner"}`
                            : `Handed to ${log.toPersonName}`}{" "}
                        </span>{" "}
                        <span
                          className={`text-[8px] font-bold uppercase px-1.5 rounded ${isReturn ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                        >
                          {" "}
                          {log.status}{" "}
                        </span>{" "}
                      </div>{" "}
                      {!isReturn && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          {" "}
                          <span className="text-[9px] text-slate-400 font-semibold uppercase">
                            From:
                          </span>{" "}
                          <span>{log.fromPersonName}</span>{" "}
                          {log.expectedReturnDate && (
                            <>
                              {" "}
                              <span>•</span>{" "}
                              <span className="text-slate-400 font-semibold uppercase">
                                Due:
                              </span>{" "}
                              <span className="text-amber-700 font-semibold">
                                {new Date(
                                  log.expectedReturnDate,
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>{" "}
                            </>
                          )}{" "}
                        </div>
                      )}{" "}
                      {(log.notes || log.returnNotes) && (
                        <div className="text-[10px] text-slate-400 italic bg-slate-50 p-1.5 rounded-lg border border-slate-100/50 mt-1">
                          {" "}
                          "{log.notes || log.returnNotes}"{" "}
                        </div>
                      )}{" "}
                      <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                        {" "}
                        {formattedDate} at {formattedTime}{" "}
                      </span>{" "}
                    </div>{" "}
                  </div>
                );
              })}{" "}
            </div>
          )}{" "}
        </div>{" "}
        {/* Paginated history controls */}{" "}
        {historyMeta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-500">
            {" "}
            <span>
              {" "}
              Showing {historyList.length} of {historyMeta.total} logs{" "}
            </span>{" "}
            <div className="flex items-center gap-1">
              {" "}
              <button
                onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                disabled={historyPage === 1}
                className="p-1 border border-slate-100 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                {" "}
                <ChevronLeft className="w-3 h-3" />{" "}
              </button>{" "}
              <span className="font-bold text-slate-700 px-1">
                {historyPage} / {historyMeta.totalPages}
              </span>{" "}
              <button
                onClick={() =>
                  setHistoryPage((p) => Math.min(historyMeta.totalPages, p + 1))
                }
                disabled={historyPage === historyMeta.totalPages}
                className="p-1 border border-slate-100 rounded hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                {" "}
                <ChevronRight className="w-3 h-3" />{" "}
              </button>{" "}
            </div>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
};
export default KeyManagementTab;
