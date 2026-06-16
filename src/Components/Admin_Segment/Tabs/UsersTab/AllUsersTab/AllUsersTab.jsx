// src/Tabs/UsersTab/AllUsersTab.jsx
import React, { useState } from "react";
import {
    Search, ChevronDown, ChevronLeft, ChevronRight,
    Eye, CheckCircle, Ban, Trash2, Shield, UserCheck,
    Mail, Phone, MapPin, MoreVertical, Filter, X, Download,
    Building2Icon,Home
} from "lucide-react";

// Demo User Data
const mockUsers = [
    {
        id: 1,
        name: "Rajesh Sharma",
        email: "rajesh.sharma@example.com",
        phone: "+91 98765 43210",
        role: "Admin",
        verified: true,
        status: "active",
        joinedDate: "2024-01-15",
        propertiesCount: 24,
        location: "Mumbai, Maharashtra",
        avatar: "https://ui-avatars.com/api/?name=Rajesh+Sharma&background=1E40AF&color=fff",
    },
    {
        id: 2,
        name: "Priya Patel",
        email: "priya.patel@example.com",
        phone: "+91 98765 43211",
        role: "Agent",
        verified: true,
        status: "active",
        joinedDate: "2024-02-20",
        propertiesCount: 12,
        location: "Ahmedabad, Gujarat",
        avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=7C3AED&color=fff",
    },
    {
        id: 3,
        name: "Amit Kumar",
        email: "amit.kumar@example.com",
        phone: "+91 98765 43212",
        role: "User",
        verified: false,
        status: "pending",
        joinedDate: "2024-03-10",
        propertiesCount: 0,
        location: "Delhi NCR",
        avatar: "https://ui-avatars.com/api/?name=Amit+Kumar&background=EA580C&color=fff",
    },
    {
        id: 4,
        name: "Neha Singh",
        email: "neha.singh@example.com",
        phone: "+91 98765 43213",
        role: "Agent",
        verified: true,
        status: "active",
        joinedDate: "2024-01-05",
        propertiesCount: 18,
        location: "Bangalore, Karnataka",
        avatar: "https://ui-avatars.com/api/?name=Neha+Singh&background=0891B2&color=fff",
    },
    {
        id: 5,
        name: "Vikram Mehta",
        email: "vikram.mehta@example.com",
        phone: "+91 98765 43214",
        role: "User",
        verified: false,
        status: "inactive",
        joinedDate: "2024-02-28",
        propertiesCount: 3,
        location: "Pune, Maharashtra",
        avatar: "https://ui-avatars.com/api/?name=Vikram+Mehta&background=B45309&color=fff",
    },
    {
        id: 6,
        name: "Anjali Desai",
        email: "anjali.desai@example.com",
        phone: "+91 98765 43215",
        role: "Agent",
        verified: true,
        status: "active",
        joinedDate: "2024-01-20",
        propertiesCount: 9,
        location: "Surat, Gujarat",
        avatar: "https://ui-avatars.com/api/?name=Anjali+Desai&background=0D9488&color=fff",
    },
    {
        id: 7,
        name: "Suresh Reddy",
        email: "suresh.reddy@example.com",
        phone: "+91 98765 43216",
        role: "User",
        verified: true,
        status: "active",
        joinedDate: "2024-03-01",
        propertiesCount: 2,
        location: "Hyderabad, Telangana",
        avatar: "https://ui-avatars.com/api/?name=Suresh+Reddy&background=4F46E5&color=fff",
    },
    {
        id: 8,
        name: "Kavita Joshi",
        email: "kavita.joshi@example.com",
        phone: "+91 98765 43217",
        role: "User",
        verified: false,
        status: "pending",
        joinedDate: "2024-03-15",
        propertiesCount: 0,
        location: "Jaipur, Rajasthan",
        avatar: "https://ui-avatars.com/api/?name=Kavita+Joshi&background=DC2626&color=fff",
    },
    {
        id: 9,
        name: "Rahul Verma",
        email: "rahul.verma@example.com",
        phone: "+91 98765 43218",
        role: "Agent",
        verified: true,
        status: "active",
        joinedDate: "2024-02-10",
        propertiesCount: 15,
        location: "Lucknow, Uttar Pradesh",
        avatar: "https://ui-avatars.com/api/?name=Rahul+Verma&background=059669&color=fff",
    },
    {
        id: 10,
        name: "Pooja Yadav",
        email: "pooja.yadav@example.com",
        phone: "+91 98765 43219",
        role: "User",
        verified: false,
        status: "pending",
        joinedDate: "2024-03-18",
        propertiesCount: 0,
        location: "Patna, Bihar",
        avatar: "https://ui-avatars.com/api/?name=Pooja+Yadav&background=D97706&color=fff",
    },
];

