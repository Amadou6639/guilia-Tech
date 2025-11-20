import { API_URL_WITH_PATH } from '../config/api';
import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${API_URL_WITH_PATH}/services/public`
        );
        if (!response.ok) {
          throw new Error("Erreur de chargement des services.");
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Nos Services
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Découvrez nos services de courtage et d'intermédiation technologique,
          conçus pour répondre à tous vos besoins numériques.
        </p>
        {loading && (
          <div className="text-center py-8">Chargement des services...</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8">
            <strong className="font-bold">Erreur de chargement ! </strong>
            <span className="block sm:inline">{error}</span>
            {error.includes("Failed to fetch") && (
              <div className="mt-4 p-4 bg-white rounded shadow-md">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Le serveur backend semble être hors ligne.
                </h3>
                <p className="text-sm text-gray-600">
                  Pour résoudre ce problème, veuillez démarrer le serveur
                  backend dans un terminal séparé :
                </p>
                <code className="block bg-gray-200 text-gray-800 p-2 rounded mt-2 text-sm">
                  cd Backend
                  <br />
                  npm start
                </code>
              </div>
            )}
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link
                to={`/services/${service.id}`}
                key={service.id}
                className="service-card-animate bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h2 className="text-2xl font-bold mb-2 text-blue-600">
                    {service.title}
                  </h2>
                  <p className="text-gray-700">{service.description}</p>
                  {service.responsable_name && (
                    <div className="mt-4 pt-4 border-t border-gray-200 w-full flex items-center justify-center">
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Responsable:</span> {service.responsable_name}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        {!loading && !error && services.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            Aucun service à afficher pour le moment.
          </div>
        )}
      </div>
    
    </>
  );
}
