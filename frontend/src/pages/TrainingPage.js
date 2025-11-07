import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Composant réutilisable pour afficher une carte de service
const ServiceCard = ({ service }) => (
  <Link
    to={`/services/${service.id}`}
    className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <h3 className="text-xl font-bold text-blue-700">
      {service.icon} {service.title}
    </h3>
    <p className="mt-2 text-gray-600">
      {service.description.substring(0, 100)}...
    </p>
  </Link>
);

const TrainingPage = () => {
  const { t } = useTranslation();
  const [training, setTraining] = useState(null);
  const [otherServices, setOtherServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTraining = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/services/training`
        );
        const trainingData = response.data;
        setTraining(trainingData);

        // Si un service de formation a été trouvé (avec un ID), on récupère les services similaires.
        if (trainingData && trainingData.id !== null) {
          const similarResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/services/${trainingData.id}/similar?limit=3`
          );
          setOtherServices(similarResponse.data.services);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la formation:", err);
        // Affiche une erreur plus générique si le backend a un problème
        setError(
          err.response?.data?.error ||
            "Impossible de charger les informations sur la formation."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, []); // On retire 't' des dépendances pour n'exécuter l'effet qu'une seule fois.

  if (loading) {
    return (
      <div className="text-center py-20">
        {t("loading_training_page", "Chargement de la page de formation...")}
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  // Si training est null (ne devrait pas arriver avec la nouvelle logique backend, mais par sécurité)
  if (!training) {
    return (
      <div className="text-center py-20 text-gray-600">
        {t(
          "no_training_info_found",
          "Aucune information sur la formation n'a été trouvée."
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Section d'en-tête */}
      <div className="bg-blue-700 text-white text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
          <span className="text-5xl mr-4">{training.icon}</span>
          {training.title}
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
          {t(
            "training_subtitle",
            "Développez vos compétences et celles de vos équipes avec nos programmes sur mesure."
          )}
        </p>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Colonne principale avec la description */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t("about_this_training", "À propos de cette formation")}
            </h2>
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: training.description.replace(/\n/g, "<br />"),
              }}
            />
          </div>

          {/* Colonne latérale avec l'appel à l'action */}
          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-lg shadow-lg sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {t("interested_in_training", "Intéressé(e) ?")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t(
                  "contact_us_for_info",
                  "Contactez-nous pour obtenir un programme détaillé, un devis ou pour vous inscrire."
                )}
              </p>
              <Link
                to="/contact"
                className="w-full text-center bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 block"
              >
                {t("request_information", "Demander des informations")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section des autres services */}
      {otherServices.length > 0 && (
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Découvrez nos autres services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {otherServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPage;
