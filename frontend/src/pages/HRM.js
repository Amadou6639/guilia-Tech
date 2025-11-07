import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// URL de base de votre backend (Assurez-vous que cette URL est correcte !)
const BASE_API_URL = "http://localhost:5000/api"; // VÉRIFIEZ ET AJUSTEZ CETTE VALEUR

// Définition d'un composant simple pour les placeholders non implémentés
const Placeholder = ({ title }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg mt-4 border border-gray-200">
    <h2 className="text-xl font-bold text-gray-700">{title}</h2>
    <p className="text-gray-500 mt-2">
      Cette section est en cours de développement.
    </p>
  </div>
);

// Composant Principal de Gestion des Ressources Humaines
const PersonnelManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);

  // ----------------------------------------------------
  // Fonction de Récupération des Données (API Backend)
  // ----------------------------------------------------
  const fetchHRMData = async () => {
    setLoading(true);
    setError(null);

    // 1. Récupérer le token depuis le Local Storage
    const adminToken = localStorage.getItem("admintoken");
    if (!adminToken) {
      setError(
        "Token d'administrateur manquant. Veuillez vous reconnecter via /login-admin."
      );
      setLoading(false);
      return;
    }

    // Configuration des en-têtes d'autorisation
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken}`,
    };

    // Fonction utilitaire pour récupérer une collection
    const fetchCollection = async (endpoint, setter) => {
      try {
        const response = await fetch(`${BASE_API_URL}${endpoint}`, { headers });

        // Gérer l'erreur 401 Unauthorized (Probablement l'erreur 'jwt malformed')
        if (response.status === 401) {
          throw new Error(
            `Erreur d'authentification (401). Le token est malformé ou expiré. Backend: ${BASE_API_URL}`
          );
        }

        if (!response.ok) {
          throw new Error(
            `Échec de la récupération des données de l'API (${response.status} ${response.statusText})`
          );
        }

        const data = await response.json();
        // S'assurer que les données reçues sont un tableau ou extraire le tableau 'data' si l'API l'encapsule
        setter(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(`Erreur lors du fetch de ${endpoint}:`, err);
        setError((prev) => (prev ? prev + ` | ${err.message}` : err.message));
      }
    };

    // 2. Lancement des requêtes pour Départements et Services
    await Promise.all([
      // Les endpoints sont relatifs à BASE_API_URL.
      fetchCollection("/departments", setDepartments), // Endpoint suggéré
      fetchCollection("/services", setServices), // Endpoint suggéré
    ]);

    setLoading(false);
  };

  useEffect(() => {
    fetchHRMData();
  }, []); // Exécuté une seule fois au montage du composant

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-lg text-gray-700">
          Chargement de l'interface GRH via API...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border-l-4 border-red-500 text-red-700 m-8 rounded-lg shadow-lg">
        <p className="font-bold">Erreur de Connexion à l'API</p>
        <p>Une erreur s'est produite : {error}</p>
        <p className="mt-2 text-sm">
          Si l'erreur est un **401/JWT**, supprimez le `adminToken` de votre
          Local Storage et reconnectez-vous.
        </p>
        <p className="mt-2 text-sm">
          Vérifiez aussi que votre backend est démarré et que l'URL
          `BASE_API_URL` est correcte.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        {t("Personnel Management")} - Tableau de Bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">
            Départements Chargés
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {departments.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Services Chargés</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {services.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">API de Base</p>
          <p
            className="mt-1 text-md font-mono text-gray-600 truncate"
            title={BASE_API_URL}
          >
            {BASE_API_URL}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Aperçu des Données Récupérées
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
            <h3 className="font-semibold text-lg mb-2 text-blue-600">
              Liste des Départements
            </h3>
            <ul className="space-y-1 h-48 overflow-y-auto p-2 bg-gray-50 rounded">
              {departments.length === 0 ? (
                <li className="text-sm text-red-500">
                  Aucun département trouvé.
                </li>
              ) : (
                departments.map((dept) => (
                  <li
                    key={dept.id || dept.name}
                    className="text-sm text-gray-700 border-b last:border-b-0 py-1"
                  >
                    {dept.name || `Département ID: ${dept.id}`}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
            <h3 className="font-semibold text-lg mb-2 text-green-600">
              Liste des Services
            </h3>
            <ul className="space-y-1 h-48 overflow-y-auto p-2 bg-gray-50 rounded">
              {services.length === 0 ? (
                <li className="text-sm text-red-500">Aucun service trouvé.</li>
              ) : (
                services.map((service) => (
                  <li
                    key={service.id || service.name}
                    className="text-sm text-gray-700 border-b last:border-b-0 py-1"
                  >
                    {service.name || `Service ID: ${service.id}`}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <Placeholder title="Gestion du Personnel" />
    </div>
  );
};

export default PersonnelManagement;
