import React from 'react';

const partners = [
  { name: 'Partenaire A', logo: '/path/to/logoA.png' },
  { name: 'Partenaire B', logo: '/path/to/logoB.png' },
  { name: 'Partenaire C', logo: '/path/to/logoC.png' },
  { name: 'Partenaire D', logo: '/path/to/logoD.png' },
];

const Partners = () => {
  return (
    <section className="bg-gray-100 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Nos Partenaires de Confiance</h2>
          <p className="mt-4 text-lg text-gray-600">
            Nous collaborons avec les leaders de l'industrie pour vous offrir les meilleures solutions.
          </p>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {partners.map((partner) => (
              <div key={partner.name} className="flex justify-center items-center p-4 bg-white rounded-lg shadow-lg">
                {/* Replace with img tag when logos are available */}
                <span className="text-xl font-semibold text-gray-700">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
