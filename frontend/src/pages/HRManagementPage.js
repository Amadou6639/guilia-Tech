import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import HRDashboard from "../components/HRDashboard";

export default function HRManagementPage() {
  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Ressources Humaines
            </h1>
            <Link
              to="/admin/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            >
              &larr; Retour au tableau de bord
            </Link>
          </div>
          <HRDashboard />
        </div>
      </div>
    </>
  );
}
