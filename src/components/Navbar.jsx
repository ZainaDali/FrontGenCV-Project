import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import '../styleNavbar/Navbar.css';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  // Vérifier si l'utilisateur est connecté en consultant le token dans localStorage
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true); // L'utilisateur est connecté
    } else {
      setIsAuthenticated(false); // L'utilisateur n'est pas connecté
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false); // Mettre à jour l'état pour refléter la déconnexion
    navigate('/'); 
    window.location.reload();
    
  };

  return (
    <nav className="navbar">
      <h1 ><Link to="/" >Générateur de CV</Link></h1>
      <ul >
        {!isAuthenticated ? (
          <>
            <li>
              <Link to="/login" >Connexion</Link>
            </li>
            <li>
              <Link to="/register" >Inscription</Link>
            </li>
          </>
        ) : (
          <>
          <li>
              <Link to="/" >Accueil</Link>
            </li>
            <li>
              <Link to="/manage-cv" >Gérer mes CV</Link>
            </li>
            <li>
              <Link to="/Profile" >Profil</Link>
            </li>
            <li>
              <button onClick={handleLogout} >Déconnexion</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
