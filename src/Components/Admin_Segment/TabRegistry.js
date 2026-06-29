// src/TabRegistry.js
import { lazy } from "react";

// Lazy-loaded tab components
const PropertiesTab = lazy(() => import("./Tabs/PropertiesTab/PropertiesTab"));
const AddPropertyPage = lazy(() => import("./Tabs/PropertiesTab/Shared/AddPropertyPage"));
const EditPropertyPage = lazy(() => import("./Tabs/PropertiesTab/Shared/EditPropertyPage"));
const PropertyDetailPage = lazy(() => import("./Tabs/PropertiesTab/Shared/PropertyDetailPage"));
const UsersTab = lazy(() => import("./Tabs/UsersTab/UsersTab"));
const SubscriptionsTab = lazy(() => import("./Tabs/SubscriptionsTab/SubscriptionsTab"));
const LeadsTab = lazy(() => import("./Tabs/LeadsTab/LeadsTab"));
const DocumentsTab = lazy(() => import("./Tabs/DocumentsTab/DocumentsTab"));
const ReportsTab = lazy(() => import("./Tabs/ReportsTab/ReportsTab"));
const UtilityServicesTab = lazy(() => import("./Tabs/UtilityServicesTab/UtilityServicesTab"));
const SettingsDashboard = lazy(() => import("./Tabs/Settings/SettingsDashboard"));
const MasterInventoryTab = lazy(() => import("./Tabs/MasterInventoryTab/MasterInventoryTab"));
const PropertyAnalysisTab = lazy(() => import("./Tabs/PropertyAnalysisTab/PropertyAnalysisTab"));

export const TAB_REGISTRY = [
  {
    id: "properties",
    label: "Properties",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    component: PropertiesTab,
    badge: null,
    subTabs: [
      { id: "all", label: "All Properties" },
      { id: "pending", label: "Pending Approval" },
      { id: "active", label: "Active" },
    ]
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
  {
    id: "users",
    label: "Users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    component: UsersTab,
    badge: null,
    subTabs: [
      {
        id: "allusers",
        label: "All Users",
        // component: AllUsersTab,
      },
      {
        id: "verifiedusers",
        label: "Verified Users",
        // component: VerifiedUsersTab,
      },
    ]
  },

  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-2-1-2 1-2-1-2 1-2-1-2 1V3l2 1 2-1 2 1 2-1 2 1 2-1v18z",
    component: SubscriptionsTab,
    badge: null,
    subTabs: [
      {
        id: "plans",
        label: "Plans",
      },
      {
        id: "activesubscriptions",
        label: "Active Subscriptions",
      },
      {
        id: "payments",
        label: "Payments",
      },
    ]
  },

  {
    id: "leads",
    label: "Leads",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    component: LeadsTab,
    badge: null,
    subTabs: [
      {
        id: "allleads",
        label: "All Leads",
      },
      {
        id: "sitevisits",
        label: "Site Visits",
      },
    ]
  },

  {
    id: "documents",
    label: "Documents",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    component: DocumentsTab,
    badge: null,
    subTabs: [
      {
        id: "userkyc",
        label: "User KYC",
      },
      {
        id: "propertydocuments",
        label: "Property Documents",
      },
      {
        id: "approvaldocuments",
        label: "Approval Documents",
      },
    ]
  },

  {
    id: "reports",
    label: "Reports",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    component: ReportsTab,
    badge: null,
    subTabs: [
      {
        id: "propertyperformance",
        label: "Property Performance",
      },
      {
        id: "useractivity",
        label: "User Activity",
      },
      {
        id: "revenue",
        label: "Revenue",
      },
      {
        id: "leadconversion",
        label: "Lead Conversion",
      },
      {
        id: "subscriptionanalytics",
        label: "Subscription Analytics",
      },
    ]
  },
  {
    id: "eliteservices",
    label: "Elite Services",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    component: UtilityServicesTab,
    badge: null,
  },
  
   {
    id: "settings",
    label: "Settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    component: SettingsDashboard,
    badge: null,
    subTabs: [
      {
        id: "generalsettings",
        label: "General Settings",
      },
      {
        id: "userprofile",
        label: "User Profile",
      },
    ]
  },
  {
    id: "master-inventory",
    label: "Master Inventory",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    component: MasterInventoryTab,
    badge: null,
  },
  {
    id: "property-analysis",
    label: "Property Analysis",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    component: PropertyAnalysisTab,
    badge: null,
  },
  // {
  //   id: "leads",
  //   label: "Leads",
  //   icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  //   component: LeadsTab,
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
