// src/Tabs/UsersTab/VerifiedUsersTab.jsx
import React, { useState } from "react";
import {
  Search, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Ban, Trash2, Mail, Phone, MapPin, MoreVertical, Loader2, Shield, UserCheck, Home
} from "lucide-react";
import {
  useGetCustomersQuery,
  useGetCustomerStatsQuery,
  useUpdateCustomerStatusMutation,
} from "../../../Admin_Redux/CustomerApi/customerAdminApi";
import { toast } from "../../../../Shared/ToastConfig";

// Role Badge Component
const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    agent: "bg-blue-100 text-blue-700 border-blue-200",
    seeker: "bg-green-100 text-green-700 border-green-200",
    owner: "bg-orange-100 text-orange-700 border-orange-200",
  };
  const roleLabels = {
    admin: "Admin",
    agent: "Agent",
    seeker: "Seeker",
    owner: "Owner"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${styles[role] || styles.seeker}`}>
      {roleLabels[role] || role}
    </span>
  );
};

const VerifiedUsersTab = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userToDelete, setUserToDelete] = useState(null);

  // API Hooks
  const { data: statsData, isLoading: statsLoading } = useGetCustomerStatsQuery();
  const { data, isLoading, refetch } = useGetCustomersQuery({
    page: currentPage,
    limit: rowsPerPage,
    search: search || undefined,
    accountType: roleFilter || undefined,
    emailVerified: true, // Only verified users
    isActive: true, // Only active users
  });
  const [updateStatus] = useUpdateCustomerStatusMutation();

  // Extract data
  const customers = data?.customers || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const stats = statsData || { totalCustomers: 0, verifiedActive: 0 };

  // Handle Status Toggle (Activate/Suspend)
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? false : true;
      await updateStatus({ id, isActive: newStatus }).unwrap();
      toast.success(`User ${newStatus ? 'activated' : 'suspended'} successfully`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  // Handle Delete (Disabled - Future)
  const handleDelete = (id) => {
    toast.info("Delete functionality coming soon");
    setUserToDelete(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading verified users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Verified Users</h2>
        <p className="text-sm text-slate-500 mt-1">Users with completed KYC verification</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="seeker">Seeker</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-700 text-xs uppercase font-semibold">Total Verified</p>
          <p className="text-2xl font-bold text-green-800">{stats.verifiedActive || 0}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-700 text-xs uppercase font-semibold">Verified Agents</p>
          <p className="text-2xl font-bold text-blue-800">
            {customers.filter(u => u.accountType === "agent").length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-purple-700 text-xs uppercase font-semibold">Total Listings</p>
          <p className="text-2xl font-bold text-purple-800">0</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
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
              {customers.map((user) => {
                const userStatus = user.isActive ? "active" : "inactive";

                return (
                  <tr key={user._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=1E40AF&color=fff`}
                          alt={user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{user.fullName}</p>
                          <p className="text-xs text-slate-400">ID: {user._id?.slice(-6) || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RoleBadge role={user.accountType} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <Phone className="w-3 h-3" />
                          {user.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <MapPin className="w-3 h-3" />
                        {user.location?.city || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-800">0</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${userStatus === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}>
                        {userStatus === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user._id, userStatus)}
                          className={`p-1.5 rounded-lg cursor-pointer ${userStatus === "active"
                              ? "text-slate-400 hover:text-orange-600 hover:bg-orange-50"
                              : "text-slate-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 gap-4">
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
              Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, meta.total)} of {meta.total} verified users
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
            {[...Array(Math.min(5, meta.totalPages || 1))].map((_, i) => {
              let pageNum;
              const totalPages = meta.totalPages || 1;
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
              onClick={() => setCurrentPage((p) => Math.min(meta.totalPages || 1, p + 1))}
              disabled={currentPage === (meta.totalPages || 1)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifiedUsersTab;

// dont user down code use upper code which is api loaded
// // src/Tabs/UsersTab/VerifiedUsersTab.jsx
// import React, { useState } from "react";
// import {
//   Search, ChevronDown, ChevronLeft, ChevronRight,
//   Eye, Ban, Trash2, Mail, Phone, MapPin, MoreVertical
// } from "lucide-react";

// // Sirf verified users ka demo data
// const verifiedUsers = [
//   {
//     id: 1,
//     name: "Rajesh Sharma",
//     email: "rajesh.sharma@example.com",
//     phone: "+91 98765 43210",
//     role: "Admin",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-01-15",
//     propertiesCount: 24,
//     location: "Mumbai, Maharashtra",
//     avatar: "https://ui-avatars.com/api/?name=Rajesh+Sharma&background=1E40AF&color=fff",
//   },
//   {
//     id: 2,
//     name: "Priya Patel",
//     email: "priya.patel@example.com",
//     phone: "+91 98765 43211",
//     role: "Agent",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-02-20",
//     propertiesCount: 12,
//     location: "Ahmedabad, Gujarat",
//     avatar: "https://ui-avatars.com/api/?name=Priya+Patel&background=7C3AED&color=fff",
//   },
//   {
//     id: 4,
//     name: "Neha Singh",
//     email: "neha.singh@example.com",
//     phone: "+91 98765 43213",
//     role: "Agent",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-01-05",
//     propertiesCount: 18,
//     location: "Bangalore, Karnataka",
//     avatar: "https://ui-avatars.com/api/?name=Neha+Singh&background=0891B2&color=fff",
//   },
//   {
//     id: 6,
//     name: "Anjali Desai",
//     email: "anjali.desai@example.com",
//     phone: "+91 98765 43215",
//     role: "Agent",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-01-20",
//     propertiesCount: 9,
//     location: "Surat, Gujarat",
//     avatar: "https://ui-avatars.com/api/?name=Anjali+Desai&background=0D9488&color=fff",
//   },
//   {
//     id: 7,
//     name: "Suresh Reddy",
//     email: "suresh.reddy@example.com",
//     phone: "+91 98765 43216",
//     role: "User",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-03-01",
//     propertiesCount: 2,
//     location: "Hyderabad, Telangana",
//     avatar: "https://ui-avatars.com/api/?name=Suresh+Reddy&background=4F46E5&color=fff",
//   },
//   {
//     id: 9,
//     name: "Rahul Verma",
//     email: "rahul.verma@example.com",
//     phone: "+91 98765 43218",
//     role: "Agent",
//     verified: true,
//     status: "active",
//     joinedDate: "2024-02-10",
//     propertiesCount: 15,
//     location: "Lucknow, Uttar Pradesh",
//     avatar: "https://ui-avatars.com/api/?name=Rahul+Verma&background=059669&color=fff",
//   },
// ];

// const RoleBadge = ({ role }) => {
//   const styles = {
//     Admin: "bg-purple-100 text-purple-700",
//     Agent: "bg-blue-100 text-blue-700",
//     User: "bg-green-100 text-green-700",
//   };
//   return (
//     <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${styles[role]}`}>
//       {role}
//     </span>
//   );
// };

// const VerifiedUsersTab = () => {
//   const [users, setUsers] = useState(verifiedUsers);
//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [userToDelete, setUserToDelete] = useState(null);

//   // Filter users
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch = search === "" ||
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase());
//     const matchesRole = roleFilter === "" || user.role === roleFilter;
//     return matchesSearch && matchesRole;
//   });

//   const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handleDelete = (id) => {
//     setUsers((prev) => prev.filter((user) => user.id !== id));
//     setUserToDelete(null);
//   };

//   const handleSuspend = (id) => {
//     setUsers((prev) =>
//       prev.map((user) =>
//         user.id === id
//           ? { ...user, status: user.status === "active" ? "inactive" : "active" }
//           : user
//       )
//     );
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-xl font-bold text-slate-800">Verified Users</h2>
//         <p className="text-sm text-slate-500 mt-1">Users with completed KYC verification</p>
//       </div>

//       {/* Search + Filters */}
//       <div className="flex flex-wrap items-center gap-3 mb-6">
//         <div className="relative flex-1 min-w-[200px] max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search verified users..."
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
//           <option value="Admin">Admin</option>
//           <option value="Agent">Agent</option>
//           <option value="User">User</option>
//         </select>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4">
//           <p className="text-green-700 text-xs uppercase font-semibold">Total Verified</p>
//           <p className="text-2xl font-bold text-green-800">{users.length}</p>
//         </div>
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//           <p className="text-blue-700 text-xs uppercase font-semibold">Verified Agents</p>
//           <p className="text-2xl font-bold text-blue-800">{users.filter(u => u.role === "Agent").length}</p>
//         </div>
//         <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
//           <p className="text-purple-700 text-xs uppercase font-semibold">Total Listings</p>
//           <p className="text-2xl font-bold text-purple-800">{users.reduce((sum, u) => sum + u.propertiesCount, 0)}</p>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="border border-slate-200 rounded-2xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b border-slate-100 bg-slate-50/60">
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Contact</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Properties</th>
//                 <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
//                 <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {paginatedUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-slate-50/50">
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-3">
//                       <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
//                       <div>
//                         <p className="font-semibold text-slate-800">{user.name}</p>
//                         <p className="text-xs text-slate-400">ID: USR{String(user.id).padStart(4, '0')}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <RoleBadge role={user.role} />
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="space-y-1">
//                       <div className="flex items-center gap-1.5 text-slate-600 text-xs">
//                         <Mail className="w-3 h-3" />
//                         {user.email}
//                       </div>
//                       <div className="flex items-center gap-1.5 text-slate-600 text-xs">
//                         <Phone className="w-3 h-3" />
//                         {user.phone}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center gap-1.5 text-slate-600 text-sm">
//                       <MapPin className="w-3 h-3" />
//                       {user.location}
//                     </div>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className="font-semibold text-slate-800">{user.propertiesCount}</span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                       user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
//                     }`}>
//                       {user.status === "active" ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4">
//                     <div className="flex items-center justify-center gap-1">
//                       <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleSuspend(user.id)}
//                         className="p-1.5 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
//                       >
//                         <Ban className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setUserToDelete(user.id)}
//                         className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                       <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-100 gap-4">
//           <div className="flex items-center gap-2 text-sm text-slate-500">
//             <span>Rows per page:</span>
//             <select
//               value={rowsPerPage}
//               onChange={(e) => setRowsPerPage(Number(e.target.value))}
//               className="border border-slate-200 rounded-lg px-2 py-1 text-sm bg-white cursor-pointer"
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//             <span>Showing {filteredUsers.length} verified users</span>
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

// export default VerifiedUsersTab;