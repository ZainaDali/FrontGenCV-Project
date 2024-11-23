import React, { useState } from "react";
import CreateCV from "./CreateCV";


const ManageCV = () => {
  const [cvs, setCVs] = useState([]);
  const [editingCV, setEditingCV] = useState(null);

  // Ajouter un nouveau CV
  const handleAddCV = (cv) => {
    if (editingCV) {
      // Modification d'un CV existant
      setCVs(
        cvs.map((existingCV) =>
          existingCV.id === editingCV.id ? { ...editingCV, ...cv } : existingCV
        )
      );
      setEditingCV(null);
    } else {
      // Création d'un nouveau CV
      setCVs([...cvs, { ...cv, id: Date.now() }]);
    }
  };

  // Supprimer un CV
  const handleDeleteCV = (id) => {
    setCVs(cvs.filter((cv) => cv.id !== id));
  };

  // Modifier un CV
  const handleEditCV = (id) => {
    const cvToEdit = cvs.find((cv) => cv.id === id);
    setEditingCV(cvToEdit);
  };

  return (
    <div className="manage-cv">
      <h2>Gérer mes CV</h2>
      <div className="cv-list">
        {cvs.map((cv) => (
          <div key={cv.id} className="cv-item">
            <h3>
              {cv.personalInfo?.name} {cv.personalInfo?.surname}
            </h3>
            <p>{cv.personalInfo?.description}</p>
            <div className="cv-actions">
              <button onClick={() => handleEditCV(cv.id)}>Modifier</button>
              <button onClick={() => handleDeleteCV(cv.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <h2>{editingCV ? "Modifier le CV" : "Créer un nouveau CV"}</h2>
      <CreateCV onSubmit={handleAddCV} existingCV={editingCV} />
    </div>
  );
};

export default ManageCV;
