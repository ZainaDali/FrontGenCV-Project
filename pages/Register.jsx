import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../src/components/RegisterForm";

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      const response = await fetch("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      const data = await response.json();
      alert(data.message);
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div>
      <h2>Créer un compte</h2>
      <RegisterForm onSubmit={handleRegister} error={error} />
    </div>
  );
};

export default Register;
