import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalaryModal = ({
  isOpen,
  onClose,
  onSave,
  salary,
  setSalary,
  employees,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary({ ...salary, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {salary && salary.id ? "Modifier le salaire" : "Ajouter un salaire"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(salary);
          }}
        >
          {!salary.id && (
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
                value={salary.employee_id}
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
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Salaire mensuel (FCFA)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={salary.amount}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="last_payment_date"
              className="block text-sm font-medium text-gray-700"
            >
              Dernier paiement
            </label>
            <input
              type="date"
              id="last_payment_date"
              name="last_payment_date"
              value={
                salary.last_payment_date
                  ? new Date(salary.last_payment_date)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="payment_status"
              className="block text-sm font-medium text-gray-700"
            >
              Statut paiement
            </label>
            <select
              id="payment_status"
              name="payment_status"
              value={salary.payment_status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="En attente">En attente</option>
              <option value="Payé">Payé</option>
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

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const { token: authToken, role, isLoading: isAuthLoading } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchSalaries = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/salaries`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSalaries(res.data.salaries || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des salaires:", error);
      toast.error("Erreur lors de la récupération des salaires.");
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
      fetchSalaries();
      fetchEmployees();
    }
  }, [authToken, fetchSalaries, fetchEmployees]);

  const handleOpenModal = (salary = null) => {
    setSelectedSalary(
      salary
        ? { ...salary }
        : {
            employee_id: "",
            amount: "",
            payment_status: "En attente",
            last_payment_date: "",
          }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSalary(null);
  };

  const handleSaveSalary = async (salary) => {
    const config = { headers: { Authorization: `Bearer ${authToken}` } };
    const salaryData = {
      amount: salary.amount,
      payment_status: salary.payment_status,
      last_payment_date: salary.last_payment_date || null,
    };

    try {
      if (salary.id) {
        await axios.put(
          `${API_URL}/salaries/${salary.id}`,
          salaryData,
          config
        );
        toast.success("Salaire mis à jour avec succès !");
      } else {
        await axios.post(
          `${API_URL}/salaries`,
          { ...salaryData, employee_id: salary.employee_id },
          config
        );
        toast.success("Salaire ajouté avec succès !");
      }
      fetchSalaries();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du salaire:", error);
      toast.error("Erreur lors de l'enregistrement du salaire.");
    }
  };

  const handleDeleteSalary = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce salaire ?")) {
      try {
        await axios.delete(`${API_URL}/salaries/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        toast.success("Salaire supprimé avec succès !");
        fetchSalaries();
      } catch (error) {
        console.error("Erreur lors de la suppression du salaire:", error);
        toast.error("Erreur lors de la suppression du salaire.");
      }
    }
  };

  const totalSalaries = salaries.length;
  const totalMonthlyBudget = salaries.reduce(
    (acc, salary) => acc + parseFloat(salary.amount),
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
        <h1 className="text-3xl font-bold">Gestion des Salaires</h1>
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
        <>
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du personnel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salaire mensuel (FCFA)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernier paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut paiement
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <tr key={salary.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {salary.employee_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseFloat(salary.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {salary.last_payment_date
                        ? new Date(
                            salary.last_payment_date
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          salary.payment_status === "Payé"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {salary.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!isAuthLoading && role === "super-admin" && (
                        <>
                          <button
                            onClick={() => handleOpenModal(salary)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteSalary(salary.id)}
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
                Total salaires
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalSalaries}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-600">
                Budget mensuel total
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {totalMonthlyBudget.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <SalaryModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSalary}
          salary={selectedSalary}
          setSalary={setSelectedSalary}
          employees={employees}
        />
      )}
    </div>
  );
};

export default Salaries;