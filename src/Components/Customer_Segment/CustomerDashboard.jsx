// src/Components/Customer_Segment/CustomerDashboard.jsx
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthApi";
import { clearCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/customerAuth/customerAuthSlice";
import { CUSTOMER_TAB_REGISTRY } from "./CustomerTabRegistry";
import { CUSTOMER_ROLE_PERMISSIONS, CUSTOMER_ROLE_LABELS } from "./CustomerRoles";
import LOGO from "../../assets/logoinh.png";
import { toast } from "../Shared/ToastConfig";

const CustomerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();

  const user = useSelector((state) => state.customerAuth.user);

  const activeRole = user?.accountType || "seeker";
  const allowedTabIds = CUSTOMER_ROLE_PERMISSIONS[activeRole] || [];
  const allowedTabsAll = CUSTOMER_TAB_REGISTRY.filter((tab) => allowedTabIds.includes(tab.id));
  const sidebarTabs = allowedTabsAll.filter((tab) => !tab.hideInSidebar);
  const defaultTab = sidebarTabs[0]?.id || "my-inquiries";


  const tabFromUrl = searchParams.get("tab");
  const activeTab = tabFromUrl && allowedTabIds.includes(tabFromUrl) ? tabFromUrl : defaultTab;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (!urlTab || !allowedTabIds.includes(urlTab)) {
      setSearchParams({ tab: defaultTab }, { replace: true });
    }
  }, [activeRole, searchParams, setSearchParams, allowedTabIds, defaultTab]);

  const handleTabClick = (tabId) => {
    setSearchParams({ tab: tabId });
    setIsSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      dispatch(clearCredentials());
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  const activeTabConfig = allowedTabsAll.find((t) => t.id === activeTab);
  const TabComponent = activeTabConfig?.component ?? null;

  if (!user) {
    return null;
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

      {/* Sidebar - Immersed Premium Dark UI */}
      <aside className={`
        fixed md:sticky top-0 h-screen z-40 md:z-20
        w-64 bg-slate-950 border-r border-slate-900 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo and Profile Header Section */}
        <div className="w-full pt-4 pb-6 px-4 border-b border-slate-900 flex flex-col items-center">
          <div className="w-full h-[150px] flex items-center justify-center overflow-hidden">
            <img
              src={LOGO}
              alt="Mehta Estates Logo"
              className="w-full h-full object-contain scale-125 filter drop-shadow-md transition-transform duration-300 hover:scale-130"
            />
          </div>

          {/* User Profile Info Unit */}
          <div className="w-full text-center mt-2 bg-slate-900/60 py-3 px-2 rounded-2xl border border-slate-800/50">
            {/* <h1 className="font-bold text-white tracking-tight text-sm truncate">{user.fullName}</h1> */}
            <span className="inline-block text-[9px] text-amber-400 font-bold tracking-widest uppercase mt-1 bg-amber-950/40 border border-amber-900/60 px-3 py-0.5 rounded-full">
              {CUSTOMER_ROLE_LABELS[activeRole]}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {sidebarTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer text-left ${isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
              >
                <svg
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout Area */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/80 space-y-2">
          {/* View Website */}
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300 border border-slate-800/60 bg-slate-900/40 hover:bg-slate-800 hover:text-white transition-all duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Website
          </button>
          {/* Sign Out */}
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
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10">
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
            <h2 className="text-base md:text-lg font-semibold text-slate-800">
              {activeTabConfig?.label || "Customer Dashboard"}
            </h2>
          </div>

          {/* Top-right: User name + role */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 leading-tight">{user.fullName}</span>
              {/* <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase">
                {CUSTOMER_ROLE_LABELS[activeRole]}
              </span> */}
            </div>
            {/* <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-[13px] font-bold text-[#0f0301] shadow-sm shrink-0">
              {user.fullName?.trim().charAt(0).toUpperCase()}
            </div> */}

          </div>
        </header>

        {/* Tab View Wrapper */}
        <div className="p-4 md:p-8 flex-1">
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

export default CustomerDashboard;
