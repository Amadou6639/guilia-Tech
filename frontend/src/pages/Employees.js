import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Employees = () => {
  const { token: authToken } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    service_id: "",
    hire_date: "",
    salary: "",
    phone: "",
    address: "",
    photo: "",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchData = useCallback(async () => {
    if (!authToken) return; // Ne rien faire si le token n'est pas encore prêt
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const employeesRes = await axios.get(`${API_URL}/employees`, config);
      const fetchedEmployees = employeesRes.data.employees || [];
      setEmployees(fetchedEmployees);

      // Vérifier si une redirection a demandé une modification
      if (location.state?.employeeToEditId) {
        const employeeToEdit = fetchedEmployees.find(
          (emp) => emp.id === location.state.employeeToEditId
        );
        if (employeeToEdit) {
          handleEditClick(employeeToEdit);
          navigate(location.pathname, { replace: true, state: {} }); // Nettoyer l'état de la location
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error(
        "Erreur lors du chargement des données. " +
          (error.response?.data?.error || error.message)
      );
      setEmployees([]); // Ensure employees is an array on error
    } finally {
      setLoading(false);
    }
  }, [API_URL, authToken, location.state, navigate]);

  const fetchServices = useCallback(async () => {
    if (!authToken) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const res = await axios.get(`${API_URL}/services`, config);
      setServices(res.data.services || []);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      toast.error(
        "Impossible de charger la liste des services. " +
          (error.response?.data?.error || error.message)
      );
    }
  }, [API_URL, authToken]);

  const fetchDepartments = useCallback(async () => {
    if (!authToken) return;
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      const res = await axios.get(`${API_URL}/departments`, config);
      setDepartments(res.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des départements:", error);
      toast.error(
        "Impossible de charger la liste des départements. " +
          (error.response?.data?.error || error.message)
      );
    }
  }, [API_URL, authToken]);

  useEffect(() => {
    if (authToken) {
      fetchData();
      fetchServices();
      fetchDepartments();
    }
  }, [authToken, fetchData, fetchServices, fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingEmployee) {
      setEditingEmployee((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (!authToken) {
      toast.error("Action non autorisée");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      await axios.post(`${API_URL}/employees`, newEmployee, config);
      setShowAddModal(false);
      setNewEmployee({
        name: "",
        email: "",
        position: "",
        service_id: "",
        hire_date: "",
        salary: "",
        phone: "",
        address: "",
        photo: "",
      });
      toast.success("Employé ajouté avec succès !");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast.error(
        "Erreur lors de l'ajout de l'employé. " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!authToken || !editingEmployee) {
      toast.error("Action non autorisée");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      await axios.put(
        `${API_URL}/employees/${editingEmployee.id}`,
        editingEmployee,
        config
      );
      setShowEditModal(false);
      setEditingEmployee(null);
      toast.success("Employé mis à jour avec succès !");
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      toast.error(
        "Erreur lors de la mise à jour de l'employé. " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      if (!authToken) {
        toast.error("Action non autorisée");
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${authToken}` } };
        await axios.delete(`${API_URL}/employees/${employeeId}`, config);
        toast.success("Employé supprimé avec succès !");
        fetchData(); // Refresh data
      } catch (error) {
        console.error("Erreur lors de la suppression de l'employé:", error);
        toast.error(
          "Erreur lors de la suppression de l'employé. " +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement des employés...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Liste des personnels
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">Nom</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Poste</th>
              <th className="py-3 px-6">Service</th>
              <th className="py-3 px-6">Téléphone</th>
              <th className="py-3 px-6">Adresse</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">{employee.name}</td>
                  <td className="py-4 px-6">{employee.email}</td>
                  <td className="py-4 px-6">{employee.position}</td>
                  <td className="py-4 px-6">
                    {employee.department_name || "N/A"}
                  </td>
                  <td className="py-4 px-6">{employee.phone || "N/A"}</td>
                  <td className="py-4 px-6">{employee.address || "N/A"}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="text-blue-600 hover:text-blue-800 font-semibold mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-6 text-center text-gray-500">
                  Aucun employé trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Ajouter un employé</h3>
            <form onSubmit={handleAddEmployee}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Poste
                </label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={newEmployee.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="service_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service
                </label>
                <select
                  name="service_id"
                  id="service_id"
                  value={newEmployee.service_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {loading ? (
                    <option value="" disabled>Chargement des services...</option>
                  ) : services.length > 0 ? (
                    <>
                      <option value="">Non assigné</option>
                      {services.map((service) => {
                        const department = departments.find(dep => dep.id === service.department_id);
                        return (
                          <option key={service.id} value={service.id}>
                            {service.title} {department ? `(${department.name})` : ""}
                          </option>
                        );
                      })}
                    </>
                  ) : (
                    <option value="" disabled>Aucun service disponible</option>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={newEmployee.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={newEmployee.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Modifier l'employé</h3>
            <form onSubmit={handleUpdateEmployee}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={editingEmployee.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={editingEmployee.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Poste
                </label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  value={editingEmployee.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="service_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service
                </label>
                <select
                  name="service_id"
                  id="service_id"
                  value={editingEmployee.service_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {loading ? (
                    <option value="" disabled>Chargement des services...</option>
                  ) : services.length > 0 ? (
                    <>
                      <option value="">Non assigné</option>
                      {services.map((service) => {
                        const department = departments.find(dep => dep.id === service.department_id);
                        return (
                          <option key={service.id} value={service.id}>
                            {service.title} {department ? `(${department.name})` : ""}
                          </option>
                        );
                      })}
                    </>
                  ) : (
                    <option value="" disabled>Aucun service disponible</option>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Téléphone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={editingEmployee.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={editingEmployee.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
