import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value); // Appeler la fonction de recherche à chaque changement de texte
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={searchTerm}
        onChange={handleChange}
        style={{
          padding: "8px",
          width: "100%",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default SearchBar;
