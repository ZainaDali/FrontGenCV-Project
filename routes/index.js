import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ManageCV from "../pages/ManageCV";
import PublicCVList from "../pages/PublicCVList";
import CVDetailPage from "../pages/CVDetailPage";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} /> {/* Page d'accueil */}
      <Route path="/manage-cv" element={<ManageCV />} /> {/* Gestion des CV */}
      <Route path="/public-cvs" element={<PublicCVList />} /> {/* CV visibles */}
      <Route path="/cv/:id" element={<CVDetailPage />} /> {/* Détail d'un CV */}
    </Routes>
  </Router>
);

export default AppRoutes;
