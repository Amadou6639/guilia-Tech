import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function UnderDevelopment() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Page en cours de développement</h1>
        <p className="text-lg text-gray-700 mb-8">Nous travaillons actuellement sur cette fonctionnalité. Revenez bientôt !</p>
        <Link 
          to="/"
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Retour à l'accueil
        </Link>
      </div>
      <Footer />
    </>
  );
}
