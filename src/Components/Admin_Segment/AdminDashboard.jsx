// src/AdminDashboard.jsx
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { TAB_REGISTRY } from "./TabRegistry";
import { ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from "./roles";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authSlice";
import { useLogoutMutation } from "../../REDUX_FEATURES/REDUX_SLICES/auth/authApi";

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

  // Keep URL parameters synchronized with active state
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
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen z-40 md:z-20
        w-64 bg-white border-r border-slate-200 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo and Profile */}
        <div className="p-6 border-b border-slate-100 flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-200">
            RE
          </div>
          <h1 className="mt-3 font-semibold text-slate-800">{user.name}</h1>
          <span className="text-xs text-blue-600 font-medium tracking-wider uppercase mt-1">
            {ROLE_LABELS[activeRole]}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {allowedTabs.filter((t) => !t.hideInSidebar).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <svg
                  className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}
                  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 border border-red-100 hover:bg-red-50 transition-all duration-200 cursor-pointer"
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