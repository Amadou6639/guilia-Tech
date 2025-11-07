import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("week"); // day, week, month
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("admintoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔄 Tentative de connexion à l'API sur le port 5000...");

      const res = await fetch(
        `http://localhost:5000/api/visits/stats?period=${period}`,
        {
          headers: getAuthHeader(),
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/login-admin");
          return;
        }
        throw new Error(`Erreur serveur: ${res.status}`);
      }

      const data = await res.json();
      setStats(data);
      console.log("✅ Données reçues:", data);
    } catch (err) {
      console.error("❌ Erreur détaillée:", err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("Connection refused") ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Serveur backend non démarré. Démarrez le serveur sur le port 5000."
        );
      } else if (
        err.message.includes("Unexpected token") ||
        err.message.includes("JSON")
      ) {
        setError("Format de réponse invalide de l'API");
      } else {
        setError("Erreur de chargement: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [period, navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const getPeriodText = () => {
    switch (period) {
      case "day":
        return "aujourd'hui";
      case "week":
        return "cette semaine";
      case "month":
        return "ce mois";
      default:
        return "cette semaine";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Connexion au serveur...</p>
        <p className="text-sm text-gray-600 mt-2">
          Vérifie que le backend est démarré sur le port 5000
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur de connexion! </strong>
          <span className="block sm:inline">{error}</span>

          <div className="mt-4 p-4 bg-white rounded">
            <h3 className="font-semibold mb-2">Pour résoudre :</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Ouvre un terminal dans le dossier <strong>Backend</strong>
              </li>
              <li>
                Exécute : <code className="bg-gray-200 p-1 rounded">npm start</code>
              </li>
              <li>Attends le message "🚀 Serveur démarré sur le port 5000"</li>
              <li>Actualise cette page</li>
            </ol>

            <div className="mt-3 p-3 bg-yellow-50 rounded">
              <p className="text-sm text-yellow-800">
                <strong>💡 Astuce :</strong> Le backend doit tourner en
                parallèle du frontend
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={fetchStats}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ↻ Réessayer
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Actualiser la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Statistiques de Visites
        </h1>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
        </select>
      </div>

      {/* Carte total des visites */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Total des Visites
        </h2>
        <p className="text-4xl font-bold text-blue-600">
          {stats?.totalVisits ?? 0}
        </p>
        <p className="text-sm text-gray-600 mt-1">{getPeriodText()}</p>
      </div>

      {/* Carte pages populaires */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Pages les plus visitées
          </h2>
          <span className="text-sm text-gray-600">
            {stats?.visitsByPage?.length ?? 0} pages
          </span>
        </div>

        {stats?.visitsByPage?.length > 0 ? (
          <div className="space-y-3">
            {stats.visitsByPage.map((pageStat, index) => {
              const percentage =
                stats.totalVisits > 0
                  ? (pageStat.count / stats.totalVisits) * 100
                  : 0;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-700 block">
                      {pageStat.page}
                    </span>
                    <span className="text-sm text-gray-500">
                      {pageStat.count} visite{pageStat.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  {/* AMÉLIORATION DE LA BARRE DE PROGRESSION */}
                  <div className="flex items-center gap-3 w-1/2 md:w-1/3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-500">Aucune donnée de visite</p>
            <p className="text-sm text-gray-400 mt-1">
              Les visites apparaîtront ici après avoir navigué sur le site
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Visiter le site
            </button>
          </div>
        )}
      </div>

      {/* Bouton rafraîchir */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchStats}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Actualiser les statistiques
        </button>
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <details>
          <summary className="cursor-pointer font-medium text-gray-700">
            🔍 Informations de débogage
          </summary>
          <div className="mt-2 text-sm">
            <p>URL API: http://localhost:5000/api/visits/stats</p>
            <p>Période: {period}</p>
            <p>Données reçues: {stats ? "✅ Oui" : "❌ Non"}</p>
            <button
              onClick={() => console.log("Données stats:", stats)}
              className="mt-2 text-blue-600 text-sm"
            >
              Voir les données dans la console
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
