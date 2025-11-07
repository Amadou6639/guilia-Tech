import React, { useState, useEffect } from "react";
import NotFound from "./NotFound";
import SimilarServices from "../components/SimilarServices";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams, useNavigate, Link } from "react-router-dom"; 
const socialIcons = {
  facebook: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  ),
  twitter: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
  ),
  linkedin: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  whatsapp: (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95l-1.4 5.02 5.13-1.37c1.43.81 3.06 1.24 4.77 1.24h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.53 16.02c-.28-.14-1.67-.82-1.93-.92-.26-.09-.45-.14-.64.14-.19.28-.73.92-.89 1.1-.16.19-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.37-1.2-1.06-1.68-2.25-1.89-2.63-.21-.38-.02-.59.12-.73.13-.13.28-.32.42-.48.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.87-2.1-.23-.56-.46-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.26.28-1 .97-1 2.38 0 1.41 1.02 2.76 1.17 2.95.14.19 2 3.19 4.84 4.25 2.84 1.06 2.84.71 3.35.68.51-.03 1.67-.68 1.9-1.33.24-.65.24-1.2.17-1.33-.07-.14-.26-.21-.53-.35z" />
    </svg>
  ),
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Effet pour mettre à jour le titre de la page
    if (service) {
      document.title = `${service.title} - Guilia Tech`;
    } else if (loading) {
      document.title = "Chargement du service... - Guilia Tech";
    } else if (error) {
      document.title = "Erreur - Guilia Tech";
    }

    // Fonction de nettoyage pour réinitialiser le titre quand on quitte la page
    return () => {
      document.title = "Guilia Tech Global Service";
    };
  }, [service, loading, error]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/services/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Service non trouvé");
          }
          throw new Error("Erreur de chargement du service.");
        }
        const data = await response.json();
        setService(data.service);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Chargement du service...</div>;
  }

  if (error === "Service non trouvé") {
    return <NotFound />;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  const shareUrl = window.location.href;
  const shareTitle = service?.title || "";
  const shareDescription = service?.description || "";
  const encodedShareTitle = encodeURIComponent(shareTitle);

  const breadcrumbCrumbs = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/services" },
    { label: service?.title, path: `/services/${id}` },
  ];

  return (
    <>
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-7xl mb-6">{service?.icon}</div>
            <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
              {service?.title}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {service?.description}
            </p>
          </div>

          {/* Section de partage */}
          <div className="mt-10 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Partager ce service
            </h3>
            <div className="flex justify-center items-center gap-4">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 transition-colors"
                title="Partager sur Facebook"
              >
                {socialIcons.facebook}
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  shareUrl
                )}&text=${encodedShareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-400 transition-colors"
                title="Partager sur Twitter"
              >
                {socialIcons.twitter}
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  shareUrl
                )}&title=${encodedShareTitle}&summary=${encodeURIComponent(
                  shareDescription
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                title="Partager sur LinkedIn"
              >
                {socialIcons.linkedin}
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodedShareTitle}%20${encodeURIComponent(
                  shareUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-green-500 transition-colors"
                title="Partager sur WhatsApp"
              >
                {socialIcons.whatsapp}
              </a>
            </div>

            {/* Section Services Similaires */}
            <SimilarServices currentServiceId={id} />
          </div>
        </div>
      </div>
    </>
  );
}
