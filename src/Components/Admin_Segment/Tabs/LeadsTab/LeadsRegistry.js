// src/tabs/LeadsTab/LeadsRegistry.js
import { lazy } from "react";

const AllLeadsTab = lazy(() => import("./AllLeadsTab/AllLeadsTab"));
const SiteVisitsTab = lazy(() => import("./SiteVisitsTab/SiteVisitsTab"));
const AccommodationInquiriesTab = lazy(() => import("./AccommodationInquiriesTab/AccommodationInquiriesTab"));

export const LEADS_REGISTRY = [
  {
    id: "allleads",
    label: "All Leads",
    component: AllLeadsTab,
  },
  {
    id: "sitevisits",
    label: "Site Visits",
    component: SiteVisitsTab,
  },
  {
    id: "accommodationinquiries",
    label: "Accommodation Inquiries",
    component: AccommodationInquiriesTab,
  },
];