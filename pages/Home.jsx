import React, { useState, useEffect } from "react";
import SearchBar from "../src/components/SearchBar";
import '../src/style/Home.css';

const Home = () => {
  const [cvList, setCvList] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [recommendations, setRecommendations] = useState({});
  const [recommendationErrors, setRecommendationErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCV, setExpandedCV] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  useEffect(() => {
    console.log(recommendation)
    console.log(recommendations)
  }, [recommendations,recommendation]
);
  // Fonction pour récupérer les CV visibles
  const fetchCVs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cv", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);

      const data = await response.json();
      const visibleCVs = data.filter((cv) => cv.visibilite);
      setCvList(visibleCVs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les recommandations pour un CV spécifique
  const fetchRecommendations = async (cvId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `api/recommendations/${cvId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setRecommendations((prev) => ({
        ...prev,
        [cvId]: data, // Stocker les recommandations pour ce CV
      }));
    } catch (error) {
      
      setRecommendationErrors((prev) => ({
        ...prev,
        [cvId]: error.message, // Stocker le message d'erreur pour ce CV
      }));
    }
  };

  // Fonction pour gérer la soumission d'une recommandation
  const handleRecommendationSubmit = async (cvId) => {
    if (!recommendation.trim()) {
      alert("La recommandation ne peut pas être vide.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `api/recommendations/${cvId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ message: recommendation }),
        }
      );
    

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la recommandation.");

      const data = await response.json();
      
      alert("Recommandation ajoutée avec succès !");
      fetchRecommendations(cvId)
      
      setRecommendations((prev) => ({
        ...prev,
        [cvId]: [...(prev[cvId] || []), data], // Ajouter la nouvelle recommandation
      }));
      setRecommendation(""); // Réinitialiser la saisie
    } catch (error) {
      console.error(error);
      alert("Impossible d'envoyer la recommandation.");
    }
    fetchRecommendations(cvId)
  };

  // Charger les CV au démarrage
  useEffect(() => {
    fetchCVs();
  }, []);

  // Gérer l'affichage des détails
  const toggleDetails = (cvId) => {
    setExpandedCV((prevId) => (prevId === cvId ? null : cvId));
    if (!recommendations[cvId] && !recommendationErrors[cvId]) {
      fetchRecommendations(cvId); // Récupérer les recommandations si elles n'ont pas encore été chargées
    }
  };

  return (
    <div className="container">
      <h1>Liste des CV visibles</h1>
      <SearchBar className="search-bar" />
      {!isAuthenticated && <p className="auth-warning">Connectez-vous pour voir plus de détails.</p>}
      {loading && <p>Chargement des CV...</p>}
      {error && <p>Erreur : {error}</p>}
      {!loading && cvList.length === 0 && <p>Aucun CV visible trouvé.</p>}
      {!loading && cvList.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Expérience(s)</th>
            </tr>
          </thead>
          <tbody>
            {cvList.map((cv) => (
              <React.Fragment key={cv._id}>
                <tr
                  onClick={() => isAuthenticated && toggleDetails(cv._id)}
                >
                  <td>{cv.informationsPersonnelles.nom}</td>
                  <td>{cv.informationsPersonnelles.prenom}</td>
                  <td>{cv.experience.map((exp) => exp.poste).join(", ")}</td>
                </tr>
                {isAuthenticated && expandedCV === cv._id && (
                  <tr className="details-row">
                    <td colSpan="3">
                      <h4>Détails</h4>
                      <p><strong>Description :</strong> {cv.informationsPersonnelles.description}</p>
                      <h5>Recommandations :</h5>
                      {(recommendations[cv._id] && recommendations[cv._id].length > 0) ? (
                        <ul>
                          {recommendations[cv._id].map((rec, index) => (
                            <li key={index}>{rec.message}</li>
                          ))}
                        </ul>
                      ) : recommendationErrors[cv._id] ? (
                        <p className="error-message">Aucune recommandation disponible</p>
                      ) : (
                        <p className="info-message">Aucune donnée trouvée pour ce CV.</p>
                      )}

                      <textarea
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        placeholder="Ajoutez une recommandation"
                        rows="3"
                        cols="50"
                      />
                      <br />
                      <button onClick={() => handleRecommendationSubmit(cv._id)}>
                        Soumettre
                      </button>
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
