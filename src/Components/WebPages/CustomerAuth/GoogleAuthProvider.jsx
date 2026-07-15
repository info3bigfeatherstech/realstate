import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

/**
 * Wraps children with GoogleOAuthProvider when VITE_GOOGLE_CLIENT_ID is set.
 * Without the env var, children still render (button shows config hint).
 */
const GoogleAuthProvider = ({ children }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return children;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};

export default GoogleAuthProvider;
