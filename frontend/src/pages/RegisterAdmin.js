import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validations de base
    if (!name || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
          const token = localStorage.getItem("admintoken");      
      const response = await fetch(
        "http://localhost:5000/api/auth/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Ajouter le token d'authentification
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          // Si le token est invalide, rediriger vers la connexion
          navigate("/login-admin");
        }
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Une erreur est survenue lors de l'inscription."
        );
      }

      const data = await response.json();
      console.log("Inscription réussie:", data);
      setSuccess(
        "Inscription réussie ! Vous allez être redirigé vers le tableau de bord."
      );
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      // Affiche l'erreur venant de l'API ou un message générique
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Inscription Administrateur
        </h2>
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {success}
          </p>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
        >
          S'inscrire
        </button>
        <p className="text-center mt-4 text-sm">
          {/* Correction: Utilisation du commentaire JSX */}
          <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
            Retour au tableau de bord
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterAdmin;
