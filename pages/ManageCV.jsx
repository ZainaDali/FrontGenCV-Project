import React, { useState, useEffect } from "react";
import CreateCV from "./CreateCV";
import CVItem from "./CVItem";
import EditCV from "./EditCV";

const ManageCV = ({ token }) => {
  const [cvs, setCVs] = useState([]);
  const [editingCV, setEditingCV] = useState(null); // Pour suivre le CV en cours de modification
  const [showCreateForm, setShowCreateForm] = useState(false); // Pour afficher le formulaire de création
  const [showEditForm, setShowEditForm] = useState(false); // Pour afficher le formulaire de modification
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user CVs
  const fetchCVs = async () => {
    setLoading(true);
    try {
      const response = await fetch("api/api/cv/user/mine", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDRkYmVmNDYxODc0N2Q3ZGU1MGZmYiIsImVtYWlsIjoiZGFsaS56YWluYUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjU2NjAxMCwiZXhwIjoxNzMyNTY5NjEwfQ.Fb4J8YosHkvMZetavJi9JSUA0fQwL-UoQ1LYacnlW5Q",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCVs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  const handleDeleteCV = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) return;

    try {
      const response = await fetch(`/api/api/cv/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDRkYmVmNDYxODc0N2Q3ZGU1MGZmYiIsImVtYWlsIjoiZGFsaS56YWluYUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjU2NjAxMCwiZXhwIjoxNzMyNTY5NjEwfQ.Fb4J8YosHkvMZetavJi9JSUA0fQwL-UoQ1LYacnlW5Q",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      alert("CV supprimé avec succès !");
      fetchCVs();
    } catch (err) {
      console.log(err);
      alert("Impossible de supprimer le CV.");
    }
  };

  const handleEditCV = (cv) => {
    setEditingCV(cv); // Définit le CV à modifier
    setShowCreateForm(false); // Assurez-vous que le formulaire de création n'est pas affiché
    setShowEditForm(true); // Active le formulaire de modification
  };

  const handleCreateCV = () => {
    setEditingCV(null); // Assurez-vous qu'aucun CV n'est en cours d'édition
    setShowCreateForm(true); // Active le formulaire de création
    setShowEditForm(false); // Masque le formulaire de modification
  };

  const closeForm = () => {
    setEditingCV(null); // Réinitialise le CV en cours d'édition
    setShowCreateForm(false); // Masque le formulaire de création
    setShowEditForm(false); // Masque le formulaire de modification
  };

  // Style pour la modale
  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#fff",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    width: "90%",
    maxWidth: "500px",
    borderRadius: "8px",
    maxHeight: "80vh", // Limite la hauteur pour éviter le dépassement
    overflowY: "auto", // Barre de défilement si nécessaire
  };

  const handleToggleVisibility = async (id, newVisibility) => {
    try {
      const response = await fetch(`/api/api/cv/${id}`, {
        method: "PATCH", // PATCH request to update visibility
        headers: {
          "Content-Type": "application/json",
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDRkYmVmNDYxODc0N2Q3ZGU1MGZmYiIsImVtYWlsIjoiZGFsaS56YWluYUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjU2NjAxMCwiZXhwIjoxNzMyNTY5NjEwfQ.Fb4J8YosHkvMZetavJi9JSUA0fQwL-UoQ1LYacnlW5Q", // Use the token for authorization
        },
        body: JSON.stringify({ visibilite: newVisibility }), // Update visibility field
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Update CVs list after visibility change
      fetchCVs();
    } catch (error) {
      console.error("Erreur lors de la modification de la visibilité:", error);
      alert("Une erreur est survenue lors de la mise à jour de la visibilité du CV.");
    }
  };

  // Style pour l'arrière-plan de la modale
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  };

  return (
    <div className="manage-cv">
      <h2>Gérer mes CV</h2>
      <button
        onClick={handleCreateCV}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showCreateForm ? "Retour à la liste des CV" : "Créer un CV"}
      </button>

      {loading ? (
        <p>Chargement des CV...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Erreur : {error}</p>
      ) : cvs.length === 0 ? (
        <p>Aucun CV disponible.</p>
      ) : (
        <div className="cv-list">
        {cvs.map((cv) => (
          <CVItem
            key={cv._id}
            cv={cv}
            onEdit={() => console.log("Modifier le CV", cv)} // Ajoutez votre logique d'édition ici
            onDelete={() => handleDeleteCV(cv._id)}
            onToggleVisibility={handleToggleVisibility} // Passer la fonction de modification de visibilité
          />
        ))}
      </div>
      )}

      {/* Affichage du formulaire de création dans une boîte modale */}
      {showCreateForm && (
        <>
          <div style={overlayStyle} onClick={closeForm}></div>
          <div style={modalStyle}>
            <CreateCV
              token={token}
              onComplete={() => {
                fetchCVs();
                closeForm();
              }}
            />
          </div>
        </>
      )}

      {/* Affichage du formulaire de modification dans une boîte modale */}
      {showEditForm && editingCV && (
        <>
          <div style={overlayStyle} onClick={closeForm}></div>
          <div style={modalStyle}>
            <EditCV
              token={token}
              initialData={editingCV}
              onComplete={() => {
                fetchCVs();
                closeForm();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCV;
