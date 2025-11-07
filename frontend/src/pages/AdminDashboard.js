import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [confirmMsg, setConfirmMsg] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [validatingId, setValidatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Partner state
  const [partners, setPartners] = useState([]);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState("");
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerLogoFile, setNewPartnerLogoFile] = useState(null);
  const [newPartnerWebsiteUrl, setNewPartnerWebsiteUrl] = useState("");

  // Training state
  const [trainings, setTrainings] = useState([]);
  const [trainingLoading, setTrainingLoading] = useState(true);
  const [trainingError, setTrainingError] = useState("");
  const [newTrainingTitle, setNewTrainingTitle] = useState("");
  const [newTrainingDescription, setNewTrainingDescription] = useState("");
  const [addingTraining, setAddingTraining] = useState(false);
  const [deletingTrainingId, setDeletingTrainingId] = useState(null);

  // Service state
  const [services, setServices] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceIcon, setNewServiceIcon] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedServiceData, setEditedServiceData] = useState({});

  // Blog Post state
  const [posts, setPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState("");
  const [deletingPostId, setDeletingPostId] = useState(null);

  // Department state (RH)
  const [departments, setDepartments] = useState([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentDescription, setNewDepartmentDescription] = useState("");
  const [newDepartmentImageFile, setNewDepartmentImageFile] = useState(null);
  const [addingDepartment, setAddingDepartment] = useState(false);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editedDepartmentData, setEditedDepartmentData] = useState({
    name: "",
    description: "",
  });
  const [editedDepartmentImageFile, setEditedDepartmentImageFile] =
    useState(null);

  // Detail Modal state
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    title: "",
    items: [],
    contextId: null, // Pour garder l'ID du département
    loading: false,
  });

  const navigate = useNavigate();
  const { admin, token, logout } = useAuth();

  const getAuthHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const fetchPosts = useCallback(async () => {
    setPostLoading(true);
    setPostError("");
    try {
      const response = await fetch("http://localhost:5000/api/blog", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Erreur de chargement des articles");
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPostLoading(false);
    }
  }, [getAuthHeader]);

  const handleDeletePost = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet article ?")) return;
    setDeletingPostId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/blog/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      setConfirmMsg("Article supprimé avec succès.");
      fetchPosts();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setPostError(err.message);
    } finally {
      setDeletingPostId(null);
    }
  };

  const fetchRequests = useCallback(
    (page = 1, search = searchTerm) => {
      setLoading(true);
      setError("");

      let url = `http://localhost:5000/api/requests?page=${page}&limit=5`;
      if (search && search.trim() !== "") {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      fetch(url, {
        headers: getAuthHeader(),
      })
        .then((res) => {
          if (!res.ok) {
            if (res.status === 401) {
              throw new Error("Session invalide");
            }
            throw new Error(`Erreur serveur: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setRequests(data.requests || []);
          setPagination({
            page: data.page || 1,
            pages: data.pages || 1,
            total: data.total || 0,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur fetch:", err);
          if (err.message === "Session invalide") {
            logout();
          } else {
            setError("Erreur de chargement des demandes: " + err.message);
          }
          setLoading(false);
        });
    },
    [searchTerm, getAuthHeader, logout]
  );

  const fetchPartners = useCallback(async () => {
    setPartnerLoading(true);
    setPartnerError("");
    try {
      const response = await fetch("http://localhost:5000/api/partners", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Erreur de chargement des partenaires");
      }
      const data = await response.json();
      setPartners(data);
    } catch (err) {
      setPartnerError(err.message);
    } finally {
      setPartnerLoading(false);
    }
  }, [getAuthHeader]);

  const fetchTrainings = useCallback(async () => {
    setTrainingLoading(true);
    setTrainingError("");
    try {
      const response = await fetch("http://localhost:5000/api/trainings", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Erreur de chargement des formations");
      }
      const data = await response.json();
      setTrainings(data);
    } catch (err) {
      setTrainingError(err.message);
    } finally {
      setTrainingLoading(false);
    }
  }, [getAuthHeader]);

  const fetchServices = useCallback(async () => {
    setServiceLoading(true);
    setServiceError("");
    try {
      const response = await fetch("http://localhost:5000/api/services", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Erreur de chargement des services");
      }
      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setServiceError(err.message);
    } finally {
      setServiceLoading(false);
    }
  }, [getAuthHeader]);

  const fetchDepartments = useCallback(async () => {
    setDepartmentLoading(true);
    setDepartmentError("");
    try {
      const response = await fetch("http://localhost:5000/api/departments", {
        headers: getAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Erreur de chargement des départements");
      }
      const data = await response.json();
      // Le backend renvoie directement un tableau, pas un objet { departments: [...] }
      // Nous vérifions donc si data est bien un tableau.
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setDepartmentError(err.message);
    } finally {
      setDepartmentLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    if (token) {
      fetchRequests(1);
      fetchPartners();
      fetchTrainings();
      fetchServices();
      fetchPosts();
      fetchDepartments();
    }
  }, [
    token,
    fetchRequests,
    fetchPartners,
    fetchTrainings,
    fetchPosts,
    fetchServices,
    fetchDepartments,
  ]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchRequests(newPage, searchTerm);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRequests(1, searchTerm);
  };

  const confirmLogout = () => {
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleValidate = async (id) => {
    setValidatingId(id);
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${id}/validate`,
        {
          method: "PUT",
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la validation");
      }

      setConfirmMsg("Demande validée avec succès.");
      fetchRequests(pagination.page, searchTerm);
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (error) {
      setError("Erreur lors de la validation: " + error.message);
    } finally {
      setValidatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setConfirmMsg("Demande supprimée avec succès.");
      fetchRequests(pagination.page, searchTerm);
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (error) {
      setError("Erreur lors de la suppression: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddPartner = async () => {
    if (!newPartnerName.trim()) {
      setPartnerError("Le nom du partenaire ne peut pas être vide.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newPartnerName);
    formData.append("website_url", newPartnerWebsiteUrl);
    if (newPartnerLogoFile) {
      formData.append("logo", newPartnerLogoFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/partners", {
        method: "POST",
        headers: {
          ...getAuthHeader(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du partenaire");
      }

      setNewPartnerName("");
      setNewPartnerLogoFile(null);
      setNewPartnerWebsiteUrl("");
      setConfirmMsg("Partenaire ajouté avec succès.");
      fetchPartners();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setPartnerError(err.message);
    }
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce partenaire ?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/partners/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du partenaire");
      }

      setConfirmMsg("Partenaire supprimé avec succès.");
      fetchPartners();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setPartnerError(err.message);
    }
  };

  const handleAddTraining = async () => {
    if (!newTrainingTitle.trim() || !newTrainingDescription.trim()) {
      setTrainingError(
        "Le titre et la description de la formation sont requis."
      );
      return;
    }
    setAddingTraining(true);
    try {
      const response = await fetch("http://localhost:5000/api/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: newTrainingTitle,
          description: newTrainingDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la formation");
      }

      setNewTrainingTitle("");
      setNewTrainingDescription("");
      setConfirmMsg("Formation ajoutée avec succès.");
      fetchTrainings();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setTrainingError(err.message);
    } finally {
      setAddingTraining(false);
    }
  };

  const handleDeleteTraining = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette formation ?"))
      return;
    setDeletingTrainingId(id);
    try {
      const response = await fetch(
        `http://localhost:5000/api/trainings/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la formation");
      }

      setConfirmMsg("Formation supprimée avec succès.");
      fetchTrainings();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setTrainingError(err.message);
    }
  };

  const handleAddService = async () => {
    if (!newServiceTitle.trim() || !newServiceDescription.trim()) {
      setServiceError("Le titre et la description du service sont requis.");
      return;
    }
    setAddingService(true);
    try {
      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          title: newServiceTitle,
          description: newServiceDescription,
          icon: newServiceIcon,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du service");
      }

      setNewServiceTitle("");
      setNewServiceDescription("");
      setNewServiceIcon("");
      setConfirmMsg("Service ajouté avec succès.");
      fetchServices();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setServiceError(err.message);
    } finally {
      setAddingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce service ?")) return;
    setDeletingServiceId(id);
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });
      if (!response.ok)
        throw new Error("Erreur lors de la suppression du service");
      setConfirmMsg("Service supprimé avec succès.");
      fetchServices();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setServiceError(err.message);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartmentName.trim()) {
      setDepartmentError("Le nom du département est requis.");
      return;
    }
    setAddingDepartment(true);
    setDepartmentError("");

    const departmentData = {
      name: newDepartmentName,
      description: newDepartmentDescription,
    };

    try {
      const response = await fetch("http://localhost:5000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(departmentData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout du département");
      }

      setNewDepartmentName("");
      setNewDepartmentDescription("");
      setNewDepartmentImageFile(null);
      setConfirmMsg("Département ajouté avec succès.");
      fetchDepartments();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setDepartmentError(err.message);
    } finally {
      setAddingDepartment(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Confirmer la suppression de ce département ?")) return;
    setDeletingDepartmentId(id);
    try {
      const response = await fetch(
        `http://localhost:5000/api/departments/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du département");
      }

      setConfirmMsg("Département supprimé avec succès.");
      fetchDepartments();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setDepartmentError(err.message);
    } finally {
      setDeletingDepartmentId(null);
    }
  };

  const handleEditDepartmentClick = (department) => {
    setEditingDepartmentId(department.id);
    setEditedDepartmentData({
      name: department.name,
      description: department.description || "",
    });
    setEditedDepartmentImageFile(null);
    setDepartmentError("");
  };

  const handleCancelEditDepartment = () => {
    setEditingDepartmentId(null);
    setEditedDepartmentData({ name: "", description: "" });
    setEditedDepartmentImageFile(null);
  };

  const handleUpdateDepartment = async (id) => {
    if (!editedDepartmentData.name?.trim()) {
      setDepartmentError("Le nom du département ne peut pas être vide.");
      return;
    }

    const formData = new FormData();
    formData.append("name", editedDepartmentData.name);
    formData.append("description", editedDepartmentData.description);
    if (editedDepartmentImageFile) {
      formData.append("image", editedDepartmentImageFile);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/departments/${id}`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setConfirmMsg("Département mis à jour avec succès.");
      handleCancelEditDepartment();
      fetchDepartments();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setDepartmentError(err.message);
    }
  };

  const handleEditedDepartmentDataChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartmentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditedDepartmentImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedDepartmentImageFile(e.target.files[0]);
    }
  };

  const handleEditClick = (service) => {
    setEditingServiceId(service.id);
    setEditedServiceData({
      title: service.title,
      description: service.description,
      icon: service.icon,
    });
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditedServiceData({});
  };

  const handleUpdateService = async (id) => {
    if (
      !editedServiceData.title?.trim() ||
      !editedServiceData.description?.trim()
    ) {
      setServiceError("Le titre et la description ne peuvent pas être vides.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(editedServiceData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du service.");
      }

      setConfirmMsg("Service mis à jour avec succès.");
      setEditingServiceId(null);
      setEditedServiceData({});
      fetchServices();
      setTimeout(() => setConfirmMsg(""), 2000);
    } catch (err) {
      setServiceError(err.message);
    }
  };

  const handleEditedDataChange = (e) => {
    const { name, value } = e.target;
    setEditedServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowDetails = async (department, type) => {
    const title =
      type === "services"
        ? `Services du département "${department.name}"`
        : `Employés du département "${department.name}"`;

    setDetailModal({
      isOpen: true,
      title,
      items: [],
      contextId: department.id,
      loading: true,
    });

    try {
      const response = await fetch(
        `http://localhost:5000/api/departments/${department.id}/${type}`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur de chargement des ${type}`);
      }
      const data = await response.json();
      setDetailModal((prev) => ({ ...prev, items: data, loading: false }));
    } catch (err) {
      console.error(err);
      setDetailModal((prev) => ({
        ...prev,
        items: [{ error: err.message }],
        loading: false,
      }));
    }
  };

  const closeDetailModal = () => {
    setDetailModal({
      isOpen: false,
      title: "",
      items: [],
      contextId: null,
      loading: false,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
      </div>

      {/* Barre de recherche */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Messages d'erreur et confirmation */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-lg text-center">
          {error}
        </div>
      )}
      {confirmMsg && (
        <div className="bg-green-100 text-green-800 p-3 mb-4 rounded-lg text-center">
          {confirmMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {searchTerm
            ? "Aucun résultat pour votre recherche."
            : "Aucune demande reçue."}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`bg-white p-4 rounded-lg shadow ${
                  req.status === "traité" ? "bg-green-50" : ""
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">{req.nom}</span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      req.status === "rejeté"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{req.email}</p>
                <p className="text-sm text-gray-600 mb-2">{req.tel}</p>
                <p className="text-sm bg-gray-100 p-2 rounded">{req.besoin}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(req.date_creation).toLocaleString()}
                </p>
                <div className="mt-4 flex gap-2">
                  {req.status !== "traité" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded disabled:bg-gray-400 text-sm w-full"
                      onClick={() => handleValidate(req.id)}
                      disabled={validatingId === req.id}
                    >
                      {validatingId === req.id ? "Validation..." : "Valider"}
                    </button>
                  )}
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded disabled:bg-gray-400 text-sm w-full"
                    onClick={() => handleDelete(req.id)}
                    disabled={deletingId === req.id}
                  >
                    {deletingId === req.id ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border p-2">Nom</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Téléphone</th>
                  <th className="border p-2">Besoin</th>
                  <th className="border p-2">Statut</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className={req.status === "traité" ? "bg-green-50" : ""}
                  >
                    <td className="border p-2">{req.nom}</td>
                    <td className="border p-2">{req.email}</td>
                    <td className="border p-2">{req.tel}</td>
                    <td className="border p-2">{req.besoin}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          req.status === "rejeté"
                            ? "bg-green-200 text-green-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      {new Date(req.date_creation).toLocaleString()}
                    </td>
                    <td className="border p-2">
                      {req.status !== "traité" && (
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2 disabled:bg-gray-400"
                          onClick={() => handleValidate(req.id)}
                          disabled={validatingId === req.id}
                        >
                          {validatingId === req.id
                            ? "Validation..."
                            : "Valider"}
                        </button>
                      )}
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded disabled:bg-gray-400"
                        onClick={() => handleDelete(req.id)}
                        disabled={deletingId === req.id}
                      >
                        {deletingId === req.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Précédent
              </button>
              <span className="text-gray-700 font-medium">
                Page {pagination.page} sur {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Suivant
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Partner Management Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Gestion des Partenaires
        </h2>

        {/* Add Partner Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">
            Ajouter un nouveau partenaire
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Nom du partenaire"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="file"
                onChange={(e) => setNewPartnerLogoFile(e.target.files[0])}
                className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="text"
              placeholder="URL du site web (optionnel)"
              value={newPartnerWebsiteUrl}
              onChange={(e) => setNewPartnerWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddPartner}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start"
            >
              Ajouter
            </button>
          </div>
          {partnerError && <p className="text-red-500 mt-2">{partnerError}</p>}
        </div>

        {/* Partners List */}
        {partnerLoading ? (
          <div className="text-center py-8">Chargement des partenaires...</div>
        ) : partners.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun partenaire trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Logo</th>
                  <th className="border p-3 text-left">Nom du Partenaire</th>
                  <th className="border p-3 text-left">URL du site</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner.id}>
                    <td className="border p-3">
                      {partner.logo_url && (
                        <img
                          src={
                            partner.logo_url.startsWith("data:")
                              ? partner.logo_url
                              : `http://localhost:5000${partner.logo_url}`
                          }
                          alt={partner.name}
                          className="h-12 object-contain"
                        />
                      )}
                    </td>
                    <td className="border p-3">{partner.name}</td>
                    <td className="border p-3 text-gray-600">
                      <a
                        href={partner.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {partner.website_url}
                      </a>
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDeletePartner(partner.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Training Management Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Gestion des Formations
        </h2>

        {/* Add Training Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">
            Ajouter une nouvelle formation
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Titre de la formation"
              value={newTrainingTitle}
              onChange={(e) => setNewTrainingTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description de la formation"
              value={newTrainingDescription}
              onChange={(e) => setNewTrainingDescription(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              onClick={handleAddTraining}
              disabled={addingTraining}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start disabled:bg-gray-400"
            >
              {addingTraining ? "Ajout en cours..." : "Ajouter la formation"}
            </button>
          </div>
          {trainingError && (
            <p className="text-red-500 mt-2">{trainingError}</p>
          )}
        </div>

        {/* Trainings List */}
        {trainingLoading ? (
          <div className="text-center py-8">Chargement des formations...</div>
        ) : trainings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucune formation trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Titre</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training.id}>
                    <td className="border p-3 font-semibold">
                      {training.title}
                    </td>
                    <td className="border p-3 text-gray-700">
                      {training.description}
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDeleteTraining(training.id)}
                        disabled={deletingTrainingId === training.id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        {deletingTrainingId === training.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service Management Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Gestion des Services
        </h2>

        {/* Add Service Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">
            Ajouter un nouveau service
          </h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Titre du service"
              value={newServiceTitle}
              onChange={(e) => setNewServiceTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Icône (emoji, ex: 💼)"
              value={newServiceIcon}
              onChange={(e) => setNewServiceIcon(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="Description du service"
              value={newServiceDescription}
              onChange={(e) => setNewServiceDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>
            <button
              onClick={handleAddService}
              disabled={addingService}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start disabled:bg-gray-400"
            >
              {addingService ? "Ajout en cours..." : "Ajouter le service"}
            </button>
          </div>
          {serviceError && <p className="text-red-500 mt-2">{serviceError}</p>}
        </div>

        {/* Services List */}
        {serviceLoading ? (
          <div className="text-center py-8">Chargement des services...</div>
        ) : services.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun service trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Icône</th>
                  <th className="border p-3 text-left">Titre</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) =>
                  editingServiceId === service.id ? (
                    // Ligne en mode édition
                    <tr key={`${service.id}-edit`}>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="icon"
                          value={editedServiceData.icon}
                          onChange={handleEditedDataChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="title"
                          value={editedServiceData.title}
                          onChange={handleEditedDataChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2">
                        <textarea
                          name="description"
                          value={editedServiceData.description}
                          onChange={handleEditedDataChange}
                          className="w-full p-1 border rounded"
                          rows="3"
                        ></textarea>
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleUpdateService(service.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors mb-2 w-full"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors w-full"
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ) : (
                    // Ligne en mode affichage
                    <tr key={service.id}>
                      <td className="border p-3 text-2xl">{service.icon}</td>
                      <td className="border p-3 font-semibold">
                        {service.title}
                      </td>
                      <td className="border p-3 text-gray-700">
                        {service.description}
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleEditClick(service)}
                          disabled={deletingServiceId === service.id}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors mr-2 disabled:bg-gray-400"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          disabled={deletingServiceId === service.id}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
                        >
                          {deletingServiceId === service.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Department Management Section (RH) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Liste des Départements
        </h2>

        {/* Add Department Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Ajouter un département</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nom du département"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description du département"
              value={newDepartmentDescription}
              onChange={(e) => setNewDepartmentDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <button
              onClick={handleAddDepartment}
              disabled={addingDepartment}
              className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors self-start disabled:bg-gray-400"
            >
              {addingDepartment ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
          {departmentError && (
            <p className="text-red-500 mt-2">{departmentError}</p>
          )}
        </div>

        {/* Departments List */}
        {departmentLoading ? (
          <div className="text-center py-8">Chargement des départements...</div>
        ) : departments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun département trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Nom</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3 text-center">Nombre de services</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) =>
                  editingDepartmentId === department.id ? (
                    <tr key={`${department.id}-edit`} className="bg-yellow-50">
                      <td className="border p-2 align-top">
                        <input
                          type="text"
                          name="name"
                          value={editedDepartmentData.name}
                          onChange={handleEditedDepartmentDataChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                      <td className="border p-2 align-top">
                        <textarea
                          name="description"
                          value={editedDepartmentData.description}
                          onChange={handleEditedDepartmentDataChange}
                          className="w-full p-1 border rounded"
                          rows="3"
                        ></textarea>
                      </td>
                      <td className="border p-2 text-center align-top">
                        {department.service_count}
                      </td>
                      <td className="border p-2 text-center align-top">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              handleUpdateDepartment(department.id)
                            }
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 w-full"
                          >
                            Enregistrer
                          </button>
                          <button
                            onClick={handleCancelEditDepartment}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 w-full"
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // Mode affichage
                    <tr key={department.id}>
                      <td className="border p-3 font-semibold">
                        {department.name}
                      </td>
                      <td className="border p-3 text-gray-700 max-w-xs">
                        <p className="truncate" title={department.description}>
                          {department.description || (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </p>
                      </td>
                      <td className="border p-3 text-center font-medium">
                        {department.service_count}
                      </td>
                      <td className="border p-3 text-center">
                        <button
                          onClick={() => handleEditDepartmentClick(department)}
                          disabled={deletingDepartmentId === department.id}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors mr-2 disabled:bg-gray-400"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id)}
                          disabled={deletingDepartmentId === department.id}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
                        >
                          {deletingDepartmentId === department.id
                            ? "Suppression..."
                            : "Supprimer"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-end gap-8">
              <div className="text-right">
                <p className="text-gray-600">Total départements</p>
                <p className="text-2xl font-bold text-gray-800">
                  {departments.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Total services</p>
                <p className="text-2xl font-bold text-gray-800">
                  {departments.reduce((acc, dep) => acc + dep.service_count, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Blog Management Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Gestion des Articles de Blog
          </h2>
          <Link
            to="/admin/posts/new"
            className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Créer un article
          </Link>
        </div>

        {postLoading ? (
          <div className="text-center py-8">Chargement des articles...</div>
        ) : postError ? (
          <div className="text-center py-8 text-red-500">{postError}</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun article trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Titre</th>
                  <th className="border p-3 text-left">Catégorie</th>
                  <th className="border p-3 text-left">Auteur</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="border p-3 font-semibold">{post.title}</td>
                    <td className="border p-3">{post.category}</td>
                    <td className="border p-3">{post.author}</td>
                    <td className="border p-3">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="border p-3 text-center">
                      <Link
                        to={`/admin/posts/edit/${post.id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors mr-2"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={deletingPostId === post.id}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        {deletingPostId === post.id
                          ? "Suppression..."
                          : "Supprimer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {detailModal.title}
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {detailModal.loading ? (
                <p>Chargement...</p>
              ) : detailModal.items.length === 0 ? (
                <p>Aucun élément à afficher.</p>
              ) : (
                <ul className="space-y-3">
                  {detailModal.items.map((item, index) => (
                    <li
                      key={item.id || index}
                      className="bg-gray-50 p-3 rounded-md border"
                    >
                      {item.error ? (
                        <p className="text-red-500">{item.error}</p>
                      ) : item.first_name ? ( // C'est un employé
                        <div>
                          <p className="font-semibold text-gray-800">{`${item.first_name} ${item.last_name}`}</p>
                          <p className="text-sm text-gray-600">
                            {item.position}
                          </p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                        </div>
                      ) : (
                        // C'est un service
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <p className="font-semibold text-gray-800">
                              {item.title}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-8">
                            {item.description}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end items-center gap-4">
              {detailModal.title.includes("Employés") &&
                detailModal.items.length > 0 && (
                  <a
                    href={`http://localhost:5000/api/departments/${detailModal.contextId}/employees/export`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                  >
                    Exporter en CSV
                  </a>
                )}
              <button
                onClick={closeDetailModal}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
