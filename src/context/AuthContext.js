import React, {createContext, useContext, useState, useEffect} from 'react';
import {storageService} from '../services/storageService';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await storageService.getToken();
        const savedUser = await storageService.getUser();
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (userData, authToken) => {
    await storageService.saveToken(authToken);
    await storageService.saveUser(userData);
    setToken(authToken);
    setUser(userData);
  };

  const logout = async () => {
    await storageService.clearAll();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, token, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
