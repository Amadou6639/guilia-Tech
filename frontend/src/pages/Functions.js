import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modal Component
const FunctionModal = ({ isOpen, onClose, onSave, func, setFunc }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFunc({ ...func, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {func && func.id ? "Modifier la fonction" : "Ajouter une fonction"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(func);
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom de la fonction
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={func ? func.name : ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={func ? func.description : ""}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Functions = () => {
  const [functions, setFunctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const { token: authToken, role, isLoading: isAuthLoading } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchFunctions = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/functions`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setFunctions(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des fonctions:", error);
      toast.error(
        "Erreur lors de la récupération des fonctions. " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, authToken]);

  useEffect(() => {
    if (authToken) {
      fetchFunctions();
    }
  }, [authToken, fetchFunctions]);

  const handleOpenModal = (func = null) => {
    setSelectedFunction(func ? { ...func } : { name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFunction(null);
  };

  const handleSaveFunction = async (func) => {
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    const functionData = { name: func.name, description: func.description };

    try {
      if (func.id) {
        await axios.put(
          `${API_URL}/functions/${func.id}`,
          functionData,
          config
        );
        toast.success("Fonction mise à jour avec succès !");
      } else {
        await axios.post(`${API_URL}/functions`, functionData, config);
        toast.success("Fonction créée avec succès !");
      }
      fetchFunctions();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la fonction:", error);
      toast.error(
        "Erreur lors de l'enregistrement. " +
          (error.response?.data?.error || "Veuillez réessayer.")
      );
    }
  };

  const handleDeleteFunction = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette fonction ?")) {
      try {
        await axios.delete(`${API_URL}/functions/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        toast.success("Fonction supprimée avec succès !");
        fetchFunctions();
      } catch (error) {
        console.error("Erreur lors de la suppression de la fonction:", error);
        toast.error(
          "Erreur lors de la suppression. " +
            (error.response?.data?.error || "Veuillez réessayer.")
        );
      }
    }
  };

  const totalFunctions = functions.length;
  const totalEmployees = functions.reduce(
    (acc, func) => acc + (parseInt(func.employee_count, 10) || 0),
    0
  );

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des Fonctions</h1>
        {!isAuthLoading && role === "super-admin" && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ajouter une fonction
          </button>
        )}
      </div>

      {isLoading || isAuthLoading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre d’employés
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {functions.map((func) => (
                  <tr key={func.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {func.name}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-sm">
                      {func.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {func.employee_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!isAuthLoading && role === "super-admin" && (
                        <>
                          <button
                            onClick={() => handleOpenModal(func)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteFunction(func.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">
                Total fonctions
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalFunctions}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">
                Employés totaux
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalEmployees}
              </p>
            </div>
          </div>
        </>
      )}

      <FunctionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFunction}
        func={selectedFunction}
        setFunc={setSelectedFunction}
      />
    </div>
  );
};

export default Functions;
