import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <img src="/favicon.ico" alt="Logo Guilia Tech" className="w-24 h-24 mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page non trouvée</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Nous ne trouvons pas la page recherchée. Vérifiez que l'URL saisie ne contient pas d'erreur.
        </p>
        <Link 
          to="/"
          className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Retour à l'accueil
        </Link>
      </div>
  
    </>
  );
}