// src/roles.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for role-based tab access in the Real Estate Panel.
// To give a role access to a new tab → just add the tab ID here.
// To add a new role → add a new key with its allowed tab IDs.
// ─────────────────────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  AGENT: "agent",
  MANAGER: "manager",
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    "properties",
    "add-property",
    "edit-property",
    "property-detail",
    "users",
    "subscriptions",
    "leads",
    "documents",
    "eliteservices",
    "add-utility-service",
    "edit-utility-service",
    "settings",
    "master-inventory"
  ],
  [ROLES.AGENT]: [
    "properties",
    "leads",
    "bookings"
  ],
  [ROLES.MANAGER]: [
    "properties",
    "leads",
    "bookings",
    "analytics"
  ],
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.AGENT]: "Real Estate Agent",
  [ROLES.MANAGER]: "Operations Manager",
};
