import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext'; // Import the hook correctly

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();  // Using the `useAuth` hook directly

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
