// src/context/AuthContext.jsx
// Replaces the Supabase-based version
// Uses JWT tokens stored in localStorage

import { createContext, useContext, useState, useEffect } from 'react';
import { api, saveToken, clearToken } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if there's a saved token and if it's still valid
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Ask the server if the token is still valid
        const data = await api.verifyToken();
        if (data.valid) {
          setUser({ email: data.email });
        } else {
          clearToken();
        }
      } catch {
        // Token is expired or invalid - clear it
        clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const signIn = async (email, password) => {
    const data = await api.login(email, password);
    // data.token is the JWT from the server
    saveToken(data.token);
    setUser({ email: data.email });
    return data;
  };

  const signOut = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
