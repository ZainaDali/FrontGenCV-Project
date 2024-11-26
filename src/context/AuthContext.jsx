import React, { createContext, useState, useContext } from 'react';

// Créer un contexte d'authentification
const AuthContext = createContext();

// Fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Fonction de login
  const login = async (email, password) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Échec de la connexion');
      }

      const data = await response.json();
      setToken(data.token); // Sauvegarder le token dans l'état
      localStorage.setItem('token', data.token); // Sauvegarder le token dans localStorage
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;  // Vous pouvez également gérer les erreurs ici, comme afficher un message à l'utilisateur
    }
  };

  // Fonction de logout
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => useContext(AuthContext);
