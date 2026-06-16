// src/Tabs/UtilityServicesTab/UtilityServicesTab.jsx
import React, { useState } from "react";
import {
  Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2,
  Phone, Loader2, X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetEliteServicesQuery,
  useDeleteEliteServiceMutation,
  useUpdateEliteServiceStatusMutation,
} from "../../Admin_Redux/EliteServiceApi/eliteServiceApi";
import {
  setPage,
  setLimit,
  setSearch,
  setRole,
  setStatus,
  toggleSelectId,
  selectAllIds,
  clearSelectedIds,
  resetFilters,
} from "../../Admin_Redux/EliteServiceApi/eliteServiceSlice";
import AddEliteServiceModal from "./Shared/AddEliteServiceModal";
import EditEliteServiceModal from "./Shared/EditEliteServiceModal";

// ─── Schema-matched enums ─────────────────────────────────────────────────────
const ELITE_SERVICE_ROLES = ["Plumber", "Electrician", "Carpenter", "Painter"];
// ─────────────────────────────────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      status === "Available"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        status === "Available" ? "bg-green-600" : "bg-red-600"
      }`}
    />
    {status}
  </span>
);

const RoleBadge = ({ role }) => {
  const colors = {
    Plumber: "bg-blue-100 text-blue-700",
    Electrician: "bg-yellow-100 text-yellow-700",
    Carpenter: "bg-orange-100 text-orange-700",
    Painter: "bg-purple-100 text-purple-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
        colors[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
};

const Toggle = ({ checked, onChange, disabled }) => (
  <button
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
      disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
    } ${checked ? "bg-green-500" : "bg-gray-300"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────

const UtilityServicesTab = () => {
  const dispatch = useDispatch();

  const {
    page,
    limit,
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
    sortBy,
    sortOrder,
    selectedIds,
  } = useSelector((state) => state.eliteService);

  const queryParams = {
    page,
    limit,
    sortBy,
    sortOrder,
    ...(searchTerm && { search: searchTerm }),
    ...(roleFilter && { role: roleFilter }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isFetching, refetch } =
    useGetEliteServicesQuery(queryParams);
  const [deleteEliteService, { isLoading: isDeleting }] =
    useDeleteEliteServiceMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateEliteServiceStatusMutation();

  const services = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const [serviceToDelete, setServiceToDelete] = useState(null);

  // ── Modal state (Add / Edit) ────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Available" ? "Busy" : "Available";
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEliteService(id).unwrap();
      setServiceToDelete(null);
      dispatch(clearSelectedIds());
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === services.length) {
      dispatch(clearSelectedIds());
    } else {
      dispatch(selectAllIds(services.map((s) => s._id)));
    }
  };

  const hasActiveFilters = searchTerm || roleFilter || statusFilter;

  // ── Stat counts (from full dataset meta if backend provides, else from page) ─
  // If your backend returns stats in meta, use those. Otherwise these are page-level.
  const availableCount = services.filter((s) => s.status === "Available").length;
  const busyCount = services.filter((s) => s.status === "Busy").length;
  const uniqueRoles = new Set(services.map((s) => s.role)).size;

  // ── Delete Confirm Modal ────────────────────────────────────────────────────
  const DeleteConfirmModal = () => {
    if (!serviceToDelete) return null;
    const service = services.find((s) => s._id === serviceToDelete);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Delete Service Provider
          </h3>
          <p className="text-slate-600 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{service?.providerName}</span>? This
            action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setServiceToDelete(null)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(serviceToDelete)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <DeleteConfirmModal />

      {showAddModal && (
        <AddEliteServiceModal onClose={() => setShowAddModal(false)} />
      )}

      {editServiceId && (
        <EditEliteServiceModal
          serviceId={editServiceId}
          onClose={() => setEditServiceId(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Utility Services</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Provider
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wide">
            Total Providers
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {meta.total || services.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wide">
            Available
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {availableCount}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wide">
            Busy
          </p>
          <p className="text-2xl font-bold text-red-500 mt-1">{busyCount}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-slate-500 text-xs uppercase font-semibold tracking-wide">
            Roles Active
          </p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {uniqueRoles}
          </p>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
          <span className="text-sm text-blue-700 font-medium">
            {selectedIds.length} provider
            {selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <button
            onClick={() => dispatch(clearSelectedIds())}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, address or phone..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => dispatch(setRole(e.target.value))}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          <option value="">All Roles</option>
          {ELITE_SERVICE_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => dispatch(setStatus(e.target.value))}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={() => dispatch(resetFilters())}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl border border-red-200"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 disabled:opacity-50 cursor-pointer"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <p className="text-base font-semibold">No service providers found</p>
            <p className="text-sm mt-1">Try adjusting your filters or add a new provider.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === services.length &&
                          services.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-blue-600 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Provider Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {services.map((service) => (
                    <tr key={service._id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(service._id)}
                          onChange={() => dispatch(toggleSelectId(service._id))}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <RoleBadge role={service.role} />
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {service.providerName}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-slate-500 text-xs max-w-[220px] truncate">
                          {service.address}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-700 text-xs">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <a
                              href={`tel:${service.primaryMobile}`}
                              className="hover:text-blue-600"
                            >
                              {service.primaryMobile}
                            </a>
                          </div>
                          {service.secondaryMobile && (
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                              <Phone className="w-3 h-3" />
                              <span>{service.secondaryMobile}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Toggle
                            checked={service.status === "Available"}
                            onChange={() =>
                              handleToggleStatus(service._id, service.status)
                            }
                            disabled={isUpdatingStatus}
                          />
                          <StatusBadge status={service.status} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditServiceId(service._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setServiceToDelete(service._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                  className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">
                  Showing{" "}
                  {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–
                  {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                  providers
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(Math.min(5, meta.totalPages))].map((_, i) => {
                  let pageNum;
                  if (meta.totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= meta.totalPages - 2)
                    pageNum = meta.totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => dispatch(setPage(pageNum))}
                      className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    dispatch(setPage(Math.min(meta.totalPages, page + 1)))
                  }
                  disabled={page === meta.totalPages}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UtilityServicesTab;

// use upper code which is updated and api loded 
// // src/Tabs/UtilityServicesTab/UtilityServicesTab.jsx
// import React, { useState } from "react";
// import {
//   Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2,
//   Phone, Filter, X,ChevronDown 
// } from "lucide-react";

// // Demo Data - Exactly as you provided
// const mockServices = [
//   {
//     id: 1,
//     role: "Plumber",
//     providerName: "Rajesh Kumar",
//     address: "Shop No. 14, Central Market, Block B, Sector 62, Noida",
//     primaryMobile: "+919873085801",
//     secondaryMobile: "+919289684801",
//     status: "Available"
//   },
//   {
//     id: 2,
//     role: "Electrician",
//     providerName: "Vikram Singh",
//     address: "G-42, Ground Floor, Galleria Market, DLF Phase 4, Gurugram",
//     primaryMobile: "+919289684801",
//     secondaryMobile: "",
//     status: "Available"
//   },
//   {
//     id: 3,
//     role: "Carpenter",
//     providerName: "Amit Sharma",
//     address: "Metro Pillar 485, Main Road, Laxmi Nagar, New Delhi",
//     primaryMobile: "+919873085801",
//     secondaryMobile: "+919555123456",
//     status: "Busy"
//   },
//   {
//     id: 4,
//     role: "Painter",
//     providerName: "Sanjay Dutt",
//     address: "Plot 102, Near Community Center, Sector 15, Faridabad",
//     primaryMobile: "+919311223344",
//     secondaryMobile: "+919873085801",
//     status: "Available"
//   },
//   {
//     id: 5,
//     role: "Electrician",
//     providerName: "Anil Kapoor",
//     address: "Shop 4, Wave City Center, Sector 32, Noida",
//     primaryMobile: "+919999888777",
//     secondaryMobile: "",
//     status: "Available"
//   },
//   {
//     id: 6,
//     role: "Plumber",
//     providerName: "Manoj Tiwari",
//     address: "K-12, Connaught Place, Near Rajiv Chowk, New Delhi",
//     primaryMobile: "+919111222333",
//     secondaryMobile: "+919444555666",
//     status: "Available"
//   }
// ];

// const rolesList = ["Plumber", "Electrician", "Carpenter", "Painter"];

// const StatusBadge = ({ status }) => {
//   return (
//     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
//       status === "Available" 
//         ? "bg-green-100 text-green-700" 
//         : "bg-red-100 text-red-700"
//     }`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${status === "Available" ? "bg-green-600" : "bg-red-600"}`} />
//       {status}
//     </span>
//   );
// };

// const RoleBadge = ({ role }) => {
//   const colors = {
//     Plumber: "bg-blue-100 text-blue-700",
//     Electrician: "bg-yellow-100 text-yellow-700",
//     Carpenter: "bg-orange-100 text-orange-700",
//     Painter: "bg-purple-100 text-purple-700",
//   };
//   return (
//     <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colors[role] || "bg-gray-100 text-gray-700"}`}>
//       {role}
//     </span>
//   );
// };

