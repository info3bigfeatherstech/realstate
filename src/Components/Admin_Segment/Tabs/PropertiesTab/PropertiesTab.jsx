// src/tabs/PropertiesTab.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Eye, Plus, Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const mockProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&h=60&fit=crop",
    title: "Skyline 2BHK Flat",
    listingType: ["For Sale"],
    propertyType: "Apartment",
    price: "₹75 Lakhs",
    location: "Andheri East",
    status: "Active",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=80&h=60&fit=crop",
    title: "Luxury 4BHK Villa",
    listingType: ["For Sale", "For Rent"],
    propertyType: "Villa",
    price: "₹2.5 Lakhs/mo",
    location: "Bandra West",
    status: "Active",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=80&h=60&fit=crop",
    title: "Commercial Tech Hub",
    listingType: ["For Sale"],
    propertyType: "Commercial",
    price: "₹4.2 Cr",
    location: "Goregaon West",
    status: "Pending",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&h=60&fit=crop",
    title: "Studio Apartment DLF",
    listingType: ["For Rent"],
    propertyType: "Apartment",
    price: "₹35,000/mo",
    location: "Gurugram",
    status: "Active",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&h=60&fit=crop",
    title: "Garden View Bungalow",
    listingType: ["For Sale"],
    propertyType: "Bungalow",
    price: "₹1.8 Cr",
    location: "Powai",
    status: "Inactive",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Inactive: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-500"}`}>
      {status}
    </span>
  );
};

const ListingBadge = ({ type }) => {
  const isSale = type === "For Sale";
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isSale ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
      {type}
    </span>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer ${checked ? "bg-green-500" : "bg-gray-300"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
    />
  </button>
);

const PropertiesTab = () => {
  const [, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState(mockProperties);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const toggleStatus = (id) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
          : p
      )
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === properties.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(properties.map((p) => p.id));
    }
  };

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(156 / rowsPerPage));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Property Listings</h2>
        <button onClick={() => setSearchParams({ tab: "add-property" })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Property
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-slate-700 placeholder-slate-400"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer">
          Filter by Type
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === properties.length && properties.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-20">Image</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">Title <ChevronDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Listing Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Property Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1">Price <ChevronDown className="w-3 h-3" /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(prop.id)}
                      onChange={() => toggleSelect(prop.id)}
                      className="rounded border-slate-300 text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-16 h-12 object-cover rounded-lg border border-slate-100"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-800">{prop.title}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {prop.listingType.map((t) => (
                        <ListingBadge key={t} type={t} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{prop.propertyType}</td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{prop.price}</td>
                  <td className="px-4 py-4 text-slate-600">{prop.location}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Toggle
                        checked={prop.status === "Active"}
                        onChange={() => toggleStatus(prop.id)}
                      />
                      <StatusBadge status={prop.status} />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSearchParams({ tab: "edit-property", id: String(prop.id) })} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSearchParams({ tab: "property-detail", id: String(prop.id) })} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Rows per page:</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1 text-sm text-slate-600 bg-white focus:outline-none cursor-pointer">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="ml-2">Showing 1–10 of 156 properties</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-slate-400 text-sm">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === totalPages
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
                }`}
            >
              {totalPages}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;