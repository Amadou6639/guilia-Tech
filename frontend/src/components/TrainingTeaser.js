import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useTranslation } from "react-i18next";

const TrainingTeaser = () => {
  const { t } = useTranslation();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("admintoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchTraining = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(
          "`${process.env.REACT_APP_API_URL}/api`/trainings",
          { headers: getAuthHeader() }
        );
=======
        const response = await api.get("/api/trainings", {
          headers: getAuthHeader(),
        });
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        // Assuming the API returns an array of trainings, take the first one
        if (response.data && response.data.length > 0) {
          setTraining(response.data[0]);
        } else {
          setTraining(null); // No training data available
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération de l'aperçu de la formation:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, []);

  // Pour ne pas "casser" la page d'accueil, on n'affiche rien en cas de chargement ou d'erreur.
  if (loading || !training) {
    return null;
  }

  // Fonction pour tronquer la description et garder un aperçu court
  const truncateDescription = (text, length = 180) => {
    if (!text || typeof text !== "string") return "";
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {training.icon} {t("our_training_title", "Nos Formations")}
        </h2>
        <p className="text-gray-600 md:w-2/3 mx-auto mb-8 leading-relaxed">
          {truncateDescription(training.description)}
        </p>
        <Link
          to="/training"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          {t("learn_more_button", "En savoir plus")}
        </Link>
      </div>
    </section>
  );
};

export default TrainingTeaser;
