import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  FaUserCircle,
  FaEnvelope,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaInfoCircle,
  FaPlaneDeparture,
  FaFileAlt,
  FaUpload,
} from "react-icons/fa";

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'leaves', or 'documents'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for image cropping
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // State for new document upload
  const [newDocument, setNewDocument] = useState({ file: null, type: "CV" });

  const getAuthHeader = () => {
    const token = localStorage.getItem("admintoken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchEmployee = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${id}`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) {
        throw new Error("Erreur de chargement du profil de l'employé.");
      }
      const data = await response.json();
      setEmployee(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchEmployeeLeaves = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${id}/leaves`,
        {
          headers: getAuthHeader(),
        }
      );
      if (!response.ok) {
        throw new Error("Erreur de chargement des congés de l'employé.");
      }
      const data = await response.json();
      setLeaves(data);
    } catch (err) {
      // Ne pas bloquer l'affichage du profil si les congés ne chargent pas
      console.error(err.message);
    }
  }, [id]);

  useEffect(() => {
    // Lancer les deux fetches en parallèle
    Promise.all([fetchEmployee(), fetchEmployeeLeaves()]);
  }, [fetchEmployee, fetchEmployeeLeaves]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch(
        `http://localhost:5000/api/employees/${id}/photo`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "Erreur lors de la mise à jour de la photo."
        );
      setEmployee((prev) => ({ ...prev, photo: data.photoUrl }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement du profil...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!employee) {
    return (
      <div className="text-center text-gray-500 py-10">Employé non trouvé.</div>
    );
  }

  return (
    <div className="mt-12">
      <div className="mb-4">
        <Link
          to="/admin/hrm/employees"
          className="text-blue-600 hover:underline"
        >
          &larr; Retour à la liste des employés
        </Link>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="relative group">
            <input
              type="file"
              id="photo-upload"
              className="hidden"
              accept="image/*"
              onChange={onSelectFile}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              {employee.photo ? (
                <img
                  src={`http://localhost:5000${employee.photo}`}
                  alt={employee.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-gray-200 group-hover:opacity-75 transition-opacity"
                />
              ) : (
                <img
                  src="/default-avatar.png"
                  alt="Avatar par défaut"
                  className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-4 border-gray-200 group-hover:opacity-75 transition-opacity"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">Changer</span>
              </div>
            </label>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-800">
              {employee.name}
            </h2>
            <p className="text-lg text-gray-600">{employee.position}</p>
          </div>
        </div>
        <hr className="my-6" />
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Informations détaillées
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <FaEnvelope className="mr-3 text-gray-500" />
              <span className="text-gray-700">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${employee.email}`} className="text-blue-600">
                  {employee.email}
                </a>
              </span>
            </li>
            <li className="flex items-center">
              <FaBuilding className="mr-3 text-gray-500" />
              <span className="text-gray-700">
                <strong>Département:</strong>{" "}
                {employee.department_name || "Non assigné"}
              </span>
            </li>
            <li className="flex items-center">
              <FaBriefcase className="mr-3 text-gray-500" />
              <span className="text-gray-700">
                <strong>Poste:</strong> {employee.position}
              </span>
            </li>
            {employee.hire_date && (
              <li className="flex items-center">
                <FaCalendarAlt className="mr-3 text-gray-500" />
                <span className="text-gray-700">
                  <strong>Date d'embauche:</strong>{" "}
                  {new Date(employee.hire_date).toLocaleDateString()}
                </span>
              </li>
            )}
          </ul>
        </div>
        )}
        {activeTab === "leaves" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Historique des congés
            </h3>
            {leaves.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {leaves.map((leave) => (
                  <li key={leave.id} className="py-3">
                    <p className="font-medium">
                      Du {new Date(leave.start_date).toLocaleDateString()} au{" "}
                      {new Date(leave.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Statut :{" "}
                      <span className="font-semibold">{leave.status}</span>
                    </p>
                    {leave.reason && (
                      <p className="text-sm text-gray-500 mt-1">
                        Motif : {leave.reason}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                Aucune demande de congé trouvée pour cet employé.
              </p>
            )}
          </div>
        )}
        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Gestion des documents
            </h3>
            {/* Upload Form */}
            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <input
                  id="document-upload-input"
                  type="file"
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      file: e.target.files[0],
                    }))
                  }
                  className="col-span-1 md:col-span-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <select
                  value={newDocument.type}
                  onChange={(e) =>
                    setNewDocument((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="CV">CV</option>
                  <option value="Contrat">Contrat</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Autre">Autre</option>
                </select>
                <button
                  onClick={handleDocumentUpload}
                  className="col-span-1 md:col-span-3 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <FaUpload /> Uploader
                </button>
              </div>
            </div>

            {/* Documents List */}
            {documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <div>
                      <a
                        href={`http://localhost:5000${doc.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {doc.file_name}
                      </a>
                      <p className="text-sm text-gray-500">
                        {doc.file_type} - Ajouté le{" "}
                        {new Date(doc.upload_date).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Aucun document trouvé pour cet employé.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {isCropping && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Recadrer votre photo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 max-h-[60vh] overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="w-full"
                  />
                </ReactCrop>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold mb-2">Aperçu</p>
                <canvas
                  ref={previewCanvasRef}
                  className="rounded-full border"
                  style={{ width: 150, height: 150, objectFit: "contain" }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsCropping(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleCropAndUpload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Recadrer et Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
