// src/tabs/LeadsTab/LeadsRegistry.js
import { lazy } from "react";

const AllLeadsTab = lazy(() => import("./AllLeadsTab/AllLeadsTab"));
const SiteVisitsTab = lazy(() => import("./SiteVisitsTab/SiteVisitsTab"));
const AccommodationInquiriesTab = lazy(() => import("./AccommodationInquiriesTab/AccommodationInquiriesTab"));
const BuyPropertyInquiriesTab = lazy(() => import("./BuyPropertyInquiriesTab/BuyPropertyInquiriesTab"));
const SellPropertyInquiriesTab = lazy(() => import("./SellPropertyInquiriesTab/SellPropertyInquiriesTab"));
const AccommodationListingInquiriesTab = lazy(() => import("./AccommodationListingInquiriesTab/AccommodationListingInquiriesTab"));
const GeneralInquiriesTab = lazy(() => import("./GeneralInquiriesTab/GeneralInquiriesTab"));

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
  // {
  //   id: "accommodationinquiries",
  //   label: "Accommodation Inquiries",
  //   component: AccommodationInquiriesTab,
  // },
  {
    id: "buypropertyinquiries",
    label: "Buy Property Inquiries",
    component: BuyPropertyInquiriesTab,
  },
  {
    id: "sellpropertyinquiries",
    label: "Sell Property Inquiries",
    component: SellPropertyInquiriesTab,
  },
  {
    id: "accommodationlistinginquiries",
    label: "Accommodation Listings",
    component: AccommodationListingInquiriesTab,
  },
  {
    id: "generalinquiries",
    label: "General Inquiries",
    component: GeneralInquiriesTab,
  },
];
