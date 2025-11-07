import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../pages/AdminLayout"; // Importer le nouveau layout

export default function PrivateRoute() {
  const { token } = useAuth();

  // Si pas de token, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login-admin" replace />;
  }

  // Si le token existe, afficher le layout d'administration
  // AdminLayout affichera la page enfant correspondante (dashboard, stats, etc.) via <Outlet />
  return <AdminLayout />;
}
