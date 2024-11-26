import React, { useState, useEffect } from "react";
import SearchBar from "../src/components/SearchBar";
import "../styles/Home.css";

const Home = () => { // isConnected est passé comme prop
  const [cvList, setCvList] = useState([]);
  const [filteredCvList, setFilteredCvList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCV, setExpandedCV] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté en consultant le token dans localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // L'utilisateur est connecté
    } else {
      setIsAuthenticated(false); // L'utilisateur n'est pas connecté
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Mettre à jour l'état pour refléter la déconnexion
  };
  // Fonction pour récupérer les CV visibles
  const fetchCVs = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/api/cv", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const visibleCVs = data.filter((cv) => cv.visibilite);
      setCvList(visibleCVs);
      setFilteredCvList(visibleCVs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les CVs par nom ou prénom
  const handleSearch = (searchTerm) => {
    const filteredCVs = cvList.filter((cv) =>
      (cv.informationsPersonnelles.nom + " " + cv.informationsPersonnelles.prenom)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredCvList(filteredCVs);
  };

  // Récupérer les CV lors du chargement du composant
  useEffect(() => {
    fetchCVs();
  }, []);

  // Gère l'affichage des détails
  const toggleDetails = (cvId) => {
    setExpandedCV((prevId) => (prevId === cvId ? null : cvId));
  };

  return (
    <div className="container">
      <h1>Liste des CV visibles</h1>
      <SearchBar className="search-bar" onSearch={handleSearch} />
      {/* Message si l'utilisateur n'est pas connecté */}
      {!isAuthenticated && <p className="auth-warning">Connectez-vous pour voir plus de détails.</p>}
      {loading && <p className="loading-message">Chargement des CV...</p>}
      {error && <p className="error-message">Erreur : {error}</p>}
      {!loading && !error && filteredCvList.length === 0 && <p>Aucun CV visible trouvé.</p>}
      {!loading && filteredCvList.length > 0 && (
        <table >
          <thead>
            <tr>
              <th>Nom</th>
              <th >Prénom</th>
              <th >Expérience(s)</th>
            </tr>
          </thead>
          <tbody>
            {filteredCvList.map((cv) => (
              <React.Fragment key={cv._id}>
                <tr
                  onClick={() => isAuthenticated && toggleDetails(cv._id)} // Vérifie la connexion
                >
                  <td >
                    {cv.informationsPersonnelles.nom}
                  </td>
                  <td >
                    {cv.informationsPersonnelles.prenom}
                  </td>
                  <td >
                    {cv.experience.map((exp) => exp.poste).join(", ")}
                  </td>
                </tr>
                {/* Afficher les détails uniquement si l'utilisateur est connecté */}
                {isAuthenticated && expandedCV === cv._id && (
                  <tr className="details-row">
                    <td colSpan="3" >
                      <h4>Détails</h4>
                      <p>
                        <strong>Description :</strong> {cv.informationsPersonnelles.description}
                      </p>
                      <h5>Éducation :</h5>
                      <ul>
                        {cv.education.map((edu, index) => (
                          <li key={index}>
                            {edu.diplome} - {edu.institution} ({edu.annee})
                          </li>
                        ))}
                      </ul>
                      <h5>Expériences professionnelles :</h5>
                      <ul>
                        {cv.experience.map((exp, index) => (
                          <li key={index}>
                            <strong>{exp.poste}</strong> chez {exp.entreprise} ({exp.duree})
                            <br />
                            Tâches : {exp.taches}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      
    </div>
  );
};

export default Home;
