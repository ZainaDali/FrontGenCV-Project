import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Fonction pour récupérer les informations utilisateur
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert('Votre email a été modifié. Vous serez déconnecté.');
    navigate('/');
    window.location.reload();


    
  };
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://projetnode1.onrender.com/auth/me', {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations.');
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour les informations utilisateur
  const updateProfile = async (updates) => {
    try {
      console.log(updates)
      const response = await fetch('https://projetnode1.onrender.com/api/user', {
        method: 'PATCH', // Utilisation de PATCH pour les mises à jour partielles
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil.');
      }

      const data = await response.json();
      setUser(data); // Mettre à jour les informations localement
      alert('Profil mis à jour avec succès !');
    } catch (err) {
      console.log(updates)
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Mon Profil</h2>
      {user && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updates = {};
              const formData = new FormData(e.target);

              // Récupérer les champs modifiés uniquement
              formData.forEach((value, key) => {
                if (value !== user[key]) {
                  updates[key] = value;
                }
              });

              // Appeler la fonction de mise à jour uniquement si des changements ont été effectués
              
              if (updates.email && updates.email !== user.email) {

                  handleLogout()                  
                } else if (Object.keys(updates).length > 0) {
                  updateProfile(updates);
                  
                }
               else {
                alert('Aucun changement détecté.');
              }
            }}
          >
            <div>
              <label>Prénom :</label>
              <input name="firstname" defaultValue={user.firstname} />
            </div>
            <div>
              <label>Nom :</label>
              <input name="lastname" defaultValue={user.lastname} />
            </div>
            <div>
              <label>Email :</label>
              <input name="email" defaultValue={user.email} />
            </div>
            <button type="submit">Mettre à jour</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Profile;
