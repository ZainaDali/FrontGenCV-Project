import React from "react";
import CVForm from "../src/components/CVForm";

const CreateCV = ({onComplete}) => {
  const handleSubmit = async (payload) => {
    console.log("Payload reçu pour création :", payload); // Vérification du payload

    try {
      const response = await fetch("/api/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDFkNzg1YzU1NDc3N2EwMDcwMzlhNCIsImVtYWlsIjoiaW1hbmUuemF6YXJpQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMyNTU5NzE2LCJleHAiOjE3MzI1NjMzMTZ9.EZK6NLTTH_kyWvLpR5R18GSSKM6oFqp-fD2TS1R_vTY",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData); // Log de l'erreur côté API
        throw new Error(`Erreur API : ${response.status}`);
      }

      const data = await response.json();
      console.log("Réponse de l'API :", data); // Vérification de la réponse API
      alert("CV créé avec succès !");
      onComplete();
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert("Une erreur est survenue lors de la création du CV.");
    }
  };

  return <CVForm onSubmit={handleSubmit} />;
};

export default CreateCV;
