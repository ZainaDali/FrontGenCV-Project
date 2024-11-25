import React, { useState } from "react";

const CVItem = ({ cv, onEdit, onDelete, onToggleVisibility }) => {
  const [isVisible, setIsVisible] = useState(cv.visibilite);

  const handleVisibilityToggle = async () => {
    // Changer l'état local de visibilité
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);

    // Appeler la fonction onToggleVisibility pour appliquer la modification à l'API
    await onToggleVisibility(cv._id, newVisibility); // Passer l'ID du CV et la nouvelle visibilité
  };

  return (
    <div className="cv-item" style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "5px", background: "#f9f9f9" }}>
      <h3>
        {cv.informationsPersonnelles?.prenom} {cv.informationsPersonnelles?.nom}
      </h3>
      <p>{cv.informationsPersonnelles?.description}</p>
      <h4>Éducation :</h4>
      <ul>
        {cv.education.map((edu, index) => (
          <li key={index}>
            {edu.diplome} - {edu.institution} ({edu.annee})
          </li>
        ))}
      </ul>
      <h4>Expériences professionnelles :</h4>
      <ul>
        {cv.experience.map((exp, index) => (
          <li key={index}>
            <strong>{exp.poste}</strong> chez {exp.entreprise} ({exp.duree})
            <br />
            Tâches : {exp.taches}
          </li>
        ))}
      </ul>
      <div className="cv-actions">
        <button
          onClick={() => onEdit(cv)} // Passer le CV à modifier
          style={{ marginRight: "10px", padding: "5px 10px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(cv._id)} // Passer l'ID du CV à supprimer
          style={{ marginRight: "10px", padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Supprimer
        </button>
        <button
          onClick={handleVisibilityToggle}
          style={{
            padding: "5px 10px",
            background: isVisible ? "#28a745" : "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isVisible ? "Visible" : "Invisible"}
        </button>
      </div>
    </div>
  );
};

export default CVItem;
