import React, { createContext, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null when logged out, user object when logged in

  const login = (userData) => setUser(userData); // Simulate login
  const logout = () => setUser(null);           // Simulate logout

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
