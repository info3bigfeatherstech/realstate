// src/TabRegistry.js
import { lazy } from "react";

// Lazy-loaded tab components
const PropertiesTab = lazy(() => import("./Tabs/PropertiesTab/PropertiesTab"));
const AddPropertyPage = lazy(() => import("./Tabs/PropertiesTab/Shared/AddPropertyPage"));
const EditPropertyPage = lazy(() => import("./Tabs/PropertiesTab/Shared/EditPropertyPage"));
const PropertyDetailPage = lazy(() => import("./Tabs/PropertiesTab/Shared/PropertyDetailPage"));
// const LeadsTab      = lazy(() => import("./tabs/LeadsTab"));
// const AgentsTab     = lazy(() => import("./tabs/AgentsTab"));
// const BookingsTab   = lazy(() => import("./tabs/BookingsTab"));
// const AnalyticsTab  = lazy(() => import("./tabs/AnalyticsTab"));
// const SettingsDashboard = lazy(() => import("./tabs/Settings/SettingsDashboard"));

export const TAB_REGISTRY = [
  {
    id: "properties",
    label: "Properties",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    component: PropertiesTab,
    badge: null,
  },
  {
    id: "add-property",
    label: "Add Property",
    icon: "M12 4v16m8-8H4",        // plus icon
    component: AddPropertyPage,
    hideInSidebar: true,            // ← sidebar mein nahi dikhega
  },
  {
    id: "edit-property",
    label: "Edit Property",
    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
    component: EditPropertyPage,
    hideInSidebar: true,
  },
  {
    id: "property-detail",
    label: "Property Detail",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    component: PropertyDetailPage,
    hideInSidebar: true,
  },
  // {
  //   id: "leads",
  //   label: "Leads",
  //   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  //   component: LeadsTab,
  //   badge: null,
  // },
  // {
  //   id: "agents",
  //   label: "Agents",
  //   icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  //   component: AgentsTab,
  //   badge: null,
  // },
  // {
  //   id: "bookings",
  //   label: "Bookings & Visits",
  //   icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  //   component: BookingsTab,
  //   badge: null,
  // },
  // {
  //   id: "analytics",
  //   label: "Analytics",
  //   icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  //   component: AnalyticsTab,
  //   badge: null,
  // },
  // {
  //   id: "settings",
  //   label: "Settings",
  //   icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  //   component: SettingsDashboard,
  //   badge: null,
  // },
];
