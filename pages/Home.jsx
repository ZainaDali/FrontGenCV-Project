import React, { useState, useEffect } from "react";
import SearchBar from "../src/components/SearchBar";

const Home = () => {
  const [cvList, setCvList] = useState([]);
  const [filteredCvList, setFilteredCvList] = useState([]); // Liste filtrée des CVs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCV, setExpandedCV] = useState(null); // Gère l'affichage des détails

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
      const visibleCVs = data.filter((cv) => cv.visibilite); // Filtrer les CV visibles
      setCvList(visibleCVs);
      setFilteredCvList(visibleCVs); // Initialiser la liste filtrée
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
    <div>
      <h1>Liste des CV visibles</h1>
      <SearchBar onSearch={handleSearch} /> {/* Ajouter le composant de recherche */}
      {loading && <p>Chargement des CV...</p>}
      {error && <p style={{ color: "red" }}>Erreur : {error}</p>}
      {!loading && !error && filteredCvList.length === 0 && <p>Aucun CV visible trouvé.</p>}
      {!loading && filteredCvList.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nom</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Prénom</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Expérience(s)</th>
            </tr>
          </thead>
          <tbody>
            {filteredCvList.map((cv) => (
              <React.Fragment key={cv._id}>
                <tr
                  style={{ cursor: "pointer", background: "#f9f9f9" }}
                  onClick={() => toggleDetails(cv._id)}
                >
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {cv.informationsPersonnelles.nom}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {cv.informationsPersonnelles.prenom}
                  </td>
                  <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                    {cv.experience.map((exp) => exp.poste).join(", ")}
                  </td>
                </tr>
                {expandedCV === cv._id && (
                  <tr>
                    <td colSpan="3" style={{ padding: "8px", background: "#f1f1f1" }}>
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
