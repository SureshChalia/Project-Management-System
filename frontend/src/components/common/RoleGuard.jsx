import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import storage from "../../utils/storage";
import Loader from "./Loader";

export default function RoleGuard({ roles = [], children }) {
  const user = useSelector((s) => s.auth.user);

  // If user is not loaded yet but token exists, show loader while session restores
  const token = storage.getToken();
  if (!user && token) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  // If user is not loaded and no token, redirect to Forbidden
  if (!user && !token) return <Navigate to="/403" replace />;

  if (user.role === "Admin") return children;

  if (roles.length === 0) return children;

  if (!roles.includes(user.role)) return <Navigate to="/403" replace />;

  return children;
}
