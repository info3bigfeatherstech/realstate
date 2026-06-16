// src/Tabs/PropertiesTab/PropertiesTab.jsx
import React, { useState } from "react";
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
} from "../../Admin_Redux/PropertyApi/propertyApi";
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
} from "../../Admin_Redux/PropertyApi/propertySlice";
import { formatListingTypeLabel, isSellListingType } from "../../../../utils/listingType";

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    inactive: "bg-gray-100 text-gray-500",
    draft: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
    </span>
  );
};

const ListingBadge = ({ type }) => {
  const isSale = isSellListingType(type) && type !== "BUY";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isSale ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
      {formatListingTypeLabel(type)}
    </span>
  );
};

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${checked ? "bg-green-500" : "bg-gray-300"}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

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

const PropertiesTab = () => {
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
  } = useSelector((state) => state.property);

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
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdatePropertyStatusMutation();

  const properties = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update status:", error);
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Property</h3>
          <p className="text-slate-600 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setPropertyToDelete(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
              Cancel
            </button>
            <button onClick={() => handleDelete(propertyToDelete)} disabled={isDeleting} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer">
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <DeleteConfirmModal />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Property Listings</h2>
        <button onClick={() => setSearchParams({ tab: "add-property" })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Property
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, ID or location..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
          />
        </div>

        <select value={listingType} onChange={(e) => dispatch(setListingType(e.target.value))} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer">
          <option value="">All Listing Types</option>
          <option value="For Sell">For Sell</option>
          <option value="For Rent">For Rent</option>
          <option value="BUY">BUY</option>
          <option value="PG">PG</option>
        </select>

        <select value={statusFilter} onChange={(e) => dispatch(setStatus(e.target.value))} className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>

        <button onClick={() => refetch()} disabled={isFetching} className="px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 cursor-pointer">
          {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-20">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:text-slate-700" onClick={() => { dispatch(setSortBy("title")); dispatch(toggleSortOrder()); }}>
                      <span className="flex items-center gap-1">Title <ChevronDown className={`w-3 h-3 transition-transform ${sortBy === "title" && sortOrder === "desc" ? "rotate-180" : ""}`} /></span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Listing Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Property Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase cursor-pointer hover:text-slate-700" onClick={() => { dispatch(setSortBy("price")); dispatch(toggleSortOrder()); }}>
                      <span className="flex items-center gap-1">Price <ChevronDown className={`w-3 h-3 transition-transform ${sortBy === "price" && sortOrder === "desc" ? "rotate-180" : ""}`} /></span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <input type="checkbox" checked={selectedIds.includes(prop._id)} onChange={() => handleToggleSelect(prop._id)} className="rounded border-slate-300 text-blue-600 cursor-pointer" />
                      </td>
                      <td className="px-4 py-4">
                        <img src={getMainImage(prop.media)} alt={prop.title} className="w-16 h-12 object-cover rounded-lg border border-slate-100" />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <span className="font-semibold text-slate-800">{prop.title}</span>
                          <p className="text-xs text-slate-400 mt-0.5">ID: {prop.listingId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4"><ListingBadge type={prop.listingType} /></td>
                      <td className="px-4 py-4 text-slate-600">{prop.propertyType}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800">{formatPrice(prop.price, prop.listingType)}</td>
                      <td className="px-4 py-4"><span className="text-slate-600">{prop.location?.city}, {prop.location?.state}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Toggle checked={prop.status === "active"} onChange={() => handleToggleStatus(prop._id, prop.status)} disabled={isUpdatingStatus} />
                          <StatusBadge status={prop.status} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSearchParams({ tab: "edit-property", id: prop._id })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setPropertyToDelete(prop._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                          <button onClick={() => setSearchParams({ tab: "property-detail", id: prop._id })} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"><Eye className="w-4 h-4" /></button>
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
                <select value={limit} onChange={(e) => dispatch(setLimit(Number(e.target.value)))} className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer">
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">Showing {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} properties</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => dispatch(setPage(Math.max(1, page - 1)))} disabled={page === 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                {[...Array(Math.min(5, meta.totalPages))].map((_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= meta.totalPages - 2) pageNum = meta.totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button key={pageNum} onClick={() => dispatch(setPage(pageNum))} className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${page === pageNum ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => dispatch(setPage(Math.min(meta.totalPages, page + 1)))} disabled={page === meta.totalPages} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesTab;

// // src/tabs/PropertiesTab.jsx
// import React, { useState } from "react";
// import { Pencil, Trash2, Eye, Plus, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
// import { useSearchParams } from "react-router-dom";

// const mockProperties = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&h=60&fit=crop",
//     title: "Skyline 2BHK Flat",
//     listingType: ["For Sale"],
//     propertyType: "Apartment",
//     price: "₹75 Lakhs",
//     location: "Andheri East",
//     status: "Active",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=80&h=60&fit=crop",
//     title: "Luxury 4BHK Villa",
//     listingType: ["For Sale", "For Rent"],
//     propertyType: "Villa",
//     price: "₹2.5 Lakhs/mo",
//     location: "Bandra West",
//     status: "Active",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=60&fit=crop",
//     title: "Commercial Tech Hub",
//     listingType: ["For Sale"],
//     propertyType: "Commercial",
//     price: "₹4.2 Cr",
//     location: "Goregaon West",
//     status: "Pending",
//   },
//   {
//     id: 4,
//     image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&h=60&fit=crop",
//     title: "Studio Apartment DLF",
//     listingType: ["For Rent"],
//     propertyType: "Apartment",
//     price: "₹35,000/mo",
//     location: "Gurugram",
//     status: "Active",
//   },
//   {
//     id: 5,
//     image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&h=60&fit=crop",
//     title: "Garden View Bungalow",
//     listingType: ["For Sale"],
//     propertyType: "Bungalow",
//     price: "₹1.8 Cr",
//     location: "Powai",
//     status: "Inactive",
//   },
// ];

// const StatusBadge = ({ status }) => {
//   const styles = {
//     Active: "bg-green-100 text-green-700",
//     Pending: "bg-yellow-100 text-yellow-700",
//     Inactive: "bg-gray-100 text-gray-500",
//   };
//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-500"}`}>
//       {status}
//     </span>
//   );
// };

// const ListingBadge = ({ type }) => {
//   const isSale = type === "For Sale";
//   return (
//     <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isSale ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
//       {type}
//     </span>
//   );
// };

// const Toggle = ({ checked, onChange }) => (
//   <button
//     onClick={() => onChange(!checked)}
//     className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${checked ? "bg-green-500" : "bg-gray-300"}`}
//   >
//     <span
//       className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
//     />
//   </button>
// );

// const PropertiesTab = () => {
//   const [, setSearchParams] = useSearchParams();
//   const [properties, setProperties] = useState(mockProperties);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;

//   const toggleStatus = (id) => {
//     setProperties((prev) =>
//       prev.map((p) =>
//         p.id === id
//           ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
//           : p
//       )
//     );
//   };

//   const toggleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedIds.length === properties.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(properties.map((p) => p.id));
//     }
//   };

//   const filtered = properties.filter((p) =>
//     p.title.toLowerCase().includes(search.toLowerCase()) ||
//     p.location.toLowerCase().includes(search.toLowerCase())
//   );

//   const totalPages = Math.max(1, Math.ceil(156 / rowsPerPage));

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-bold text-slate-800">Property Listings</h2>
//         <button onClick={() => setSearchParams({ tab: "add-property" })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
//           <Plus className="w-4 h-4" />
//           Add New Property
//         </button>
//       </div>

//       {/* Search + Filter */}
//       <div className="flex items-center gap-3">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by title or location..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400"
//           />
//         </div>
//         <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer">
//           Filter by Type
//           <ChevronDown className="w-4 h-4 text-slate-400" />
//         </button>
//       </div>

//       {/* Table */}
//       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/60">
//                 <th className="w-10 px-4 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.length === properties.length && properties.length > 0}
//                     onChange={toggleSelectAll}
//                     className="rounded border-slate-300 text-blue-600 cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Image</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                   <span className="flex items-center gap-1">Title <ChevronDown className="w-3 h-3" /></span>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Listing Type</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property Type</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                   <span className="flex items-center gap-1">Price <ChevronDown className="w-3 h-3" /></span>
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
//                 <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filtered.map((prop) => (
//                 <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
//                   <td className="px-4 py-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(prop.id)}
//                       onChange={() => toggleSelect(prop.id)}
//                       className="rounded border-slate-300 text-blue-600 cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <img
//                       src={prop.image}
//                       alt={prop.title}
//                       className="w-16 h-12 object-cover rounded-lg border border-slate-100"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="font-semibold text-slate-800">{prop.title}</span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex flex-col gap-1">
//                       {prop.listingType.map((t) => (
//                         <ListingBadge key={t} type={t} />
//                       ))}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4 text-slate-600">{prop.propertyType}</td>
//                   <td className="px-4 py-4 font-semibold text-slate-800">{prop.price}</td>
//                   <td className="px-4 py-4 text-slate-600">{prop.location}</td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-2">
//                       <Toggle
//                         checked={prop.status === "Active"}
//                         onChange={() => toggleStatus(prop.id)}
//                       />
//                       <StatusBadge status={prop.status} />
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center justify-end gap-1">
//                       <button onClick={() => setSearchParams({ tab: "edit-property", id: String(prop.id) })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                       <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => setSearchParams({ tab: "property-detail", id: String(prop.id) })} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white">
//           <div className="flex items-center gap-2 text-sm text-slate-500">
//             <span>Rows per page:</span>
//             <select className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-600 bg-white focus:outline-none cursor-pointer">
//               <option>10</option>
//               <option>25</option>
//               <option>50</option>
//             </select>
//             <span className="ml-2">Showing 1–10 of 156 properties</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             {[1, 2, 3].map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page
//                     ? "bg-blue-600 text-white"
//                     : "text-slate-600 hover:bg-slate-100"
//                   }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <span className="px-1 text-slate-400 text-sm">...</span>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === totalPages
//                   ? "bg-blue-600 text-white"
//                   : "text-slate-600 hover:bg-slate-100"
//                 }`}
//             >
//               {totalPages}
//             </button>
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertiesTab;