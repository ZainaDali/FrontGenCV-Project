import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element: Component }) => {
  const { token } = useAuth(); // Vérifiez si un token est présent

  // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  // Si l'utilisateur est authentifié, affichez le composant demandé
  return Component;
};

export default ProtectedRoute;

