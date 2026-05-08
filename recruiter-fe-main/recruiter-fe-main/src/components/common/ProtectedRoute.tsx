import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  permissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  permissions,
}) => {
  const { isAuthenticated, user, hasRole, hasPermission, isLoading } =
    useAuth();
  const location = useLocation();

  console.log("ProtectedRoute debug:", {
    isAuthenticated,
    user,
    isLoading,
    roles,
    permissions,
    hasRole: roles ? hasRole(roles) : "N/A",
    hasPermission: permissions
      ? permissions.some((p) => hasPermission(p))
      : "N/A",
  });

  // Show loading spinner while fetching user data
  if (isAuthenticated && !user && isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(roles)) {
    console.log("User does not have required role, redirecting");
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else {
      return <Navigate to="/candidate/profile" replace />;
    }
  }

  if (permissions && !permissions.some((p) => hasPermission(p))) {
    console.log("User does not have required permissions, redirecting");
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === "recruiter") {
      return <Navigate to="/recruiter/dashboard" replace />;
    } else {
      return <Navigate to="/candidate/profile" replace />;
    }
  }

  console.log("ProtectedRoute rendering children");
  return <>{children}</>;
};