// const UtilityServicesTab = () => {
//   const [services, setServices] = useState(mockServices);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [showModal, setShowModal] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [serviceToDelete, setServiceToDelete] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);

//   // Form Data - Only original fields
//   const [formData, setFormData] = useState({
//     role: "",
//     providerName: "",
//     address: "",
//     primaryMobile: "",
//     secondaryMobile: "",
//     status: "Available",
//   });

//   // Filter services
//   const filteredServices = services.filter((service) => {
//     const matchesSearch = search === "" || 
//       service.providerName.toLowerCase().includes(search.toLowerCase()) ||
//       service.address.toLowerCase().includes(search.toLowerCase()) ||
//       service.primaryMobile.includes(search);
//     const matchesRole = roleFilter === "" || service.role === roleFilter;
//     const matchesStatus = statusFilter === "" || service.status === statusFilter;
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   // Pagination
//   const totalPages = Math.ceil(filteredServices.length / rowsPerPage);
//   const paginatedServices = filteredServices.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   // Handlers
//   const toggleSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedIds.length === paginatedServices.length && paginatedServices.length > 0) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(paginatedServices.map((s) => s.id));
//     }
//   };

//   const handleAdd = () => {
//     setEditingService(null);
//     setFormData({
//       role: "",
//       providerName: "",
//       address: "",
//       primaryMobile: "",
//       secondaryMobile: "",
//       status: "Available",
//     });
//     setShowModal(true);
//   };

