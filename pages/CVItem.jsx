import React from "react";

const CVItem = ({ cv, onEdit, onDelete }) => {
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
          onClick={onDelete}
          style={{ padding: "5px 10px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default CVItem;
