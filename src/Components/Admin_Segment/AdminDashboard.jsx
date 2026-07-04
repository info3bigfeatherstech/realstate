// src/AdminDashboard.jsx
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TAB_REGISTRY } from "./TabRegistry";
import { ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from "./roles";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";
import LOGO from "../../assets/logoinh.png";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const user = useSelector((state) => state.auth.user);

  const activeRole = user?.role || ROLES.AGENT;
  const allowedTabIds = ROLE_PERMISSIONS[activeRole] || [];
  const allowedTabs = TAB_REGISTRY.filter((tab) => allowedTabIds.includes(tab.id));
  const defaultTab = allowedTabs[0]?.id || "properties";

  // Derive active tab from URL query params: ?tab=properties
  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl && allowedTabIds.includes(tabFromUrl) ? tabFromUrl : defaultTab;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [expandedTab, setExpandedTab] = useState(null);
  const [expandedTab, setExpandedTab] = useState(() => {
    const initialTab = allowedTabs.find((t) => t.id === activeTab);
    return initialTab?.subTabs?.length ? initialTab.id : null;
  });

  // Keep URL parameters synchronized with active state
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (!urlTab || !allowedTabIds.includes(urlTab)) {
      setSearchParams({ tab: defaultTab }, { replace: true });
    }
  }, [activeRole, searchParams, setSearchParams, allowedTabIds, defaultTab]);

  const handleTabClick = (tabId) => {
    const targetTab = TAB_REGISTRY.find((t) => t.id === tabId);
    if (targetTab?.subTabs?.length > 0) {
      setExpandedTab(expandedTab === tabId ? null : tabId);
      const firstSub = targetTab.subTabs[0]?.id;
      setSearchParams({ tab: tabId, ...(firstSub ? { ctab: firstSub } : {}) });
    } else {
      setSearchParams({ tab: tabId });
    }
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      // Even if backend logout fails (e.g. token already expired),
      // proceed to clear local state and redirect.
      console.error("Logout API error:", err);
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  const activeTabConfig = allowedTabs.find((t) => t.id === activeTab);
  const TabComponent = activeTabConfig?.component ?? null;

  if (!user) {
    return null; // ProtectedRoute / App bootstrap should prevent this, but guard anyway
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fully Immersed Premium Dark UI */}
      <aside className={`
        fixed md:sticky top-0 h-screen z-40 md:z-20
        w-64 bg-slate-950 border-r border-slate-900 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo and Profile Header Section */}
        <div className="w-full pt pb-6 px-4 border-b border-slate-900 flex flex-col items-center">
          {/* Widely Scaled Corporate Logo Container */}
          <div className="w-full h-[150px] flex items-center justify-center mb- overflow-hidden">
            <img 
              src={LOGO} 
              alt="Mehta Estates Logo" 
              className="w-full h-full object-contain scale-125 filter drop-shadow-md transition-transform duration-300 hover:scale-130" 
            />
          </div>
          
          {/* User Profile Info Unit */}
          <div className="w-full text-center mt-1 bg-slate-900/60 py-3 px-2 rounded-2xl border border-slate-800/50">
            <h1 className="font-bold text-white tracking-tight text-base">{user.name}</h1>
            <span className="inline-block text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-1 bg-blue-950 border border-blue-900 px-3 py-0.5 rounded-full">
              {ROLE_LABELS[activeRole]}
            </span>
          </div>
        </div>

        {/* Navigation list - White Text by Default */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {allowedTabs.filter((t) => !t.hideInSidebar).map((tab) => {
            const isActive = activeTab === tab.id;
            const hasSubTabs = tab.subTabs && tab.subTabs.length > 0;
            // const isExpanded = expandedTab === tab.id || (isActive && hasSubTabs);
            const isExpanded = expandedTab === tab.id;

            return (
              <div key={tab.id}>
                <button
                  onClick={() => {
                    if (hasSubTabs) {
                      setExpandedTab(isExpanded ? null : tab.id);
                      const firstSub = tab.subTabs[0]?.id;
                      setSearchParams({ tab: tab.id, ...(firstSub ? { ctab: firstSub } : {}) });
                      setIsSidebarOpen(false);
                    } else {
                      setExpandedTab(null);
                      handleTabClick(tab.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "text-white hover:bg-slate-900 hover:text-white"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    <span>{tab.label}</span>
                  </div>

                  {hasSubTabs && (
                    <svg
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {hasSubTabs && isExpanded && (
                  <div className="ml-8 mt-1.5 space-y-1 border-l border-slate-800 pl-3">
                    {tab.subTabs.map((sub) => {
                      const currentCtab = searchParams.get("ctab") || tab.subTabs[0].id;
                      const isSubActive = isActive && currentCtab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSearchParams({ tab: tab.id, ctab: sub.id });
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${isSubActive
                            ? "bg-blue-600/30 text-blue-400 font-semibold"
                            : "text-slate-300 hover:bg-slate-900 hover:text-white"
                            }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / Logout Area */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-red-400 border border-red-950/40 bg-red-950/10 hover:bg-red-950/30 hover:text-red-400 transition-all duration-200 cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            {/* Hamburger for mobile */}
            <button
              className="mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {activeTabConfig?.label || "Real Estate Panel"}
            </h2>
          </div>
        </header>

        {/* Tab View Wrapper */}
        <div className="p-8 flex-1">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            {TabComponent ? (
              <TabComponent />
            ) : (
              <div className="text-slate-400 text-center py-20">No Component Found</div>
            )}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
// code is working but upper code have logo plus color 
// // src/AdminDashboard.jsx
// import React, { useState, useEffect, Suspense } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { TAB_REGISTRY } from "./TabRegistry";
// import { ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from "./roles";
// import { useDispatch, useSelector } from "react-redux";
// import { clearCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
// import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";

// const AdminDashboard = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [logoutApi] = useLogoutMutation();

//   const user = useSelector((state) => state.auth.user);

//   const activeRole = user?.role || ROLES.AGENT;
//   const allowedTabIds = ROLE_PERMISSIONS[activeRole] || [];
//   const allowedTabs = TAB_REGISTRY.filter((tab) => allowedTabIds.includes(tab.id));
//   const defaultTab = allowedTabs[0]?.id || "properties";

//   // Derive active tab from URL query params: ?tab=properties
//   const tabFromUrl = searchParams.get("tab");
//   const activeTab = tabFromUrl && allowedTabIds.includes(tabFromUrl) ? tabFromUrl : defaultTab;

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   // const [expandedTab, setExpandedTab] = useState(null);
//   const [expandedTab, setExpandedTab] = useState(() => {
//   const initialTab = allowedTabs.find((t) => t.id === activeTab);
//   return initialTab?.subTabs?.length ? initialTab.id : null;
// });

//   // Keep URL parameters synchronized with active state
//   useEffect(() => {
//     const urlTab = searchParams.get("tab");
//     if (!urlTab || !allowedTabIds.includes(urlTab)) {
//       setSearchParams({ tab: defaultTab }, { replace: true });
//     }
//   }, [activeRole, searchParams, setSearchParams, allowedTabIds, defaultTab]);

//   const handleTabClick = (tabId) => {
//     setSearchParams({ tab: tabId });
//     setIsSidebarOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutApi().unwrap();
//     } catch (err) {
//       // Even if backend logout fails (e.g. token already expired),
//       // proceed to clear local state and redirect.
//       console.error("Logout API error:", err);
//     } finally {
//       dispatch(clearCredentials());
//       navigate("/login", { replace: true });
//     }
//   };

//   const activeTabConfig = allowedTabs.find((t) => t.id === activeTab);
//   const TabComponent = activeTabConfig?.component ?? null;

//   if (!user) {
//     return null; // ProtectedRoute / App bootstrap should prevent this, but guard anyway
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed md:sticky top-0 h-screen z-40 md:z-20
//         w-64 bg-white border-r border-slate-200 flex flex-col
//         transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//       `}>
//         {/* Logo and Profile */}
//         <div className="p-6 border-b border-slate-100 flex flex-col items-center">
//           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
//             RE
//           </div>
//           <h1 className="mt-3 font-semibold text-slate-800">{user.name}</h1>
//           <span className="text-xs text-blue-600 font-medium tracking-wider uppercase mt-1">
//             {ROLE_LABELS[activeRole]}
//           </span>
//         </div>

//         {/* Navigation list */}
//         <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//           {allowedTabs.filter((t) => !t.hideInSidebar).map((tab) => {
//             const isActive = activeTab === tab.id;
//             const hasSubTabs = tab.subTabs && tab.subTabs.length > 0;
//             // const isExpanded = expandedTab === tab.id || (isActive && hasSubTabs);
//             const isExpanded = expandedTab === tab.id;

//             return (
//               <div key={tab.id}>
//                 <button
//                  onClick={() => {
//                     if (hasSubTabs) {
//                       setExpandedTab(isExpanded ? null : tab.id);
//                       const firstSub = tab.subTabs[0]?.id;
//                       setSearchParams({ tab: tab.id, ...(firstSub ? { ctab: firstSub } : {}) });
//                       setIsSidebarOpen(false);
//                     } else {
//                       setExpandedTab(null);
//                       handleTabClick(tab.id);
//                     }
//                   }}
//                   className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${isActive
//                     ? "bg-blue-50 text-blue-600 shadow-sm"
//                     : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                     }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <svg
//                       className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
//                       fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
//                     </svg>
//                     <span>{tab.label}</span>
//                   </div>

//                   {hasSubTabs && (
//                     <svg
//                       className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
//                       fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   )}
//                 </button>

//                 {hasSubTabs && isExpanded && (
//                   <div className="ml-8 mt-1 space-y-1">
//                     {tab.subTabs.map((sub) => {
//                       const currentCtab = searchParams.get("ctab") || tab.subTabs[0].id;
//                       const isSubActive = isActive && currentCtab === sub.id;
//                       return (
//                         <button
//                           key={sub.id}
//                           onClick={() => {
//                             setSearchParams({ tab: tab.id, ctab: sub.id });
//                             setIsSidebarOpen(false);
//                           }}
//                           className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${isSubActive
//                             ? "bg-blue-50 text-blue-600 font-medium"
//                             : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
//                             }`}
//                         >
//                           {sub.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </nav>

//         {/* Footer / Logout */}
//         <div className="p-4 border-t border-slate-100">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 border border-red-100 hover:bg-red-50 transition-all duration-200 cursor-pointer"
//           >
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col min-h-screen">
//         {/* Header */}
//         <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
//           <div className="flex items-center">
//             {/* Hamburger for mobile */}
//             <button
//               className="mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-semibold text-slate-800">
//               {activeTabConfig?.label || "Real Estate Panel"}
//             </h2>
//           </div>
//         </header>

//         {/* Tab View Wrapper */}
//         <div className="p-8 flex-1">
//           <Suspense fallback={
//             <div className="flex items-center justify-center h-64">
//               <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             </div>
//           }>
//             {TabComponent ? (
//               <TabComponent />
//             ) : (
//               <div className="text-slate-400 text-center py-20">No Component Found</div>
//             )}
//           </Suspense>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

// // src/AdminDashboard.jsx
// import React, { useState, useEffect, Suspense } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { TAB_REGISTRY } from "./TabRegistry";
// import { ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from "./roles";
// import { useDispatch, useSelector } from "react-redux";
// import { clearCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
// import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";

// const AdminDashboard = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [logoutApi] = useLogoutMutation();

//   const user = useSelector((state) => state.auth.user);

//   const activeRole = user?.role || ROLES.AGENT;
//   const allowedTabIds = ROLE_PERMISSIONS[activeRole] || [];
//   const allowedTabs = TAB_REGISTRY.filter((tab) => allowedTabIds.includes(tab.id));
//   const defaultTab = allowedTabs[0]?.id || "properties";

//   // Derive active tab from URL query params: ?tab=properties
//   const tabFromUrl = searchParams.get("tab");
//   const activeTab = tabFromUrl && allowedTabIds.includes(tabFromUrl) ? tabFromUrl : defaultTab;

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Keep URL parameters synchronized with active state
//   useEffect(() => {
//     const urlTab = searchParams.get("tab");
//     if (!urlTab || !allowedTabIds.includes(urlTab)) {
//       setSearchParams({ tab: defaultTab }, { replace: true });
//     }
//   }, [activeRole, searchParams, setSearchParams, allowedTabIds, defaultTab]);

//   const handleTabClick = (tabId) => {
//     setSearchParams({ tab: tabId });
//     setIsSidebarOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       await logoutApi().unwrap();
//     } catch (err) {
//       // Even if backend logout fails (e.g. token already expired),
//       // proceed to clear local state and redirect.
//       console.error("Logout API error:", err);
//     } finally {
//       dispatch(clearCredentials());
//       navigate("/login", { replace: true });
//     }
//   };

//   const activeTabConfig = allowedTabs.find((t) => t.id === activeTab);
//   const TabComponent = activeTabConfig?.component ?? null;

//   if (!user) {
//     return null; // ProtectedRoute / App bootstrap should prevent this, but guard anyway
//   }

//   return (
//     <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
//       {/* Mobile Sidebar Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         fixed md:sticky top-0 h-screen z-40 md:z-20
//         w-64 bg-white border-r border-slate-200 flex flex-col
//         transition-transform duration-300 ease-in-out
//         ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
//       `}>
//         {/* Logo and Profile */}
//         <div className="p-6 border-b border-slate-100 flex flex-col items-center">
//           <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
//             RE
//           </div>
//           <h1 className="mt-3 font-semibold text-slate-800">{user.name}</h1>
//           <span className="text-xs text-blue-600 font-medium tracking-wider uppercase mt-1">
//             {ROLE_LABELS[activeRole]}
//           </span>
//         </div>

//         {/* Navigation list */}
//         <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//           {allowedTabs.filter((t) => !t.hideInSidebar).map((tab) => {
//             const isActive = activeTab === tab.id;
//             return (
//               <button
//                 key={tab.id}
//                 onClick={() => handleTabClick(tab.id)}
//                 className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${isActive
//                   ? "bg-blue-50 text-blue-600 shadow-sm"
//                   : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                   }`}
//               >
//                 <svg
//                   className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
//                   fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
//                 </svg>
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </nav>

//         {/* Footer / Logout */}
//         <div className="p-4 border-t border-slate-100">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 border border-red-100 hover:bg-red-50 transition-all duration-200 cursor-pointer"
//           >
//             Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 flex flex-col min-h-screen">
//         {/* Header */}
//         <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
//           <div className="flex items-center">
//             {/* Hamburger for mobile */}
//             <button
//               className="mr-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
//               onClick={() => setIsSidebarOpen(true)}
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h2 className="text-lg font-semibold text-slate-800">
//               {activeTabConfig?.label || "Real Estate Panel"}
//             </h2>
//           </div>
//         </header>

//         {/* Tab View Wrapper */}
//         <div className="p-8 flex-1">
//           <Suspense fallback={
//             <div className="flex items-center justify-center h-64">
//               <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             </div>
//           }>
//             {TabComponent ? (
//               <TabComponent />
//             ) : (
//               <div className="text-slate-400 text-center py-20">No Component Found</div>
//             )}
//           </Suspense>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;