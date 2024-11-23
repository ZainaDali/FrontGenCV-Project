import React, { useState, useContext } from "react";
import { CVContext } from "../context/CVContext";

const CVForm = ({ initialCV = {}, onSubmit }) => {
  const [cv, setCV] = useState(initialCV);
  const { addCV, editCV } = useContext(CVContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCV((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cv.id) editCV(cv.id, cv); // Si c'est une modification
    else addCV({ ...cv, id: Date.now() }); // Sinon, création
    onSubmit && onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Nom"
        value={cv.name || ""}
        onChange={handleChange}
      />
      <input
        name="surname"
        placeholder="Prénom"
        value={cv.surname || ""}
        onChange={handleChange}
      />
      <button type="submit">{cv.id ? "Modifier" : "Créer"}</button>
    </form>
  );
};

export default CVForm;
