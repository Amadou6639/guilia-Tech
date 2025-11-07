import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogDetails = ({ details }) => {
  if (!details) return null;

  try {
    const parsedDetails = JSON.parse(details);
    const { old, new: newData } = parsedDetails;

    if (!old || !newData) return null;

    const changes = Object.keys(newData).map((key) => {
      if (JSON.stringify(old[key]) !== JSON.stringify(newData[key])) {
        return (
          <li key={key} className="text-xs">
            <span className="font-semibold">{key}:</span>{" "}
            <span className="text-red-600 line-through">{JSON.stringify(old[key])}</span> →{" "}
            <span className="text-green-600">{JSON.stringify(newData[key])}</span>
          </li>
        );
      }
      return null;
    }).filter(Boolean);

    return changes.length > 0 ? <ul className="mt-2 pl-4 list-disc">{changes}</ul> : null;
  } catch (e) {
    return null;
  }
};

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLogRow, setExpandedLogRow] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admintoken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/audit-logs`, config);
      setLogs(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du journal d'audit:", error);
      toast.error(
        "Erreur: " + (error.response?.data?.error || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="bottom-right" />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal d'Audit</h1>
      </div>

      {isLoading ? (
        <p>Chargement du journal...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cible
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {log.admin_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.target_type && `${log.target_type} (ID: ${log.target_id})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.details && (
                      <button
                        onClick={() => setExpandedLogRow(expandedLogRow === log.id ? null : log.id)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        {expandedLogRow === log.id ? "Masquer" : "Voir"}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedLogRow === log.id && log.details && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-3">
                      <LogDetails details={log.details} />
                    </td>
                  </tr>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditLog;