import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // In een echte applicatie zou je hier een API call maken
    // Voor nu simuleren we verschillende gebruikersrollen
    if (username === 'hr_admin') {
      setUser({
        username,
        role: 'admin',
        permissions: ['manage_documents', 'manage_agents', 'use_chat']
      });
    } else {
      setUser({
        username,
        role: 'user',
        permissions: ['use_chat']
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
