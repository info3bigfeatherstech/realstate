// src/tabs/DocumentsTab/DocumentsRegistry.js
import { lazy } from "react";

const UserKycTab = lazy(() => import("./UserKycTab/UserKycTab"));
const PropertyDocumentsTab = lazy(() => import("./PropertyDocumentsTab/PropertyDocumentsTab"));
const ApprovalDocumentsTab = lazy(() => import("./ApprovalDocumentsTab/ApprovalDocumentsTab"));

export const DOCUMENTS_REGISTRY = [
  {
    id: "userkyc",
    label: "User KYC",
    component: UserKycTab,
  },
  {
    id: "propertydocuments",
    label: "Property Documents",
    component: PropertyDocumentsTab,
  },
  {
    id: "approvaldocuments",
    label: "Approval Documents",
    component: ApprovalDocumentsTab,
  },
];