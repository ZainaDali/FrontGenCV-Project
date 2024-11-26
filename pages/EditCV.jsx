import React from "react";
import CVForm from "../src/components/CVForm";

const EditCV = ({ token, initialData, onComplete }) => {
  console.log("Données initiales reçues dans EditCV :", initialData);
  const handleSubmit = async (payload) => {
    console.log("Payload reçu :", payload);
    // Vérification que l'ID du CV est présent
    if (!initialData?._id) {
      console.error("Erreur : aucun ID trouvé pour la modification !");
      alert("Une erreur est survenue. Le CV à modifier est introuvable.");
      return;
    }

    const endpoint = `/api/api/cv/${initialData._id}`; // Endpoint pour modification uniquement

    try {
      const response = await fetch(endpoint, {
        method: "PATCH", // Méthode pour modification
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        throw new Error(`Erreur API : ${response.status}`);
      }

      const data = await response.json();
      console.log("Réponse API :", data);

      // Confirmation pour l'utilisateur
      alert("CV modifié avec succès !");
      onComplete(); // Callback pour rafraîchir les données ou retourner à la liste
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      alert("Une erreur est survenue lors de la modification du CV.");
    }
  };

  return (
    
    <div>
      <h3>Modifier le CV</h3>
      <CVForm onSubmit={handleSubmit} initialData={initialData} token={token} />
    </div>
  );
};

export default EditCV;
