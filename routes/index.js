import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ManageCV from "../pages/ManageCV";
import PublicCVList from "../pages/PublicCVList";
import CVDetailPage from "../pages/CVDetailPage";
import EspacePersonnel from "../pages/EspacePersonnel";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} /> {/* Page d'accueil */}
      <Route
        path="/manage-cv"
        element={
          <ProtectedRoute>
            {token ? <ManageCV /> : <Navigate to="/login" />}
          </ProtectedRoute>
        }
      />
      <Route path="/public-cvs" element={<PublicCVList />} /> {/* CV visibles */}
      <Route path="/cv/:id" element={<CVDetailPage />} /> {/* Détail d'un CV */} 
     <Route
        path="/espace-personnel"
        element={
          <ProtectedRoute>
            {token ? <EspacePersonnel /> : <Navigate to="/espace-personnel" />}
          </ProtectedRoute>
        }
      />

    </Routes>
  </Router>
);

export default AppRoutes;
