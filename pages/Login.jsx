import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../src/components/LoginForm";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await fetch("/auth/login", {
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
      localStorage.setItem("token", data.token); // Stocker le token dans le localStorage
      alert(data.message);
      navigate("/manage-cv"); // Redirection après connexion réussie
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Erreur serveur. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div>
      <h2>Connexion</h2>
      <LoginForm onSubmit={handleLogin} error={error} />
    </div>
  );
};

export default Login;

  