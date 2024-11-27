import React, { useState } from "react";

const EspacePersonnel = ({ token }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.firstname || !formData.lastname || !formData.email) {
      setErrorMessage("Tous les champs sont obligatoires.");
      setLoading(false);
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage("Adresse email invalide.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour.");
      }

      const updatedUser = await response.json();
      setSuccessMessage("Informations mises à jour avec succès !");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
      });

      console.log("Utilisateur mis à jour :", updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Espace Personnel</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">Prénom :</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            aria-label="Prénom"
          />
        </div>
        <div>
          <label htmlFor="lastname">Nom :</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            aria-label="Nom"
          />
        </div>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            aria-label="Email"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
};

export default EspacePersonnel;
