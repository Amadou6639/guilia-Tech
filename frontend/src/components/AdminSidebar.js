import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
      navigate("/login-admin");
    }
  };

  const linkStyle =
    "flex items-center px-4 py-2 text-gray-100 hover:bg-blue-700 rounded-md transition-colors";
  const activeLinkStyle = "bg-blue-700";

  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">Guilia Tech</h2>
        <p className="text-sm text-blue-200">Panneau Admin</p>
      </div>

      <nav className="flex-grow">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">🏠</span> Tableau de bord
        </NavLink>
        <NavLink
          to="/admin/stats"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">📊</span> Statistiques
        </NavLink>
        <NavLink
          to="/admin/subscribers"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">👥</span> Abonnés
        </NavLink>
        <NavLink
          to="/admin/posts/new"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">✍️</span> Nouvel Article
        </NavLink>
        <NavLink
          to="/admin/hrm"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">🧑‍💼</span> Gestion RH
        </NavLink>
        <NavLink
          to="/admin/hrm/departments"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">🏢</span> Départements
        </NavLink>
        <NavLink
          to="/admin/register"
          className={({ isActive }) =>
            `${linkStyle} ${isActive ? activeLinkStyle : ""}`
          }
        >
          <span className="mr-3">👤</span> Nouvel Admin
        </NavLink>
      </nav>

      <div className="mt-auto">
        <div className="text-center mb-4 p-2 bg-blue-900 rounded">
          <p className="font-semibold">{admin?.name}</p>
          <p className="text-xs text-blue-300">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-gray-100 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          <span className="mr-3">🚪</span> Déconnexion
        </button>
      </div>
    </div>
  );
}
