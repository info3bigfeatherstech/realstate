import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  Pencil, Trash2, Eye, Plus, Search, ChevronDown,
  ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetPropertiesQuery,
  useDeletePropertyMutation,
  useUpdatePropertyStatusMutation
} from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertyApi";
import {
  setPage,
  setLimit,
  setSearch,
  setListingType,
  setPropertyType,
  setStatus,
  setCity,
  setSortBy,
  toggleSortOrder,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
} from "../../../../REDUX_FEATURES/REDUX_SLICES/customerPropertyApi/customerPropertySlice";
import { formatListingTypeLabel, isSellListingType } from "../../../../utils/listingType";

// ─── Status Badge (Option C: clickable badge with portal popover) ─────────────

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700 border border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  inactive: "bg-slate-100 text-slate-500 border border-slate-200",
  draft: "bg-gray-100 text-gray-500 border border-gray-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
  rented: "bg-purple-100 text-purple-700 border border-purple-200",
  occupied: "bg-amber-100 text-amber-700 border border-amber-200",
  sold: "bg-blue-100 text-blue-700 border border-blue-200",
};

const STATUS_OPTIONS = [
  { label: "Active", value: "active", dot: "bg-green-500" },
  { label: "Inactive", value: "inactive", dot: "bg-slate-400" },
  { label: "Rented", value: "rented", dot: "bg-purple-500" },
  { label: "Occupied", value: "occupied", dot: "bg-amber-500" },
  { label: "Sold", value: "sold", dot: "bg-blue-500" },
  { label: "Draft", value: "draft", dot: "bg-gray-400" },
];

// Portal popover anchored to badge via getBoundingClientRect
function StatusPopover({ anchorRef, open, onClose, currentStatus, onSelect }) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, anchorRef]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* Transparent backdrop to close on outside click */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      <div
        className="absolute z-[999999] w-36 bg-white rounded-xl shadow-lg border border-slate-150 py-1.5 text-left"
        style={{ top: coords.top, left: coords.left }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            disabled={currentStatus === opt.value}
            onClick={() => {
              onSelect(opt.value);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dot}`} />
            {opt.label}
          </button>
        ))}
      </div>
    </>,
    document.body
  );
}

// Clickable status badge — disabled for pending/rejected (cannot change)
function StatusBadge({ status, propertyId, onStatusChange }) {
  const [open, setOpen] = useState(false);
  const badgeRef = useRef(null);

  const isLocked = status === "pending" || status === "rejected";

  return (
    <>
      <button
        ref={badgeRef}
        type="button"
        disabled={isLocked}
        onClick={() => !isLocked && setOpen((v) => !v)}
        title={isLocked ? "Status cannot be changed" : "Click to change status"}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all
          ${STATUS_STYLES[status] || "bg-gray-100 text-gray-500"}
          ${isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:opacity-80 hover:shadow-sm"}
        `}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
        {!isLocked && (
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      <StatusPopover
        anchorRef={badgeRef}
        open={open}
        onClose={() => setOpen(false)}
        currentStatus={status}
        onSelect={(newStatus) => onStatusChange(propertyId, newStatus)}
      />
    </>
  );
}

const ListingBadge = ({ type }) => {
  const isSell = isSellListingType(type) && type !== "BUY";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isSell ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
      {formatListingTypeLabel(type)}
    </span>
  );
};

