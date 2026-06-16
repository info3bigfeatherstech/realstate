// src/tabs/Settings/settingsRegistry.js
import { lazy } from "react";

const AllUsersTab = lazy(() => import("./AllUsersTab/AllUsersTab"));
const VerifiedUsersTab = lazy(() => import("./VerifiedUsersTab/VerifiedUsersTab"));

export const USERS_REGISTRY = [
  {
    id: "allusers",
    label: "All Users",
    component: AllUsersTab,
  },
  {
    id: "verifiedusers",
    label: "Verified Users",
    component: VerifiedUsersTab,
  },
];
