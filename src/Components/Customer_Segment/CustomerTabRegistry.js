// src/Components/Customer_Segment/CustomerTabRegistry.js
import { lazy } from "react";

// Lazy-loaded tab components
const MyInquiriesTab = lazy(() => import("./Tabs/Inquiries/MyInquiriesTab"));
const CustomerProfileTab = lazy(() => import("./Tabs/Profile/CustomerProfileTab"));
const MyPropertiesTab = lazy(() => import("./Tabs/Properties/MyPropertiesTab"));
const CreatePropertyPage = lazy(() => import("./Tabs/Properties/CreatePropertyPage"));
const EditPropertyPage = lazy(() => import("./Tabs/Properties/EditPropertyPage"));
const PropertyDetailPage = lazy(() => import("./Tabs/Properties/PropertyDetailPage"));

const PropertyInventoryTab = lazy(() => import("./Tabs/Inventory/PropertyInventoryTab"));
const TenantEntryTab = lazy(() => import("./Tabs/Tenants/TenantEntryTab"));
const TenantExitTab = lazy(() => import("./Tabs/Tenants/TenantExitTab"));

const AccommodationRequirementTab = lazy(() =>
  import("../WebPages/EnquiryPages/Accommodation/Shared/AccommodationInquiryFormBody")
);
const BuyPropertyTab = lazy(() =>
  import("../WebPages/EnquiryPages/BuyProperty/BuyPropertyInquiryForm")
);
const AccommodationListingTab = lazy(() =>
  import("../WebPages/EnquiryPages/AccommodationListing/AccommodationListingForm")
);
const SellPropertyTab = lazy(() =>
  import("../WebPages/EnquiryPages/SellProperty/SellPropertyInquiryForm")
);

export const CUSTOMER_TAB_REGISTRY = [
  {
    id: "my-inquiries",
    label: "My Inquiries",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    component: MyInquiriesTab,
  },
  {
    id: "accommodation_requirement",
    label: "Accommodation Requirement",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    component: AccommodationRequirementTab,
  },
  {
    id: "buy_property",
    label: "Buy Property Inquiry",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7",
    component: BuyPropertyTab,
  },
  {
    id: "accommodation_listing",
    label: "Accommodation Listing",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
    component: AccommodationListingTab,
  },
  {
    id: "sell_property",
    label: "Sell Property Inquiry",
    icon: "M15 7a2 2 0 012 2m-2-2a2 2 0 00-2-2m2 2h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
    component: SellPropertyTab,
  },
  {
    id: "profile",
    label: "Profile Settings",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    component: CustomerProfileTab,
  },
  {
    id: "my-properties",
    label: "My Properties",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    component: MyPropertiesTab,
  },
  {
    id: "add-property",
    label: "Add Property",
    icon: "M12 4v16m8-8H4",
    component: CreatePropertyPage,
    hideInSidebar: true,
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
    id: "property-inventory",
    label: "Property Inventory",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    component: PropertyInventoryTab,
  },
  {
    id: "tenant-entry",
    label: "Tenant Check-In (Entry)",
    icon: "M15 7a2 2 0 012 2m-2-2a2 2 0 00-2-2m2 2h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2",
    component: TenantEntryTab,
  },
  {
    id: "tenant-exit",
    label: "Tenant Check-Out (Exit)",
    icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
    component: TenantExitTab,
  },
];
