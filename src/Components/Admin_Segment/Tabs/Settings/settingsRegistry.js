// src/tabs/Settings/settingsRegistry.js
import { lazy } from "react";

const GeneralSettings = lazy(() => import("./GeneralSettings"));
const ProfileSettings = lazy(() => import("./ProfileSettings"));

export const SETTINGS_REGISTRY = [
  {
    id: "general",
    label: "General Settings",
    component: GeneralSettings,
  },
  {
    id: "profile",
    label: "User Profile",
    component: ProfileSettings,
  },
];
