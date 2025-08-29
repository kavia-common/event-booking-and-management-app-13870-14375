import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute({ requiredRoles = [], children }) {
  /** Guard routes based on authentication and active role. */
  const { isAuthenticated, activeRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRoles.length > 0 && !requiredRoles.includes(activeRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
