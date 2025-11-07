import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SimilarServices({ currentServiceId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentServiceId) return;

    const fetchSimilarServices = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${currentServiceId}/similar?limit=3`
        );
        if (!response.ok) {
          throw new Error("Erreur de chargement des services similaires.");
        }
        const data = await response.json();
        setServices(data.services || []);
      } catch (err) {
        console.error(err);
        // Ne pas afficher d'erreur à l'utilisateur pour cette section optionnelle
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarServices();
  }, [currentServiceId]);

  if (loading || services.length === 0) {
    return null; // Ne rien afficher si chargement ou si aucun service similaire
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Découvrez d'autres services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link
            to={`/services/${service.id}`}
            key={service.id}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h4 className="text-xl font-bold mb-2 text-blue-600">
              {service.title}
            </h4>
            <p className="text-gray-600 text-sm line-clamp-3">
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
