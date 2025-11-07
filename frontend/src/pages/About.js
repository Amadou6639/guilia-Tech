import React from "react";
import { Link } from "react-router-dom";

// Icônes pour la section des valeurs (simples emojis pour l'exemple)
const ValueIcon = ({ icon, title }) => (
  <div className="text-center p-4">
    <div className="text-4xl mb-2">{icon}</div>
    <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
  </div>
);

export default function About() {
  return (
    <div className="bg-white">
      {/* Section d'en-tête */}
      <div className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 sm:text-5xl">
            À Propos de Guilia Tech Global Service
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Votre partenaire stratégique pour naviguer dans le paysage
            technologique avec confiance et innovation.
          </p>
        </div>
      </div>

      {/* Section Notre Histoire */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                Notre Histoire
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Fondée avec la vision de combler le fossé numérique au Tchad,
                Guilia Tech Global Service a commencé comme une modeste
                initiative visant à rendre la technologie accessible à tous.
                Nous avons rapidement compris que les entreprises et les
                particuliers avaient besoin non seulement d'outils, mais aussi
                d'un guide fiable pour les aider à choisir et à utiliser les
                bonnes solutions.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Aujourd'hui, nous sommes fiers d'être un acteur clé dans le
                courtage technologique, l'intermédiation et la formation, aidant
                nos clients à prospérer dans un monde de plus en plus numérique.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                alt="Équipe de Guilia Tech en réunion"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Mission et Vision */}
      <section className="bg-blue-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">
              Notre Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Démocratiser l'accès à la technologie et au savoir-faire numérique
              au Tchad et au-delà. Nous nous engageons à fournir des solutions
              sur mesure, des conseils d'experts et des formations pertinentes
              pour autonomiser les entreprises et les individus, stimulant ainsi
              la croissance économique et l'innovation locale.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-blue-700 mb-3">
              Notre Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Devenir le catalyseur de la transformation numérique en Afrique
              Centrale, en construisant un écosystème où la technologie est un
              levier de développement durable et d'opportunités pour tous. Nous
              aspirons à être reconnus pour notre intégrité, notre expertise et
              notre impact positif sur la communauté.
            </p>
          </div>
        </div>
      </section>

      {/* Section Nos Valeurs */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Nos Valeurs Fondamentales
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Les piliers qui guident chacune de nos actions et décisions.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ValueIcon icon="🤝" title="Partenariat" />
            <ValueIcon icon="💡" title="Innovation" />
            <ValueIcon icon="📈" title="Excellence" />
            <ValueIcon icon="💖" title="Intégrité" />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">
            Prêt à collaborer avec nous ?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Discutons de la manière dont nous pouvons vous aider à atteindre vos
            objectifs technologiques.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-block bg-white text-blue-700 font-bold px-8 py-3 rounded-full hover:bg-blue-100 transition-transform transform hover:scale-105"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </div>
  );
}