const formatPrice = (price, listingType) => {
  if (!price && price !== 0) return "—";
  if (listingType === "For Rent" || listingType === "PG") {
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};

const MyPropertiesTab = () => {
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const {
    page,
    limit,
    search: searchTerm,
    listingType,
    propertyType,
    status: statusFilter,
    city,
    sortBy,
    sortOrder,
    selectedIds,
  } = useSelector((state) => state.customerProperty);

  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
    ...(searchTerm && { search: searchTerm }),
    ...(listingType && { listingType }),
    ...(propertyType && { propertyType }),
    ...(statusFilter && { status: statusFilter }),
    ...(city && { city }),
  };

  const { data, isLoading, isFetching, refetch } = useGetPropertiesQuery(queryParams);
  const [deleteProperty, { isLoading: isDeleting }] = useDeletePropertyMutation();
  const [updateStatus] = useUpdatePropertyStatusMutation();

  const properties = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Handles status change triggered from the clickable StatusBadge
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id).unwrap();
      setPropertyToDelete(null);
      dispatch(clearSelectedIds());
      refetch();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === properties.length) {
      dispatch(clearSelectedIds());
    } else {
      dispatch(selectAllIds(properties.map((p) => p._id)));
    }
  };

  const handleToggleSelect = (id) => {
    dispatch(toggleSelectId(id));
  };

  const getMainImage = (media) => {
    if (!media || media.length === 0) return "https://via.placeholder.com/80x60?text=No+Image";
    const mainImage = media.find((m) => m.isMain === true);
    if (mainImage) return mainImage.url;
    return media[0]?.url || "https://via.placeholder.com/80x60?text=No+Image";
  };

  const DeleteConfirmModal = () => {
    if (!propertyToDelete) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Property</h3>
          <p className="text-slate-600 mb-6 text-sm">Are you sure you want to delete this property? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setPropertyToDelete(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer text-sm font-semibold">
              Cancel
            </button>
            <button onClick={() => handleDelete(propertyToDelete)} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer text-sm font-semibold">
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const STATUS_TABS = [
    { label: "All Properties", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Active", value: "active" },
    { label: "Rented", value: "rented" },
    { label: "Occupied", value: "occupied" },
    { label: "Sold", value: "sold" },
    { label: "Drafts", value: "draft" },
    { label: "Inactive", value: "inactive" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-5">
      <DeleteConfirmModal />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Properties</h2>
          <p className="text-sm text-slate-500">Manage and track your submitted real estate property listings.</p>
        </div>
        <button onClick={() => setSearchParams({ tab: "add-property" })} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-all duration-200 shrink-0">
          <Plus className="w-4 h-4" />
          Add New Property
        </button>
      </div>

      {/* Horizontal Status Row Filters */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => dispatch(setStatus(tab.value))}
              className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400 shadow-sm"
          />
        </div>

        <select value={listingType} onChange={(e) => dispatch(setListingType(e.target.value))} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-600 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
          <option value="">All Listing Types</option>
          <option value="For Sell">For Sell</option>
          <option value="For Rent">For Rent</option>
          <option value="BUY">BUY</option>
          <option value="PG">PG</option>
        </select>

        <button onClick={() => refetch()} disabled={isFetching} className="px-4 py-2.5 text-sm font-semibold text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 cursor-pointer transition-all duration-200">
          {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-3">
            <p className="text-base font-semibold">No Properties Found</p>
            <p className="text-xs text-slate-400">Click "Add New Property" to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="w-10 px-4 py-3 text-left">
                      <input type="checkbox" checked={selectedIds.length === properties.length && properties.length > 0} onChange={handleSelectAll} className="rounded border-slate-300 text-blue-600 cursor-pointer" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-20 tracking-wider">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-700 tracking-wider" onClick={() => { dispatch(setSortBy("title")); dispatch(toggleSortOrder()); }}>
                      <span className="flex items-center gap-1">Title <ChevronDown className={`w-3 h-3 transition-transform ${sortBy === "title" && sortOrder === "desc" ? "rotate-180" : ""}`} /></span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Listing Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Property Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-700 tracking-wider" onClick={() => { dispatch(setSortBy("price")); dispatch(toggleSortOrder()); }}>
                      <span className="flex items-center gap-1">Price <ChevronDown className={`w-3 h-3 transition-transform ${sortBy === "price" && sortOrder === "desc" ? "rotate-180" : ""}`} /></span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    {/* Status column header — badge is now interactive (Option C) */}
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedIds.includes(prop._id)} onChange={() => handleToggleSelect(prop._id)} className="rounded border-slate-300 text-blue-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <img src={getMainImage(prop.media)} alt={prop.title} className="w-16 h-12 object-cover rounded-lg border border-slate-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <span className="font-semibold text-slate-800 text-sm">{prop.title}</span>
                          <p className="text-[10px] text-slate-400 mt-0.5">ID: {prop.listingId || "Pending ID"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4"><ListingBadge type={prop.listingType} /></td>
                      <td className="px-4 py-4 text-slate-600 text-xs font-medium">{prop.propertyType}</td>
                      <td className="px-4 py-4 font-bold text-slate-800 text-sm">{formatPrice(prop.price, prop.listingType)}</td>
                      <td className="px-4 py-4 text-slate-600 text-xs font-medium">{prop.location?.city}, {prop.location?.state}</td>

                      {/* Status cell — clickable badge replaces static badge + three-dot button */}
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={prop.status}
                          propertyId={prop._id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>

                      {/* Actions column — pencil, trash, eye only (three-dot removed, status badge is now the trigger) */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSearchParams({ tab: "edit-property", id: prop._id })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setPropertyToDelete(prop._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          <button onClick={() => setSearchParams({ tab: "property-detail", id: prop._id })} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Rows per page:</span>
                <select value={limit} onChange={(e) => dispatch(setLimit(Number(e.target.value)))} className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer shadow-sm text-slate-600">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} properties</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page === 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                {[...Array(Math.min(5, meta.totalPages))].map((_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => dispatch(setPage(pageNum))} className={`w-8 h-8 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${page === pageNum ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => dispatch(setPage(Math.min(meta.totalPages, page + 1)))} disabled={page === meta.totalPages} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesTab;