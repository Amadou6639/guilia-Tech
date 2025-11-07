import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Création du contexte
export const AuthContext = createContext(null);

// 2. Création du "Provider" (fournisseur de contexte)
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Ajout de l'état de chargement

  // Au chargement, vérifier si un admin est déjà connecté via localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("admintoken");
    const storedAdmin = localStorage.getItem("admin");
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    } else {
      setToken(null);
      setAdmin(null);
    }
    setLoading(false); // ✅ Fin du chargement
  }, []);

  // Fonction de connexion
  const login = (adminData, authToken) => {
    localStorage.setItem("admintoken", authToken);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setToken(authToken);
    setAdmin(adminData);
  };

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem("admintoken");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
    // Rediriger vers la page de connexion après déconnexion
    window.location.href = '/admin/login';
  };

  const value = {
    admin,
    token,
    isAuthenticated: !!token,
    loading, // Exposer l'état de chargement
    login,
    logout,
    role: admin?.role,
  };

  // Ne rend les enfants que si le chargement initial est terminé
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Création d'un hook personnalisé pour utiliser le contexte facilement
export const useAuth = () => {
  return useContext(AuthContext);
};
