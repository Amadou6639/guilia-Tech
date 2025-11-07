import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    responsable_id: "",
    department_id: "",
  });

  useEffect(() => {
    fetchServices();
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      const response = await axios.get("http://localhost:5000/api/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
      toast.error(
        "Erreur lors de la récupération des services: " + error.message
      );
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      const response = await axios.get("http://localhost:5000/api/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      toast.error(
        "Erreur lors de la récupération des employés: " + error.message
      );
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("admintoken");
      const response = await axios.get(
        "http://localhost:5000/api/departments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDepartments(response.data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
      toast.error(
        "Erreur lors de la récupération des départements: " + error.message
      );
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admintoken");
      await axios.post("http://localhost:5000/api/services", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
      setFormData({
        title: "",
        description: "",
        icon: "",
        responsable_id: "",
        department_id: "",
      });
      toast.success("Service créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
      toast.error(
        "Erreur lors de la création du service: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admintoken");
      await axios.put(
        `http://localhost:5000/api/services/${editingService.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchServices();
      setEditingService(null);
      setFormData({
        title: "",
        description: "",
        icon: "",
        responsable_id: "",
        department_id: "",
      });
      toast.success("Service mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error);
      toast.error(
        "Erreur lors de la mise à jour du service: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("admintoken");
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
      toast.success("Service supprimé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression du service:", error);
      toast.error(
        "Erreur lors de la suppression du service: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const startEditing = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      responsable_id: service.responsable_id || "",
      department_id: service.department_id || "",
    });
  };

  const cancelEditing = () => {
    setEditingService(null);
    setFormData({
      title: "",
      description: "",
      icon: "",
      responsable_id: "",
      department_id: "",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <h1 className="text-2xl font-bold mb-4">Gestion des Services</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {editingService ? "Modifier le service" : "Créer un service"}
        </h2>
        <form onSubmit={editingService ? handleUpdate : handleCreate}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du service
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700"
            >
              Icône
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="responsable_id"
              className="block text-sm font-medium text-gray-700"
            >
              Responsable
            </label>
            <select
              id="responsable_id"
              name="responsable_id"
              value={formData.responsable_id}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un responsable</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="department_id"
              className="block text-sm font-medium text-gray-700"
            >
              Département
            </label>
            <select
              id="department_id"
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un département</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingService ? "Mettre à jour" : "Créer"}
            </button>
            {editingService && (
              <button
                type="button"
                onClick={cancelEditing}
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Liste des Services</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Département</th>
                <th className="py-2 px-4 border-b">Responsable</th>
                <th className="py-2 px-4 border-b">Employés</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="py-2 px-4 border-b">{service.title}</td>
                  <td className="py-2 px-4 border-b">
                    {service.department_name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {service.responsable_name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {service.employee_count}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => startEditing(service)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageServices;