//   const handleEdit = (service) => {
//     setEditingService(service);
//     setFormData({
//       role: service.role,
//       providerName: service.providerName,
//       address: service.address,
//       primaryMobile: service.primaryMobile,
//       secondaryMobile: service.secondaryMobile || "",
//       status: service.status,
//     });
//     setShowModal(true);
//   };

//   const handleSave = () => {
//     if (editingService) {
//       // Update existing
//       setServices(services.map(s => 
//         s.id === editingService.id ? { ...s, ...formData } : s
//       ));
//     } else {
//       // Add new
//       const newService = {
//         id: Date.now(),
//         ...formData,
//       };
//       setServices([...services, newService]);
//     }
//     setShowModal(false);
//     setEditingService(null);
//   };

//   const handleDelete = (id) => {
//     setServices(services.filter(s => s.id !== id));
//     setSelectedIds(selectedIds.filter(sid => sid !== id));
//     setServiceToDelete(null);
//   };

//   const handleBulkDelete = () => {
//     setServices(services.filter(s => !selectedIds.includes(s.id)));
//     setSelectedIds([]);
//   };

//   const handleToggleStatus = (id) => {
//     setServices(services.map(s =>
//       s.id === id ? { ...s, status: s.status === "Available" ? "Busy" : "Available" } : s
//     ));
//   };

