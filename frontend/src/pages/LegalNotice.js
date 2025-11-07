import React from 'react';

export default function LegalNotice() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-md rounded-lg my-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Mentions Légales</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Informations Légales</h2>
        <p className="text-gray-700 mb-2">
          Nom de l'entreprise : Guilia Tech Global Service
        </p>
        <p className="text-gray-700 mb-2">
          Forme juridique : URL Auto-entreprise
        </p>
        <p className="text-gray-700 mb-2">
          Adresse du siège social : Quartier Amriguebe, N'Djamena, Tchad
        </p>
        <p className="text-gray-700 mb-2">
          Numéro de téléphone : +235 66 39 68 16 / +235 99 39 68 16 / +235 63 93 76 76
        </p>
        <p className="text-gray-700 mb-2">
          Adresse e-mail : guiliatechnologie@gmail.com
        </p>
        <p className="text-gray-700 mb-2">
          Numéro d'immatriculation (R.C.S. / Registre du Commerce) : A11-00098
        </p>
        <p className="text-gray-700 mb-2">
          Capital social : 200 000 FCFA
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Hébergeur</h2>
        <p className="text-gray-700 mb-2">
          Nom de l'hébergeur : [À compléter, ex: OVH, Gandi, AWS]
        </p>
        <p className="text-gray-700 mb-2">
          Adresse de l'hébergeur :[À compléter]
        </p>
        <p className="text-gray-700 mb-2">
          Numéro de téléphone de l'hébergeur :[À compléter]
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Propriété Intellectuelle</h2>
        <p className="text-gray-700">
          L'ensemble de ce site relève de la législation tchadienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Limitation de Responsabilité</h2>
        <p className="text-gray-700">
          Guilia Tech Global Service s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, Guilia Tech Global Service ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à la disposition sur ce site. En conséquence, Guilia Tech Global Service décline toute responsabilité pour toute interruption du site, problèmes techniques, pour toute inexactitude ou omission portant sur des informations disponibles sur le site, pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à la disposition sur le site.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Données Personnelles</h2>
        <p className="text-gray-700">
          Guilia Tech Global Service s'engage à protéger la confidentialité des informations fournies en ligne par l'internaute. Toute information personnelle que l'internaute serait amené à transmettre à Guilia Tech Global Service pour l'utilisation de certains services est soumise aux dispositions de la Loi n° 007/PR/2015 portant protection des données à caractère personnel au Tchad. L'internaute dispose d'un droit d'accès, de rectification et de suppression des données personnelles le concernant. Pour l'exercer, adressez votre demande par e-mail à guiliatechnologie@gmail.com.
        </p>
      </section>
    </div>
  );
}
