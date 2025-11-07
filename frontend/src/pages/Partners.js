import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import NewsletterSubscription from '../components/NewsletterSubscription';

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/partners');
        if (!response.ok) {
          throw new Error('Échec du chargement des partenaires');
        }
        const data = await response.json();
        setPartners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const formatUrl = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <>
      <div className="bg-gray-50 py-16 sm:py-20 min-h-screen">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">Nos Partenaires</h1>
            <p className="mt-4 text-lg text-gray-600">
              Découvrez les entreprises et experts qui nous font confiance et avec qui nous collaborons pour vous offrir le meilleur.
            </p>
          </div>

          {loading && <div className="text-center py-8">Chargement...</div>}
          {error && <div className="text-center py-8 text-red-500">{error}</div>}

          {!loading && !error && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {partners.map((partner) => (
                <a href={formatUrl(partner.website_url)} key={partner.id} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                  {partner.logo_url ? (
                    <img src={partner.logo_url.startsWith('data:') ? partner.logo_url : `http://localhost:5000${partner.logo_url}`} alt={partner.name} className="h-24 object-contain mb-4" />
                  ) : (
                    <div className="h-24 flex items-center justify-center mb-4">
                      <span className="text-5xl text-gray-300">🏢</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">{partner.name}</h3>
                </a>
              ))}
            </div>
          )}

          <div className="mt-20 max-w-2xl mx-auto">
            <NewsletterSubscription />
          </div>
        </div>
      </div>
      <Link
        to="/subscribe"
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg z-50"
      >
        S'abonner
      </Link>
      
    </>
  );
};

export default PartnersPage;