//   const clearFilters = () => {
//     setSearch("");
//     setRoleFilter("");
//     setStatusFilter("");
//     setCurrentPage(1);
//   };

//   // Delete Confirm Modal
//   const DeleteConfirmModal = () => {
//     if (!serviceToDelete) return null;
//     const service = services.find(s => s.id === serviceToDelete);
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
//           <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Service Provider</h3>
//           <p className="text-slate-600 mb-6">
//             Are you sure you want to delete <span className="font-semibold">{service?.providerName}</span>? 
//             This action cannot be undone.
//           </p>
//           <div className="flex gap-3 justify-end">
//             <button onClick={() => setServiceToDelete(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
//               Cancel
//             </button>
//             <button onClick={() => handleDelete(serviceToDelete)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Add/Edit Modal
//   const ServiceModal = () => {
//     if (!showModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
//         <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 my-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-slate-800">
//               {editingService ? "Edit Service Provider" : "Add New Service Provider"}
//             </h3>
//             <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role *</label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//               >
//                 <option value="">Select Role</option>
//                 {rolesList.map(role => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Provider Name *</label>
//               <input
//                 type="text"
//                 value={formData.providerName}
//                 onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//                 placeholder="Enter name"
//               />
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address *</label>
//               <textarea
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//                 rows="2"
//                 placeholder="Full address"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Primary Mobile *</label>
//               <input
//                 type="tel"
//                 value={formData.primaryMobile}
//                 onChange={(e) => setFormData({ ...formData, primaryMobile: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//                 placeholder="+91 XXXXXXXXXX"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Secondary Mobile</label>
//               <input
//                 type="tel"
//                 value={formData.secondaryMobile}
//                 onChange={(e) => setFormData({ ...formData, secondaryMobile: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//                 placeholder="+91 XXXXXXXXXX (Optional)"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Status</label>
//               <select
//                 value={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//               >
//                 <option value="Available">Available</option>
//                 <option value="Busy">Busy</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-200">
//             <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
//               Cancel
//             </button>
//             <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
//               {editingService ? "Update" : "Create"} Service
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6">
//       <DeleteConfirmModal />
//       <ServiceModal />

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800">Utility Services</h2>
//           <p className="text-sm text-slate-500 mt-1">Manage service providers and their availability</p>
//         </div>
//         <button 
//           onClick={handleAdd}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
//         >
//           <Plus className="w-4 h-4" />
//           Add New Service Provider
//         </button>
//       </div>

//       {/* Bulk Actions Bar */}
//       {selectedIds.length > 0 && (
//         <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4">
//           <span className="text-sm text-blue-700 font-medium">
//             {selectedIds.length} service{selectedIds.length > 1 ? "s" : ""} selected
//           </span>
//           <div className="flex items-center gap-2">
//             <button onClick={handleBulkDelete} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer">
//               Delete Selected
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <p className="text-slate-500 text-xs uppercase font-semibold">Total Providers</p>
//           <p className="text-2xl font-bold text-slate-800">{services.length}</p>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <p className="text-slate-500 text-xs uppercase font-semibold">Available</p>
//           <p className="text-2xl font-bold text-green-600">{services.filter(s => s.status === "Available").length}</p>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <p className="text-slate-500 text-xs uppercase font-semibold">Busy</p>
//           <p className="text-2xl font-bold text-red-600">{services.filter(s => s.status === "Busy").length}</p>
//         </div>
//         <div className="bg-white border border-slate-200 rounded-xl p-4">
//           <p className="text-slate-500 text-xs uppercase font-semibold">Roles Available</p>
//           <p className="text-2xl font-bold text-purple-600">{new Set(services.map(s => s.role)).size}</p>
//         </div>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-wrap items-center gap-3 mb-6">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by name, address or phone..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
//           />
//         </div>

