// src/tabs/Settings/settingsRegistry.js
import { lazy } from "react";

const GeneralSettings = lazy(() => import("./GeneralSettingsTab/GeneralSettings"));
const ProfileSettings = lazy(() => import("./UserProfileTab/UserProfileTab"));
const BadgeSettingsTab = lazy(() => import("./BadgeSettingsTab/BadgeSettingsTab"));
const SocialSettingsTab = lazy(() => import("./SocialSettingsTab/SocialSettingsTab"));

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
  {
    id: "badgesettings",
    label: "Badge Settings",
    component: BadgeSettingsTab,
  },
  // {
  //   id: "socialsettings",
  //   label: "Social Settings",
  //   component: SocialSettingsTab,
  // },
];
