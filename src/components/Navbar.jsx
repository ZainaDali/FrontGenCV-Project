import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté en consultant le token dans localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true); // L'utilisateur est connecté
    } else {
      setIsAuthenticated(false); // L'utilisateur n'est pas connecté
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Mettre à jour l'état pour refléter la déconnexion
  };

  return (
    <nav style={styles.navbar}>
      <h1 style={styles.title}>Générateur de CV</h1>
      <ul style={styles.navList}>
        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/login" style={styles.link}>Connexion</Link>
            </li>
            <li>
              <Link to="/register" style={styles.link}>Inscription</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/manage-cv" style={styles.link}>Gérer mes CV</Link>
            </li>
            <li>
              <button onClick={handleLogout} style={styles.link}>Déconnexion</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

// Styles simples pour la barre de navigation
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#282c34",
    color: "white",
  },
  title: {
    fontSize: "20px",
  },
  navList: {
    listStyle: "none",
    display: "flex",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
};

export default Navbar;
