import React, { useState } from "react";
import api from "../api";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/subscribers", {
        email,
        fullName,
        phoneNumber,
      });
      const data = response.data;

      if (!response || (response.status && response.status >= 400)) {
        throw new Error(data?.error || "Erreur lors de l'abonnement.");
      }

      setMessage(data.message || "Vous êtes bien inscrit.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Abonnez-vous à notre Newsletter
      </h2>

      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded text-center">
          <h3 className="font-bold text-lg">{message}</h3>
          <p className="mt-2">
            Veuillez consulter votre boîte de réception pour confirmer votre
            abonnement.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Si vous ne recevez pas l'email, vérifiez votre dossier de spams.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-gray-600">
            Recevez nos dernières actualités et offres directement dans votre
            boîte mail.
          </p>
          <div>
            <label htmlFor="fullName-newsletter" className="sr-only">
              Nom complet
            </label>
            <input
              id="fullName-newsletter"
              type="text"
              placeholder="Votre nom complet (optionnel)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email-newsletter" className="sr-only">
              Email
            </label>
            <input
              id="email-newsletter"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber-newsletter" className="sr-only">
              Numéro de téléphone
            </label>
            <input
              id="phoneNumber-newsletter"
              type="tel"
              placeholder="Votre téléphone (optionnel)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Envoi en cours..." : "S'abonner"}
          </button>
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mt-4">
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
