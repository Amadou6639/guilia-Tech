import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../api";

const FeaturedPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPartners = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch("`${process.env.REACT_APP_API_URL}/api`/partners");
        if (!response.ok) {
          throw new Error("Failed to fetch partners");
        }
        const data = await response.json();
=======
        const response = await api.get("/api/partners");
        const data = response.data;
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        // Sort partners by ID in descending order and take the first 4
        const latestPartners = data.sort((a, b) => b.id - a.id).slice(0, 4);
        setPartners(latestPartners);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        Chargement des partenaires en vedette...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur: {error}</div>;
  }

  if (partners.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun partenaire trouvé.
      </div>
    );
  }

  return (
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Nos Derniers Partenaires
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez les 4 derniers partenaires ajoutés.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <a
              href={formatUrl(partner.website_url)}
              key={partner.id}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow"
            >
              {partner.logo_url ? (
                <img
                  src={
                    partner.logo_url.startsWith("data:")
                      ? partner.logo_url
<<<<<<< HEAD
                      : `${process.env.REACT_APP_API_URL}${partner.logo_url}`
=======
                      : `${API_BASE_URL}${partner.logo_url}`
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
                  }
                  alt={partner.name}
                  className="h-24 w-48 object-contain mb-4"
                  loading="lazy"
                  width="192"
                  height="96"
                />
              ) : (
                <div className="h-24 flex items-center justify-center mb-4">
                  <span className="text-5xl text-gray-300">🏢</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                {partner.name}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPartners;
