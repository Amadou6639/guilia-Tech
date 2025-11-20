import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { API_BASE_URL } from "../api";

export default function HRManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    address: "",
    department_id: "",
  });
  const [editingEmployee, setEditingEmployee] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("admintoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
<<<<<<< HEAD
      const response = await fetch("`${process.env.REACT_APP_API_URL}/api`/employees", {
=======
      const response = await api.get("/api/employees", {
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        headers: getAuthHeader(),
      });
      const data = response.data;
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
<<<<<<< HEAD
      const response = await fetch("`${process.env.REACT_APP_API_URL}/api`/departments", {
=======
      const response = await api.get("/api/departments", {
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        headers: getAuthHeader(),
      });
      const data = response.data;
      setDepartments(data);
    } catch (err) {
      setError(
        (prev) =>
          prev + "\nErreur de chargement des départements: " + err.message
      );
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch("`${process.env.REACT_APP_API_URL}/api`/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
=======
      const response = await api.post(
        "/api/employees",
        {
          name: newEmployee.name,
          email: newEmployee.email,
          position: newEmployee.position,
          phone: newEmployee.phone,
          address: newEmployee.address,
          department_id: newEmployee.department_id,
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      if (!response || (response.status && response.status >= 400)) {
        throw new Error("Erreur lors de l'ajout de l'employé");
      }

      setNewEmployee({ name: "", email: "", position: "", department_id: "" });
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!editingEmployee) return;

    try {
<<<<<<< HEAD
      const response = await fetch(
        ``${process.env.REACT_APP_API_URL}/api`/employees/${editingEmployee.id}`,
=======
      const response = await api.put(
        `/api/employees/${editingEmployee.id}`,
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
        {
          name: editingEmployee.name,
          email: editingEmployee.email,
          position: editingEmployee.position,
          phone: editingEmployee.phone,
          address: editingEmployee.address,
          department_id: editingEmployee.department_id,
        },
        { headers: { "Content-Type": "application/json", ...getAuthHeader() } }
      );

      if (!response || (response.status && response.status >= 400)) {
        const errorData = response.data;
        throw new Error(
          errorData?.error || "Erreur lors de la mise à jour de l'employé"
        );
      }

      setEditingEmployee(null); // Fermer la modale
      fetchEmployees(); // Rafraîchir la liste
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet employé ?")) return;

    try {
<<<<<<< HEAD
      const response = await fetch(
        ``${process.env.REACT_APP_API_URL}/api`/employees/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );
=======
      const response = await api.delete(`/api/employees/${id}`, {
        headers: getAuthHeader(),
      });
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)

      if (!response || (response.status && response.status >= 400)) {
        throw new Error("Erreur lors de la suppression de l'employé");
      }

      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-12 relative">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Gestion des Ressources Humaines
      </h2>

      {/* Add Employee Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Ajouter un nouvel employé
        </h3>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nom de l'employé"
            value={newEmployee.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email de l'employé"
            value={newEmployee.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="position"
            placeholder="Poste de l'employé"
            value={newEmployee.position}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Téléphone de l'employé"
            value={newEmployee.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Adresse de l'employé"
            value={newEmployee.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="department_id"
            value={newEmployee.department_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Sélectionner un département</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddEmployee}
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start"
          >
            Ajouter l'employé
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Employees List */}
      {loading ? (
        <div className="text-center py-8">Chargement des employés...</div>
      ) : employees.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun employé trouvé.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left w-20">Photo</th>
                <th className="border p-3 text-left">Nom</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Poste</th>
                <th className="border p-3 text-left">Téléphone</th>
                <th className="border p-3 text-left">Département</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="border p-2 text-center">
                    <img
<<<<<<< HEAD
                      src={employee.photo ? ``${process.env.REACT_APP_API_URL}`${employee.photo}` : '/default-avatar.png'}
=======
                      src={
                        employee.photo
                          ? `${API_BASE_URL}${employee.photo}`
                          : "/default-avatar.png"
                      }
>>>>>>> 0f261a1 (refactor(api): centralize API base URL and replace direct http://localhost:5000 usages)
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </td>
                  <td className="border p-3">
                    <Link
                      to={`/admin/hrm/employees/${employee.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {employee.name}
                    </Link>
                  </td>
                  <td className="border p-3">{employee.email}</td>
                  <td className="border p-3">{employee.position}</td>
                  <td className="border p-3">{employee.phone || "N/A"}</td>
                  <td className="border p-3">
                    {employee.department_name || "Non assigné"}
                  </td>
                  <td className="border p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingEmployee({ ...employee })}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6">Modifier l'employé</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nom de l'employé"
                value={editingEmployee.name}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    name: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                placeholder="Email de l'employé"
                value={editingEmployee.email}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    email: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="position"
                placeholder="Poste de l'employé"
                value={editingEmployee.position}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    position: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="phone"
                placeholder="Téléphone de l'employé"
                value={editingEmployee.phone || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    phone: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                name="address"
                placeholder="Adresse de l'employé"
                value={editingEmployee.address || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    address: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                name="department_id"
                value={editingEmployee.department_id || ""}
                onChange={(e) =>
                  setEditingEmployee({
                    ...editingEmployee,
                    department_id: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">Sélectionner un département</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setEditingEmployee(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
