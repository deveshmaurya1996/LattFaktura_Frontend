// components/RouteProtection/AuthRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthRoute = ({ requireAuth }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (requireAuth) {
    if (!user) {
      return <Navigate to={"/login"} replace state={{ from: location }} />;
    }
  } else {
    if (user) {
      return <Navigate to={"/pricelist"} replace />;
    }
  }

  return <Outlet />;
};

export default AuthRoute;
