// src/tabs/SubscriptionsTab/SubscriptionRegistry.js
import { lazy } from "react";

const PlansTab = lazy(() => import("./PlansTab"));
const ActiveSubscriptionsTab = lazy(() => import("./ActiveSubscriptionsTab"));
const PaymentsTab = lazy(() => import("./PaymentsTab"));

export const SUBSCRIPTIONS_REGISTRY = [
  {
    id: "plans",
    label: "Plans",
    component: PlansTab,
  },
  {
    id: "activesubscriptions",
    label: "Active Subscriptions",
    component: ActiveSubscriptionsTab,
  },
  {
    id: "payments",
    label: "Payments",
    component: PaymentsTab,
  },
];