import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction utilitaire pour obtenir le header d'authentification
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("admintoken");
    if (!token) {
      navigate("/login-admin");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  // Fonction pour récupérer les abonnés depuis l'API
  const fetchSubscribers = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5000/api/subscribers", {
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          navigate("/login-admin");
        }
        throw new Error("Erreur de chargement des abonnés");
      }

      const data = await response.json();
      // Correction : L'API renvoie probablement un objet contenant la liste des abonnés.
      // Assurons-nous d'extraire le tableau (par exemple, data.subscribers)
      // et de fournir un tableau vide si les données sont absentes ou incorrectes.
      if (Array.isArray(data.subscribers)) {
        setSubscribers(data.subscribers);
      } else if (Array.isArray(data)) {
        // Au cas où l'API renverrait directement un tableau
        setSubscribers(data);
      } else {
        setSubscribers([]); // Fallback sécurisé
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  // Charger les données au premier rendu du composant
  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Fonction pour gérer la suppression d'un abonné
  const handleDelete = async (subscriberId) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cet abonné ? Cette action est irréversible."
      )
    ) {
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/subscribers/${subscriberId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("La suppression a échoué.");
      }

      // Mettre à jour l'état local pour retirer l'abonné de la liste
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub.id !== subscriberId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Chargement des abonnés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg max-w-md mx-auto">
        <p className="font-bold">Erreur :</p>
        <p>{error}</p>
        <button
          onClick={fetchSubscribers}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Gestion des Abonnés
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom Complet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {subscriber.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscriber.fullName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {subscriber.confirmed ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Confirmé
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      En attente
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <p className="text-center text-gray-500 py-8">Aucun abonné trouvé.</p>
        )}
      </div>
    </div>
  );
}
