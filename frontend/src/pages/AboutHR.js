import React from 'react';

const Placeholder = ({ title }) => (
  <div className="text-center py-16 bg-gray-100 rounded-lg">
    <h3 className="text-2xl font-semibold text-gray-700">Section : {title}</h3>
    <p className="text-gray-500 mt-2">
      Cette fonctionnalité est en cours de développement.
    </p>
  </div>
);

const AboutHR = () => {
  return <Placeholder title="À propos" />;
};

export default AboutHR;
