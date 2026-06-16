// src/tabs/Settings/settingsRegistry.js
import { lazy } from "react";

const GeneralSettings = lazy(() => import("./GeneralSettingsTab/GeneralSettings"));
const ProfileSettings = lazy(() => import("./UserProfileTab/UserProfileTab"));

export const SETTINGS_REGISTRY = [
  {
    id: "generalsettings",
    label: "General Settings",
    component: GeneralSettings,
  },
  {
    id: "userprofile",
    label: "User Profile",
    component: ProfileSettings,
  },
];
