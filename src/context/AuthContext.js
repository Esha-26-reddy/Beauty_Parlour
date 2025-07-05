import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // NEW

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser)); // make sure to parse JSON
  }, []);

  
  const login = (token, user) => {
  setToken(token);
  setUser(user);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  if (user?.email) {
    localStorage.setItem("userEmail", user.email); // ✅ Add this line
  }
};

 const logout = () => {
  setToken(null);
  setUser(null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail"); // ✅ clean up
};


  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
