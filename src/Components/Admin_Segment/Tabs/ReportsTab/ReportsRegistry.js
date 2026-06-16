// src/tabs/ReportsTab/ReportsRegistry.js
import { lazy } from "react";

const PropertyPerformanceTab = lazy(() => import("./PropertyPerformanceTab/PropertyPerformanceTab"));
const UserActivityTab = lazy(() => import("./UserActivityTab/UserActivityTab"));
const RevenueReportTab = lazy(() => import("./RevenueReportTab/RevenueReportTab"));
const LeadConversionTab = lazy(() => import("./LeadConversionTab/LeadConversionTab"));
const SubscriptionAnalyticsTab = lazy(() => import("./SubscriptionAnalyticsTab/SubscriptionAnalyticsTab"));

export const REPORTS_REGISTRY = [
  {
    id: "propertyperformance",
    label: "Property Performance Report",
    component: PropertyPerformanceTab,
  },
  {
    id: "useractivity",
    label: "User Activity Report",
    component: UserActivityTab,
  },
  {
    id: "revenue",
    label: "Revenue Report",
    component: RevenueReportTab,
  },
  {
    id: "leadconversion",
    label: "Lead Conversion Report",
    component: LeadConversionTab,
  },
  {
    id: "subscriptionanalytics",
    label: "Subscription Analytics",
    component: SubscriptionAnalyticsTab,
  },
];