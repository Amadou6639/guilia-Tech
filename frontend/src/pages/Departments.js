import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "react-toastify/dist/ReactToastify.css";

// Modal Component
const DepartmentModal = ({
  isOpen,
  onClose,
  onSave,
  department,
  setDepartment,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(department);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {department && department.id
            ? "Modifier le département"
            : "Ajouter un département"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom du département
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={department ? department.name : ""}
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
              value={department ? department.description : ""}
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

const EmployeeListModal = ({
  isOpen,
  onClose,
  departmentName,
  employees,
  loading,
  departmentId,
  apiUrl,
  onEditEmployee,
  onAddEmployee,
  onAssignEmployee,
  onExportEmployees
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Employés : <span className="text-blue-600">{departmentName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {loading ? (
            <p>Chargement des employés...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Aucun employé n'est assigné à ce département.
            </p>
          ) : (
            <ul className="space-y-3">
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className="p-3 bg-gray-50 rounded-md border"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {employee.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {employee.position}
                      </p>
                    </div>
                    <button
                      onClick={() => onEditEmployee(employee.id)}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 font-semibold"
                    >
                      Modifier
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-4">
          {!loading && employees.length > 0 && (
            <button
              onClick={() => onExportEmployees(departmentId, departmentName)}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              Exporter en CSV
            </button>
          )}
          <button
            onClick={() => onAssignEmployee(departmentId)}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Assigner un employé
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  departmentId,
  authToken,
  apiUrl,
}) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    address: "",
    department_id: departmentId,
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      await axios.post(`${apiUrl}/employees`, newEmployee, config);
      toast.success("Employé ajouté avec succès !");
      onSave(); // Rafraîchit la liste et ferme la modale
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'employé:", error);
      toast.error("Erreur: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Nouvel employé</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newEmployee.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Poste
            </label>
            <input
              type="text"
              name="position"
              value={newEmployee.position}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AssignEmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  departmentId,
  authToken,
  apiUrl,
}) => {
  const [unassignedEmployees, setUnassignedEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchUnassigned = async () => {
        setLoading(true);
        try {
          const config = { headers: { Authorization: `Bearer ${authToken}` } };
          const res = await axios.get(`${apiUrl}/employees/unassigned`, config);
          setUnassignedEmployees(res.data || []);
        } catch (error) {
          toast.error("Impossible de charger les employés non assignés.");
        } finally {
          setLoading(false);
        }
      };
      fetchUnassigned();
    }
  }, [isOpen, authToken, apiUrl]);

  if (!isOpen) return null;

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      toast.warn("Veuillez sélectionner un employé.");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${authToken}` } };
      await axios.put(
        `${apiUrl}/employees/${selectedEmployeeId}`,
        { department_id: departmentId },
        config
      );
      toast.success("Employé assigné avec succès !");
      onSave();
    } catch (error) {
      toast.error("Erreur lors de l'assignation de l'employé.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Assigner un employé</h3>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <form onSubmit={handleAssign} className="space-y-4">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">-- Sélectionner un employé --</option>
              {unassignedEmployees.length > 0 ? (
                unassignedEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.position})
                  </option>
                ))
              ) : (
                <option disabled>Aucun employé sans département</option>
              )}
            </select>
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                disabled={!selectedEmployeeId}
              >
                Assigner
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [employeeListModal, setEmployeeListModal] = useState({
    isOpen: false,
    departmentName: "",
    employees: [],
    loading: false,
    departmentId: null,
  });
  const [addEmployeeModal, setAddEmployeeModal] = useState({
    isOpen: false,
    departmentId: null,
  });
  const [assignEmployeeModal, setAssignEmployeeModal] = useState({
    isOpen: false,
    departmentId: null,
  });
  const navigate = useNavigate();
  const { role, token: authToken, isLoading: isAuthLoading } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchDepartments = useCallback(async () => {
    if (!authToken) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDepartments(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
      toast.error(
        "Erreur lors de la récupération des départements. " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, authToken]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleOpenModal = (dept = null) => {
    setSelectedDepartment(dept ? { ...dept } : { name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSaveDepartment = async (dept) => {
    const formData = new FormData();
    formData.append("name", dept.name);
    formData.append("description", dept.description);

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      if (dept.id) {
        // Update
        await axios.put(`${API_URL}/departments/${dept.id}`, formData, config);
        toast.success("Département mis à jour avec succès !");
      } else {
        // Create
        await axios.post(`${API_URL}/departments`, formData, config);
        toast.success("Département créé avec succès !");
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du département:", error);
      toast.error(
        "Erreur lors de l'enregistrement. " +
          (error.response?.data?.error || "Veuillez réessayer.")
      );
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce département ?")) {
      try {
        await axios.delete(`${API_URL}/departments/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        toast.success("Département supprimé avec succès !");
        fetchDepartments();
      } catch (error) {
        console.error("Erreur lors de la suppression du département:", error);
        toast.error(
          "Erreur lors de la suppression. " +
            (error.response?.data?.error || "Veuillez réessayer.")
        );
      }
    }
  };

  const handleOpenAddEmployeeModal = (departmentId) => {
    setAddEmployeeModal({ isOpen: true, departmentId });
  };

  const handleCloseAddEmployeeModal = () => {
    setAddEmployeeModal({ isOpen: false, departmentId: null });
  };

  const handleEmployeeAdded = () => {
    handleCloseAddEmployeeModal();
    // Rafraîchir la liste des employés dans la modale principale
    handleShowEmployees({
      id: employeeListModal.departmentId,
      name: employeeListModal.departmentName,
    });
  };

  const handleOpenAssignEmployeeModal = (departmentId) => {
    setAssignEmployeeModal({ isOpen: true, departmentId });
  };

  const handleCloseAssignEmployeeModal = () => {
    setAssignEmployeeModal({ isOpen: false, departmentId: null });
  };

  const handleEmployeeAssigned = () => {
    handleCloseAssignEmployeeModal();
    handleShowEmployees({
      id: employeeListModal.departmentId,
      name: employeeListModal.departmentName,
    });
  };

  const handleShowEmployees = async (department) => {
    setEmployeeListModal({
      isOpen: true,
      departmentName: department.name,
      employees: [],
      loading: true,
      departmentId: department.id,
    });

    try {
      const res = await axios.get(
        `${API_URL}/departments/${department.id}/employees`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setEmployeeListModal((prev) => ({
        ...prev,
        employees: res.data,
        loading: false,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      toast.error("Impossible de charger la liste des employés.");
      setEmployeeListModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleEditEmployee = (employeeId) => {
    handleCloseEmployeeModal(); // Ferme la modale actuelle
    navigate("/admin/hrm/employees", {
      state: { employeeToEditId: employeeId },
    });
  };

  const handleCloseEmployeeModal = () => {
    setEmployeeListModal({
      isOpen: false,
      departmentName: "",
      employees: [],
      loading: false,
      departmentId: null,
    });
  };

  // ⭐⭐ FONCTION handleExportEmployees AJOUTÉE ICI ⭐⭐
  const handleExportEmployees = async (departmentId, departmentName) => {
    try {
      console.log(`Exporting employees from department: ${departmentName}`);
      
      // Afficher un message de chargement
      toast.info("Génération du fichier CSV...");
      
      // Appel API pour exporter les employés
      const response = await axios.get(
        `${API_URL}/salaries/export?departmentId=${departmentId}`,
        {
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob' // Important pour les fichiers
        }
      );
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Nom du fichier avec date
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `employes-${departmentName}-${date}.csv`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success("Fichier CSV exporté avec succès !");
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      
      // Gestion d'erreur améliorée
      if (error.response?.status === 404) {
        toast.error("La fonction d'export n'est pas encore disponible sur le serveur.");
      } else if (error.response?.status === 403) {
        toast.error("Vous n'avez pas l'autorisation d'exporter les données.");
      } else {
        toast.error("Erreur lors de l'export des données. Veuillez réessayer.");
      }
    }
  };

  const totalDepartments = departments.length;
  const totalServices = departments.reduce(
    (sum, dept) => sum + (dept.service_count || 0),
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
        <h1 className="text-3xl font-bold">Liste des Départements</h1>
        {!isAuthLoading && role === "super-admin" && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ajouter un département
          </button>
        )}
      </div>

      {isLoading || isAuthLoading ? ( // Combine loading states for departments data and authentication
        <p>Chargement...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre d'employés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre de services
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dept.name}
                  </td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-sm">
                    {dept.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.employee_count > 0 ? (
                      <button
                        onClick={() => handleShowEmployees(dept)}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {dept.employee_count}
                      </button>
                    ) : (
                      "0"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dept.service_count || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {role === "super-admin" && (
                      <>
                        <button
                          onClick={() => handleOpenModal(dept)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Total départements
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalDepartments}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Total services
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalServices}
          </p>
        </div>
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDepartment}
        department={selectedDepartment}
        setDepartment={setSelectedDepartment}
      />

      <EmployeeListModal
        isOpen={employeeListModal.isOpen}
        onClose={handleCloseEmployeeModal}
        departmentName={employeeListModal.departmentName}
        employees={employeeListModal.employees}
        loading={employeeListModal.loading}
        departmentId={employeeListModal.departmentId}
        apiUrl={API_URL}
        onEditEmployee={handleEditEmployee}
        onAddEmployee={handleOpenAddEmployeeModal}
        onAssignEmployee={handleOpenAssignEmployeeModal}
        onExportEmployees={handleExportEmployees} // ⭐ PROP AJOUTÉE ICI ⭐
      />

      <AddEmployeeModal
        isOpen={addEmployeeModal.isOpen}
        onClose={handleCloseAddEmployeeModal}
        onSave={handleEmployeeAdded}
        departmentId={addEmployeeModal.departmentId}
        authToken={authToken}
        apiUrl={API_URL}
        onAssignEmployee={handleOpenAssignEmployeeModal}
      />

      <AssignEmployeeModal
        isOpen={assignEmployeeModal.isOpen}
        onClose={handleCloseAssignEmployeeModal}
        onSave={handleEmployeeAssigned}
        departmentId={assignEmployeeModal.departmentId}
        authToken={authToken}
        apiUrl={API_URL}
      />
    </div>
  );
};

export default Departments;