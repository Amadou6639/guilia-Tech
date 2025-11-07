import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveModal = ({
  isOpen,
  onClose,
  onSave,
  leave,
  setLeave,
  employees,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave({ ...leave, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {leave && leave.id ? "Modifier le congé" : "Ajouter un congé"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(leave);
          }}
        >
          {!leave.id && (
            <div className="mb-4">
              <label
                htmlFor="employee_id"
                className="block text-sm font-medium text-gray-700"
              >
                Employé
              </label>
              <select
                id="employee_id"
                name="employee_id"
                value={leave.employee_id}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Sélectionner un employé</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="start_date"
              className="block text-sm font-medium text-gray-700"
            >
              Date de début
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={
                leave.start_date
                  ? new Date(leave.start_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="end_date"
              className="block text-sm font-medium text-gray-700"
            >
              Date de fin
            </label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={
                leave.end_date
                  ? new Date(leave.end_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Motif
            </label>
            <textarea
              id="reason"
              name="reason"
              value={leave.reason}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={leave.status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="En attente">En attente</option>
              <option value="Approuvé">Approuvé</option>
              <option value="Rejeté">Rejeté</option>
            </select>
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

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const { token: authToken, role, isLoading: isAuthLoading } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchLeaves = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLeaves(res.data.leaves || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés:", error);
      toast.error("Erreur lors de la récupération des congés.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, authToken]);

  const fetchEmployees = useCallback(async () => {
    if (!authToken) return;
    try {
      const res = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(res.data.employees || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      toast.error("Erreur lors de la récupération des employés.");
    }
  }, [API_URL, authToken]);

  useEffect(() => {
    if (authToken) {
      fetchLeaves();
      fetchEmployees();
    }
  }, [authToken, fetchLeaves, fetchEmployees]);

  const handleOpenModal = (leave = null) => {
    setSelectedLeave(
      leave
        ? { ...leave }
        : {
            employee_id: "",
            start_date: "",
            end_date: "",
            reason: "",
            status: "En attente",
          }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleSaveLeave = async (leave) => {
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    const leaveData = {
      start_date: leave.start_date,
      end_date: leave.end_date,
      reason: leave.reason,
      status: leave.status,
    };

    try {
      if (leave.id) {
        await axios.put(`${API_URL}/leaves/${leave.id}`, leaveData, config);
        toast.success("Congé mis à jour avec succès !");
      } else {
        await axios.post(
          `${API_URL}/leaves`,
          { ...leaveData, employee_id: leave.employee_id },
          config
        );
        toast.success("Congé ajouté avec succès !");
      }
      fetchLeaves();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du congé:", error);
      toast.error("Erreur lors de l'enregistrement du congé.");
    }
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce congé ?")) {
      try {
        await axios.delete(`${API_URL}/leaves/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        toast.success("Congé supprimé avec succès !");
        fetchLeaves();
      } catch (error) {
        console.error("Erreur lors de la suppression du congé:", error);
        toast.error("Erreur lors de la suppression du congé.");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approuvé":
        return "bg-green-100 text-green-800";
      case "Rejeté":
        return "bg-red-100 text-red-800";
      case "En attente":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Congés</h1>
        {!isAuthLoading && role === "super-admin" && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        )}
      </div>

      {isLoading || isAuthLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {leave.employee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(leave.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(leave.end_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-sm">
                    {leave.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!isAuthLoading && role === "super-admin" && (
                      <>
                        <button
                          onClick={() => handleOpenModal(leave)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteLeave(leave.id)}
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
      )}

      {isModalOpen && (
        <LeaveModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveLeave}
          leave={selectedLeave}
          setLeave={setSelectedLeave}
          employees={employees}
        />
      )}
    </div>
  );
};

export default Leaves;