//         <select 
//           value={roleFilter} 
//           onChange={(e) => setRoleFilter(e.target.value)}
//           className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
//         >
//           <option value="">All Roles</option>
//           {rolesList.map(role => (
//             <option key={role} value={role}>{role}</option>
//           ))}
//         </select>

//         <select 
//           value={statusFilter} 
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
//         >
//           <option value="">All Status</option>
//           <option value="Available">Available</option>
//           <option value="Busy">Busy</option>
//         </select>

//         <button 
//           onClick={() => setShowFilters(!showFilters)}
//           className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
//         >
//           <Filter className="w-4 h-4" />
//           More Filters
//           <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
//         </button>

//         {(search || roleFilter || statusFilter) && (
//           <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl">
//             <X className="w-3 h-3" />
//             Clear
//           </button>
//         )}
//       </div>

//       {/* More Filters Panel */}
//       {showFilters && (
//         <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Has Secondary Mobile</label>
//               <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
//                 <option>Any</option>
//                 <option>Has Secondary Number</option>
//                 <option>No Secondary Number</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="border border-slate-200 rounded-2xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/60">
//                 <th className="w-10 px-4 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedIds.length === paginatedServices.length && paginatedServices.length > 0}
//                     onChange={toggleSelectAll}
//                     className="rounded border-slate-300 text-blue-600 cursor-pointer"
//                   />
//                 </th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Provider Name</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Address</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {paginatedServices.map((service) => (
//                 <tr key={service.id} className="hover:bg-slate-50/50">
//                   <td className="px-4 py-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedIds.includes(service.id)}
//                       onChange={() => toggleSelect(service.id)}
//                       className="rounded border-slate-300 text-blue-600 cursor-pointer"
//                     />
//                   </td>
//                   <td className="px-4 py-4">
//                     <RoleBadge role={service.role} />
//                   </td>
//                   <td className="px-4 py-4">
//                     <p className="font-semibold text-slate-800">{service.providerName}</p>
//                   </td>
//                   <td className="px-4 py-4">
//                     <p className="text-slate-600 text-xs max-w-[200px] truncate">{service.address}</p>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-1.5 text-slate-600 text-xs">
//                         <Phone className="w-3 h-3" />
//                         <a href={`tel:${service.primaryMobile}`} className="hover:text-blue-600">{service.primaryMobile}</a>
//                       </div>
//                       {service.secondaryMobile && (
//                         <div className="flex items-center gap-1.5 text-slate-400 text-xs">
//                           <Phone className="w-3 h-3" />
//                           <span>{service.secondaryMobile}</span>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <button onClick={() => handleToggleStatus(service.id)} className="cursor-pointer">
//                       <StatusBadge status={service.status} />
//                     </button>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center justify-center gap-1">
//                       <button onClick={() => handleEdit(service)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
//                         <Pencil className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => setServiceToDelete(service.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer">
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white gap-4">
//           <div className="flex items-center gap-2 text-sm text-slate-500">
//             <span>Rows per page:</span>
//             <select 
//               value={rowsPerPage} 
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer"
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//             <span className="ml-2">
//               Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredServices.length)} of {filteredServices.length} providers
//             </span>
//           </div>
//           <div className="flex items-center gap-1">
//             <button
//               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               disabled={currentPage === 1}
//               className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
//             >
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             {[...Array(Math.min(5, totalPages))].map((_, i) => {
//               let pageNum;
//               if (totalPages <= 5) pageNum = i + 1;
//               else if (currentPage <= 3) pageNum = i + 1;
//               else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
//               else pageNum = currentPage - 2 + i;
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${
//                     currentPage === pageNum
//                       ? "bg-blue-600 text-white"
//                       : "text-slate-600 hover:bg-slate-100"
//                   }`}
//                 >
//                   {pageNum}
//                 </button>
//               );
//             })}
//             <button
//               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               disabled={currentPage === totalPages}
//               className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
//             >
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UtilityServicesTab;