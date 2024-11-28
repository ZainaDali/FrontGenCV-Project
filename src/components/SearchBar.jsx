import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Rechercher par nom ou prénom..."
      value={value} // Liaison avec la valeur passée en prop
      onChange={(e) => onChange(e.target.value)} // Appelle la fonction passée en prop
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
};

export default SearchBar;
