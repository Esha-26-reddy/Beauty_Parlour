import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Add `showLoginAlert: true` to the state so Login page knows to show alert
    return (
      <Navigate
        to="/login"
        state={{ from: location, showLoginAlert: true }}
        replace
      />
    );
  }

  // If authenticated, render the protected component(s)
  return children;
};

export default PrivateRoute;
