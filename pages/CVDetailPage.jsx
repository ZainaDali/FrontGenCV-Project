import React from "react";
import { useParams } from "react-router-dom";

const CVDetailPage = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Détails du CV</h2>
      <p>Vous consultez le CV avec l'ID : {id}</p>
    </div>
  );
};

export default CVDetailPage;
