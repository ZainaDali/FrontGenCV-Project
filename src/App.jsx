import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import du composant Navbar
import Home from "../pages/Home"; // Page d'accueil
import ManageCV from "../pages/ManageCV"; // Page de gestion des CV
import PublicCVList from "../pages/PublicCVList"; // Page des CV visibles
import CVDetailPage from "../pages/CVDetailPage"; // Détails d'un CV
import Login from "../pages/Login"; // Détails d'un CV
import Register from "../pages/Register"; // Détails d'un CV
import { AuthProvider, useAuth } from "./context/AuthContext"; // Use useAuth hook
import ProtectedRoute from '../routes/ProtectedRoute'; // ProtectedRoute component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar /> {/* Affiche la barre de navigation sur toutes les pages */}
        <AppRoutes /> {/* Use AppRoutes here */}
      </Router>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { token } = useAuth(); // Access token from context

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Protect the ManageCV route */}
      <Route
        path="/manage-cv"
        element={
          <ProtectedRoute>
            {token ? <ManageCV /> : <Navigate to="/login" />}
          </ProtectedRoute>
        }
      />
      <Route path="/public-cvs" element={<PublicCVList />} />
      <Route path="/cv/:id" element={<CVDetailPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;
