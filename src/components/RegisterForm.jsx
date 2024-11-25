import React, { useState } from "react";

const RegisterForm = ({ onSubmit, error }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Appel de la fonction fournie via props
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Prénom :</label>
      <input
        type="text"
        name="firstname"
        value={formData.firstname}
        onChange={handleChange}
        required
      />
      <label>Nom :</label>
      <input
        type="text"
        name="lastname"
        value={formData.lastname}
        onChange={handleChange}
        required
      />
      <label>Email :</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <label>Mot de passe :</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">S'inscrire</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default RegisterForm;
