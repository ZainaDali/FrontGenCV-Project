import React, { createContext, useState } from "react";

// Initialisez le contexte
export const CVContext = createContext();

export const CVProvider = ({ children }) => {
  const [cvs, setCVs] = useState([]); // Stockage des CV
  const [visibility, setVisibility] = useState({}); // Gestion de la visibilité

  // Ajout d'un CV
  const addCV = (cv) => setCVs((prev) => [...prev, cv]);

  // Modification d'un CV
  const editCV = (id, updatedCV) =>
    setCVs((prev) => prev.map((cv) => (cv.id === id ? updatedCV : cv)));

  // Suppression d'un CV
  const deleteCV = (id) => setCVs((prev) => prev.filter((cv) => cv.id !== id));

  // Gestion de la visibilité
  const toggleVisibility = (id) =>
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <CVContext.Provider
      value={{ cvs, addCV, editCV, deleteCV, visibility, toggleVisibility }}
    >
      {children}
    </CVContext.Provider>
  );
};
