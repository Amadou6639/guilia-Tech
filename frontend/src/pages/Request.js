import React, { useState } from "react";
import Footer from "../components/Footer";

export default function Request() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({ nom: "", email: "", tel: "", besoin: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Le nom est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "L'adresse email est invalide.";
    }
    if (!form.tel.trim()) newErrors.tel = "Le téléphone est requis.";
    if (!form.besoin.trim())
      newErrors.besoin = "La description du besoin est requise.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setSent(true);
    } catch (err) {
      setApiError("Impossible d'envoyer la demande. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-grow flex flex-col justify-center items-center p-8 w-full">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          {sent ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-green-100 text-green-800 p-8 rounded-lg shadow-lg text-center w-full">
              <h2 className="font-bold text-3xl mb-4">Demande envoyée !</h2>
              <p className="text-xl">Merci, nous vous recontacterons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
                </label>
                <input
                  id="nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="nom"
                  placeholder="Votre nom complet"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  placeholder="votre.email@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Téléphone
                </label>
                <input
                  id="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="tel"
                  name="tel"
                  placeholder="Votre numéro de téléphone"
                  value={form.tel}
                  onChange={handleChange}
                  required
                />
                {errors.tel && (
                  <p className="text-red-500 text-sm mt-1">{errors.tel}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="besoin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Votre besoin
                </label>
                <textarea
                  id="besoin"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="besoin"
                  placeholder="Décrivez votre besoin en quelques mots..."
                  value={form.besoin}
                  onChange={handleChange}
                  rows="4"
                  required
                />
                {errors.besoin && (
                  <p className="text-red-500 text-sm mt-1">{errors.besoin}</p>
                )}
              </div>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                type="submit"
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "Envoyer la demande"}
              </button>
              {apiError && (
                <div className="bg-red-100 text-red-800 p-3 rounded mt-4 text-center">
                  {apiError}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}