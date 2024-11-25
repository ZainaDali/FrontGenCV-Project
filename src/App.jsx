import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import du composant Navbar
import Home from "../pages/Home"; // Page d'accueil
import ManageCV from "../pages/ManageCV"; // Page de gestion des CV
import PublicCVList from "../pages/PublicCVList"; // Page des CV visibles
import CVDetailPage from "../pages/CVDetailPage"; // Détails d'un CV

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Affiche la barre de navigation sur toutes les pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-cv" element={<ManageCV />} />
        <Route path="/public-cvs" element={<PublicCVList />} />
        <Route path="/cv/:id" element={<CVDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
