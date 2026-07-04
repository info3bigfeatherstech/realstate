// src/Components/UserSide/Utilities/UtilityServices.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserEliteServicesQuery, useGetUserEliteServiceRolesQuery } from "../../../REDUX_FEATURES/REDUX_SLICES/userEliteServiceApi/userEliteServiceApi";
import {
  setPage,
  setSearch,
  setRole,
} from "../../../REDUX_FEATURES/REDUX_SLICES/userEliteServiceApi/userEliteServiceSlice";

// Available Filter Tabs — loaded dynamically from backend config
const formatRoleLabel = (role) => {
    if (role.endsWith("s") || role.endsWith("x") || role.endsWith("z") || role.endsWith("ch") || role.endsWith("sh")) {
        return `${role}es`;
    }
    if (role.endsWith("y") && !/[aeiou]y$/i.test(role)) {
        return `${role.slice(0, -1)}ies`;
    }
    return `${role}s`;
};

export default function Eliteservices() {
    const dispatch = useDispatch();

    const {
        page,
        limit,
        search,
        role,
        sortBy,
        sortOrder,
    } = useSelector((state) => state.userEliteService);

    // Local input value so we don't fire a request on every keystroke
    const [searchInput, setSearchInput] = useState(search);

    // Debounce search → dispatch to Redux (which triggers the query) after typing pauses
    useEffect(() => {
        const handle = setTimeout(() => {
            if (searchInput !== search) {
                dispatch(setSearch(searchInput));
            }
        }, 400);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const { data: roleOptions = [] } = useGetUserEliteServiceRolesQuery();
    const tabs = roleOptions.map((roleValue) => ({
        label: formatRoleLabel(roleValue),
        value: roleValue,
    }));

    const queryParams = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...(role && { role }),
    };

    // const { data, isLoading, isFetching, isError } = useGetUserEliteServicesQuery(queryParams);
    const { data, isLoading, isFetching, isError } = useGetUserEliteServicesQuery(queryParams, {
    pollingInterval: 300000, // 5 minutes
});

// The component will automatically refetch every 5 minutes

    const services = data?.data || [];
    const meta = data?.meta || { total: 0, page: 1, limit, totalPages: 1 };

    const activeTab = role || "";

    return (
        <section className="bg-white py-20 font-['satoshi'] text-[#111] min-h-screen">
            <div className="w-full px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
                
                {/* ─── HEADER SECTION ─── */}
                <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="mb-5 inline-flex items-center rounded-full border border-[#E0E0E0] px-4 py-[6px]">
                            <span className="text-[14px] font-medium text-[#555] tracking-wide uppercase">
                                Verified On-Demand Network
                            </span>
                        </div>
                        <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] tracking-[-1.5px] text-[#111] sm:text-[36px] lg:text-[42px]">
                            Professional Elite Services
                            <br />
                            & Household Experts.
                        </h1>
                        <p className="mt-4 text-[16px] text-[#666] leading-relaxed">
                            Find trusted, verified, and background-checked technicians around your premises. Direct call connectivity without any commission barriers or intermediaries.
                        </p>
                    </div>

                    {/* KEYWORD SEARCH INPUT FIELD */}
                    <div className="w-full md:w-auto min-w-[280px] md:min-w-[380px]">
                        <input
                            type="text"
                            placeholder="Search by area, skill, or provider name..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full rounded-full bg-[#F9F9F9] border border-[#E0E0E0] px-6 py-4 text-[14px] text-[#111] outline-none transition-all duration-300 focus:border-[#111] focus:bg-white"
                        />
                    </div>
                </div>

                {/* ─── DYNAMIC TABS FILTER COMPONENT ─── */}
                <div className="mb-10 flex flex-wrap items-center gap-2.5 border-b border-[#F0F0F0] pb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => dispatch(setRole(tab.value))}
                            className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-300 ${
                                activeTab === tab.value
                                    ? "bg-[#111] text-white shadow-md"
                                    : "bg-[#F5F5F5] text-[#555] hover:bg-[#EBEBEB] hover:text-[#111]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ─── LOADING STATE ─── */}
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center rounded-[32px] border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
                        <p className="text-[#8b95a7] text-[16px] font-semibold">Loading service providers...</p>
                    </div>
                ) : isError ? (
                    <div className="flex h-64 items-center justify-center rounded-[32px] border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
                        <p className="text-[#8b95a7] text-[16px] font-semibold">
                            Something went wrong while loading services. Please try again.
                        </p>
                    </div>
                ) : services.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-[32px] border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
                        <p className="text-[#8b95a7] text-[16px] font-semibold">
                            No registered {activeTab ? activeTab.toLowerCase() : "utility"} services found matching your criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* ─── TABLE CONTAINER ─── */}
                        <div className="w-full overflow-x-auto rounded-2xl border border-[#E8E8E8] shadow-sm">
                            <table className="w-full min-w-[900px] text-left border-collapse bg-white">
                                <thead>
                                    <tr className="bg-[#F9F9F9] border-b border-[#E8E8E8]">
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Role</th>
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Specialist Name</th>
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Shop Address</th>
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Status</th>
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Call / WhatsApp No.</th>
                                        <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Alternative No.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E8E8E8]">
                                    {services.map((utility) => (
                                        <tr key={utility._id} className="transition-colors duration-200 hover:bg-[#FAFABA]/30">
                                            
                                            {/* Role Column */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="inline-block text-[12px] font-bold tracking-wider text-black uppercase bg-[#F5F5F5] border border-[#E4E7EC] rounded-full px-3 py-1">
                                                    {utility.role}
                                                </span>
                                            </td>

                                            {/* Provider Name Column */}
                                            <td className="px-6 py-5 whitespace-nowrap text-[16px] font-bold text-[#111]">
                                                {utility.providerName}
                                            </td>

                                            {/* Address Column */}
                                            <td className="px-6 py-5 max-w-[350px]">
                                                <p className="text-[14px] font-medium text-[#555] line-clamp-2 leading-relaxed">
                                                    {utility.address}
                                                </p>
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`h-2 w-2 rounded-full ${utility.status === "Available" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                    <span className="text-[13px] font-bold text-[#555]">{utility.status}</span>
                                                </div>
                                            </td>

                                            {/* Primary Mobile Column */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <a 
                                                    href={`tel:${utility.primaryMobile}`}
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#081630] px-4 py-2 text-white font-semibold text-[13px] tracking-wide transition-colors duration-200 hover:bg-[#111]"
                                                >
                                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{utility.primaryMobile}</span>
                                                </a>
                                            </td>

                                            {/* Secondary Mobile Column */}
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                {utility.secondaryMobile ? (
                                                    <a 
                                                        href={`tel:${utility.secondaryMobile}`}
                                                        className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E0E0E0] px-4 py-2 text-[#081630] font-bold text-[13px] transition-all duration-200 hover:border-[#111] hover:bg-[#F9F9F9]"
                                                    >
                                                        <svg className="w-3.5 h-3.5 text-[#8b95a7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                        <span>{utility.secondaryMobile}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[12px] italic text-[#8b95a7] font-medium px-2 select-none">
                                                        Not Configured
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ─── PAGINATION ─── */}
                        {meta.totalPages > 1 && (
                            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                                <p className="text-[14px] text-[#666] font-medium">
                                    Showing{" "}
                                    {Math.min((meta.page - 1) * meta.limit + 1, meta.total)}–
                                    {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} providers
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
                                        disabled={page === 1 || isFetching}
                                        className="rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#555] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-[13px] font-semibold text-[#111]">
                                        Page {meta.page} of {meta.totalPages}
                                    </span>
                                    <button
                                        onClick={() => dispatch(setPage(Math.min(meta.totalPages, page + 1)))}
                                        disabled={page === meta.totalPages || isFetching}
                                        className="rounded-full border border-[#E0E0E0] px-4 py-2 text-[13px] font-semibold text-[#555] hover:bg-[#F5F5F5] disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

            </div>
        </section>
    );
}

// use upper code which is api loaded 
// // src/Components/UserSide/Utilities/UtilityServices.jsx
// import React, { useState } from "react";

// // Premium Multi-Role Utility Hub Mock Data (Cleaned & Filtered)
// const utilitiesData = [
//     {
//         id: 1,
//         role: "Plumber",
//         providerName: "Rajesh Kumar",
//         address: "Shop No. 14, Central Market, Block B, Sector 62, Noida",
//         primaryMobile: "+919873085801",
//         secondaryMobile: "+919289684801",
//         status: "Available"
//     },
//     {
//         id: 2,
//         role: "Electrician",
//         providerName: "Vikram Singh",
//         address: "G-42, Ground Floor, Galleria Market, DLF Phase 4, Gurugram",
//         primaryMobile: "+919289684801",
//         secondaryMobile: "",
//         status: "Available"
//     },
//     {
//         id: 3,
//         role: "Carpenter",
//         providerName: "Amit Sharma",
//         address: "Metro Pillar 485, Main Road, Laxmi Nagar, New Delhi",
//         primaryMobile: "+919873085801",
//         secondaryMobile: "+919555123456",
//         status: "Busy"
//     },
//     {
//         id: 4,
//         role: "Painter",
//         providerName: "Sanjay Dutt",
//         address: "Plot 102, Near Community Center, Sector 15, Faridabad",
//         primaryMobile: "+919311223344",
//         secondaryMobile: "+919873085801",
//         status: "Available"
//     },
//     {
//         id: 5,
//         role: "Electrician",
//         providerName: "Anil Kapoor",
//         address: "Shop 4, Wave City Center, Sector 32, Noida",
//         primaryMobile: "+919999888777",
//         secondaryMobile: "",
//         status: "Available"
//     },
//     {
//         id: 6,
//         role: "Plumber",
//         providerName: "Manoj Tiwari",
//         address: "K-12, Connaught Place, Near Rajiv Chowk, New Delhi",
//         primaryMobile: "+919111222333",
//         secondaryMobile: "+919444555666",
//         status: "Available"
//     }
// ];

// // Available Filter Tabs Configuration
// const tabs = [
//     { label: "All Services", value: "All" },
//     { label: "Plumbers", value: "Plumber" },
//     { label: "Electricians", value: "Electrician" },
//     { label: "Carpenters", value: "Carpenter" },
//     { label: "Painters", value: "Painter" }
// ];

// export default function Eliteservices() {
//     const [activeTab, setActiveTab] = useState("All");
//     const [searchTerm, setSearchTerm] = useState("");

//     // Multi-tier filtering mechanism (Validates both Tab selection and Search text)
//     const filteredUtilities = utilitiesData.filter(item => {
//         const matchesTab = activeTab === "All" || item.role === activeTab;
//         const matchesSearch = 
//             item.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             item.role.toLowerCase().includes(searchTerm.toLowerCase());
            
//         return matchesTab && matchesSearch;
//     });

//     return (
//         <section className="bg-white py-20 font-['satoshi'] text-[#111] min-h-screen">
//             <div className="w-full px-5 md:px-10 lg:px-16 max-w-[1440px] mx-auto">
                
//                 {/* ─── HEADER SECTION ─── */}
//                 <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
//                     <div className="max-w-2xl">
//                         <div className="mb-5 inline-flex items-center rounded-full border border-[#E0E0E0] px-4 py-[6px]">
//                             <span className="text-[14px] font-medium text-[#555] tracking-wide uppercase">
//                                 Verified On-Demand Network
//                             </span>
//                         </div>
//                         <h1 className="text-[clamp(28px,4vw,42px)] leading-[1.05] tracking-[-1.5px] text-[#111] sm:text-[36px] lg:text-[42px]">
//                             Professional Elite Services
//                             <br />
//                             & Household Experts.
//                         </h1>
//                         <p className="mt-4 text-[16px] text-[#666] leading-relaxed">
//                             Find trusted, verified, and background-checked technicians around your premises. Direct call connectivity without any commission barriers or intermediaries.
//                         </p>
//                     </div>

//                     {/* KEYWORD SEARCH INPUT FIELD */}
//                     <div className="w-full md:w-auto min-w-[280px] md:min-w-[380px]">
//                         <input
//                             type="text"
//                             placeholder="Search by area, skill, or provider name..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full rounded-full bg-[#F9F9F9] border border-[#E0E0E0] px-6 py-4 text-[14px] text-[#111] outline-none transition-all duration-300 focus:border-[#111] focus:bg-white"
//                         />
//                     </div>
//                 </div>

//                 {/* ─── DYNAMIC TABS FILTER COMPONENT ─── */}
//                 <div className="mb-10 flex flex-wrap items-center gap-2.5 border-b border-[#F0F0F0] pb-6">
//                     {tabs.map((tab) => (
//                         <button
//                             key={tab.value}
//                             onClick={() => setActiveTab(tab.value)}
//                             className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-all duration-300 ${
//                                 activeTab === tab.value
//                                     ? "bg-[#111] text-white shadow-md"
//                                     : "bg-[#F5F5F5] text-[#555] hover:bg-[#EBEBEB] hover:text-[#111]"
//                             }`}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* ─── CLEANED TABLE CONTAINER ─── */}
//                 {filteredUtilities.length === 0 ? (
//                     <div className="flex h-64 flex-col items-center justify-center rounded-[32px] border border-dashed border-[#E0E0E0] bg-[#FAFAFA]">
//                         <p className="text-[#8b95a7] text-[16px] font-semibold">
//                             No registered {activeTab !== "All" ? activeTab.toLowerCase() : "utility"} services found matching your criteria.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="w-full overflow-x-auto rounded-2xl border border-[#E8E8E8] shadow-sm">
//                         <table className="w-full min-w-[900px] text-left border-collapse bg-white">
//                             <thead>
//                                 <tr className="bg-[#F9F9F9] border-b border-[#E8E8E8]">
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Role</th>
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Specialist Name</th>
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Address</th>
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Status</th>
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Call / WhatsApp No.</th>
//                                     <th className="px-6 py-4 text-[14px] font-bold uppercase tracking-wider text-[#555]">Alternative No.</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-[#E8E8E8]">
//                                 {filteredUtilities.map((utility) => (
//                                     <tr key={utility.id} className="transition-colors duration-200 hover:bg-[#FAFABA]/30">
                                        
//                                         {/* Role Column */}
//                                         <td className="px-6 py-5 whitespace-nowrap">
//                                             <span className="inline-block text-[12px] font-bold tracking-wider text-black uppercase bg-[#F5F5F5] border border-[#E4E7EC] rounded-full px-3 py-1">
//                                                 {utility.role}
//                                             </span>
//                                         </td>

//                                         {/* Provider Name Column */}
//                                         <td className="px-6 py-5 whitespace-nowrap text-[16px] font-bold text-[#111]">
//                                             {utility.providerName}
//                                         </td>

//                                         {/* Address Column */}
//                                         <td className="px-6 py-5 max-w-[350px]">
//                                             <p className="text-[14px] font-medium text-[#555] line-clamp-2 leading-relaxed">
//                                                 {utility.address}
//                                             </p>
//                                         </td>

//                                         {/* Status Column */}
//                                         <td className="px-6 py-5 whitespace-nowrap">
//                                             <div className="flex items-center gap-1.5">
//                                                 <span className={`h-2 w-2 rounded-full ${utility.status === "Available" ? "bg-emerald-500" : "bg-amber-500"}`} />
//                                                 <span className="text-[13px] font-bold text-[#555]">{utility.status}</span>
//                                             </div>
//                                         </td>

//                                         {/* Primary Mobile Column */}
//                                         <td className="px-6 py-5 whitespace-nowrap">
//                                             <a 
//                                                 href={`tel:${utility.primaryMobile}`}
//                                                 className="inline-flex items-center gap-2 rounded-full bg-[#081630] px-4 py-2 text-white font-semibold text-[13px] tracking-wide transition-colors duration-200 hover:bg-[#111]"
//                                             >
//                                                 <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                                 </svg>
//                                                 <span>{utility.primaryMobile}</span>
//                                             </a>
//                                         </td>

//                                         {/* Secondary Mobile Column */}
//                                         <td className="px-6 py-5 whitespace-nowrap">
//                                             {utility.secondaryMobile ? (
//                                                 <a 
//                                                     href={`tel:${utility.secondaryMobile}`}
//                                                     className="inline-flex items-center gap-2 rounded-full bg-white border border-[#E0E0E0] px-4 py-2 text-[#081630] font-bold text-[13px] transition-all duration-200 hover:border-[#111] hover:bg-[#F9F9F9]"
//                                                 >
//                                                     <svg className="w-3.5 h-3.5 text-[#8b95a7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//                                                         <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                                     </svg>
//                                                     <span>{utility.secondaryMobile}</span>
//                                                 </a>
//                                             ) : (
//                                                 <span className="text-[12px] italic text-[#8b95a7] font-medium px-2 select-none">
//                                                     Not Configured
//                                                 </span>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//             </div>
//         </section>
//     );
// }