import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaBuilding, FaConciergeBell, FaCalendarAlt, FaBriefcase, FaMoneyBillWave } from 'react-icons/fa';

const HRDashboard = () => {
  const menuItems = [
    {
      path: '/admin/hrm/employees',
      icon: <FaUsers className="text-4xl text-blue-500" />,
      title: 'Personnel',
      description: 'Gérer les employés et leurs informations.'
    },
    {
      path: '/admin/hrm/departments',
      icon: <FaBuilding className="text-4xl text-green-500" />,
      title: 'Départements',
      description: 'Gérer les départements de l\'entreprise.'
    },
    {
      path: '/admin/hrm/services',
      icon: <FaConciergeBell className="text-4xl text-yellow-500" />,
      title: 'Services',
      description: 'Gérer les services offerts par l\'entreprise.'
    },
    {
      path: '/admin/hrm/functions',
      icon: <FaBriefcase className="text-4xl text-purple-500" />,
      title: 'Fonctions',
      description: 'Gérer les fonctions et les postes.'
    },
    {
      path: '/admin/hrm/salaries',
      icon: <FaMoneyBillWave className="text-4xl text-indigo-500" />,
      title: 'Salaires',
      description: 'Gérer les salaires des employés.'
    },
    {
      path: '/admin/hrm/leaves',
      icon: <FaCalendarAlt className="text-4xl text-red-500" />,
      title: 'Congés',
      description: 'Gérer les demandes de congés des employés.'
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              {item.icon}
              <h3 className="text-xl font-bold ml-4">{item.title}</h3>
            </div>
            <p className="mt-2 text-gray-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HRDashboard;