const RoleBadge = ({ role }) => {
    const styles = {
        Admin: "bg-purple-100 text-purple-700 border-purple-200",
        Agent: "bg-blue-100 text-blue-700 border-blue-200",
        User: "bg-green-100 text-green-700 border-green-200",
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[role] || styles.User}`}>
            {role}
        </span>
    );
};

const StatusBadge = ({ status, verified }) => {
    if (status === "active" && verified) {
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>;
    }
    if (status === "pending" || !verified) {
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>;
    }
    if (status === "inactive") {
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">Inactive</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Verified</span>;
};

const AllUsersTab = () => {
    const [users, setUsers] = useState(mockUsers);
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showVerifyModal, setShowVerifyModal] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch = search === "" ||
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.includes(search);
        const matchesRole = roleFilter === "" || user.role === roleFilter;
        const matchesStatus = statusFilter === "" || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Handlers
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedUsers.map((u) => u.id));
        }
    };

    const handleVerify = (id) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === id ? { ...user, verified: true, status: "active" } : user
            )
        );
        setShowVerifyModal(null);
    };

    const handleSuspend = (id) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === id
                    ? { ...user, status: user.status === "active" ? "inactive" : "active" }
                    : user
            )
        );
    };

    const handleDelete = (id) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        setSelectedIds((prev) => prev.filter((uid) => uid !== id));
        setUserToDelete(null);
    };

    const handleBulkAction = (action) => {
        if (action === "verify") {
            setUsers((prev) =>
                prev.map((user) =>
                    selectedIds.includes(user.id) ? { ...user, verified: true, status: "active" } : user
                )
            );
        } else if (action === "suspend") {
            setUsers((prev) =>
                prev.map((user) =>
                    selectedIds.includes(user.id)
                        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
                        : user
                )
            );
        } else if (action === "delete") {
            setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)));
        }
        setSelectedIds([]);
    };

    const clearFilters = () => {
        setSearch("");
        setRoleFilter("");
        setStatusFilter("");
        setCurrentPage(1);
    };

    const DeleteConfirmModal = () => {
        if (!userToDelete) return null;
        const user = users.find((u) => u.id === userToDelete);
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Delete User</h3>
                    <p className="text-slate-600 mb-6">
                        Are you sure you want to delete <span className="font-semibold">{user?.name}</span>?
                        This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setUserToDelete(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={() => handleDelete(userToDelete)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const VerifyConfirmModal = () => {
        if (!showVerifyModal) return null;
        const user = users.find((u) => u.id === showVerifyModal);
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Verify User</h3>
                            <p className="text-slate-500 text-sm">Verify KYC documents for {user?.name}</p>
                        </div>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Aadhaar Card</span>
                            <button className="text-blue-600 text-sm font-semibold">View</button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">PAN Card</span>
                            <button className="text-blue-600 text-sm font-semibold">View</button>
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => setShowVerifyModal(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer">
                            Cancel
                        </button>
                        <button onClick={() => handleVerify(showVerifyModal)} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer">
                            Verify User
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <DeleteConfirmModal />
            <VerifyConfirmModal />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">User Management</h2>
                    <p className="text-sm text-slate-500 mt-1">Manage all registered users and their KYC status</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer">
                    <UserCheck className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4">
                    <span className="text-sm text-blue-700 font-medium">
                        {selectedIds.length} user{selectedIds.length > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleBulkAction("verify")} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 cursor-pointer">
                            Verify Selected
                        </button>
                        <button onClick={() => handleBulkAction("suspend")} className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 cursor-pointer">
                            Suspend Selected
                        </button>
                        <button onClick={() => handleBulkAction("delete")} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer">
                            Delete Selected
                        </button>
                    </div>
                </div>
            )}

            {/* Search + Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
                >
                    <option value="">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Agent">Agent</option>
                    <option value="User">User</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                </select>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
                >
                    <Filter className="w-4 h-4" />
                    More Filters
                    <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </button>

                {(search || roleFilter || statusFilter) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                    >
                        <X className="w-3 h-3" />
                        Clear
                    </button>
                )}
            </div>

            {/* More Filters Panel */}
            {showFilters && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Join Date</label>
                        <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>Last 3 months</option>
                            <option>Last 6 months</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Properties Count</label>
                        <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                            <option>Any</option>
                            <option>0 properties</option>
                            <option>1-5 properties</option>
                            <option>6-10 properties</option>
                            <option>10+ properties</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Verification Status</label>
                        <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                            <option>Any</option>
                            <option>Verified Only</option>
                            <option>Unverified Only</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/60">
                                <th className="w-10 px-4 py-3 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-slate-300 text-blue-600 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Properties</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user.id)}
                                            onChange={() => toggleSelect(user.id)}
                                            className="rounded border-slate-300 text-blue-600 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-400">ID: USR{String(user.id).padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                <Mail className="w-3 h-3 shrink-0" />
                                                <span className="truncate max-w-[150px]">{user.email}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                                                <Phone className="w-3 h-3 shrink-0" />
                                                {user.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                            <MapPin className="w-3 h-3 shrink-0" />
                                            <span className="truncate max-w-[120px]">{user.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="font-semibold text-slate-800">{user.propertiesCount}</span>
                                        <span className="text-slate-400 text-xs ml-1">listings</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={user.status} verified={user.verified} />
                                            {!user.verified && user.status === "pending" && (
                                                <button
                                                    onClick={() => setShowVerifyModal(user.id)}
                                                    className="p-1 rounded-lg text-yellow-600 hover:bg-yellow-50 cursor-pointer"
                                                    title="Verify KYC"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer" title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleSuspend(user.id)}
                                                className={`p-1.5 rounded-lg cursor-pointer ${user.status === "active"
                                                        ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                                                        : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                                                    }`}
                                                title={user.status === "active" ? "Suspend User" : "Activate User"}
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setUserToDelete(user.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                                                <MoreVertical className="w-4 h-4" />
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
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="ml-2">
                            Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium cursor-pointer ${currentPage === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Total Users</p>
                            <p className="text-2xl font-bold text-slate-800">{users.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Active Agents</p>
                            <p className="text-2xl font-bold text-slate-800">{users.filter(u => u.role === "Agent" && u.status === "active").length}</p>
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Pending Verification</p>
                            <p className="text-2xl font-bold text-slate-800">{users.filter(u => !u.verified).length}</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs uppercase font-semibold">Total Properties</p>
                            <p className="text-2xl font-bold text-slate-800">{users.reduce((sum, u) => sum + u.propertiesCount, 0)}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Home className="w-5 h-5 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AllUsersTab;