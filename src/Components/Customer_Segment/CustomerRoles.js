// src/Components/Customer_Segment/CustomerRoles.js

export const CUSTOMER_ROLES = {
  SEEKER: "seeker",
  OWNER: "owner",
  AGENT: "agent",
};

export const CUSTOMER_ROLE_PERMISSIONS = {
  [CUSTOMER_ROLES.SEEKER]: [
    "my-inquiries",
    "accommodation_requirement",
    "buy_property",
    "profile",
  ],
  [CUSTOMER_ROLES.OWNER]: [
    "my-inquiries",
    "accommodation_listing",
    "sell_property",
    "profile",
    "my-properties",
    "add-property",
    "edit-property",
    "property-detail",
    "property-inventory",
    "tenant-entry",
    "tenant-exit",
    "my-badges",
  ],
  [CUSTOMER_ROLES.AGENT]: [
    "my-inquiries",
    "accommodation_listing",
    "sell_property",
    "profile",
    "my-properties",
    "add-property",
    "edit-property",
    "property-detail",
    "property-inventory",
    "tenant-entry",
    "tenant-exit",
    "agent-badges",
    "key-management",
  ],
};

export const CUSTOMER_ROLE_LABELS = {
  [CUSTOMER_ROLES.SEEKER]: "Property Seeker",
  [CUSTOMER_ROLES.OWNER]: "Property Owner",
  [CUSTOMER_ROLES.AGENT]: "Agent / Broker",
};
