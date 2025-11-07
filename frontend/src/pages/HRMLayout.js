import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HRMLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navLinks = [
    { to: "/admin/dashboard", text: "🏠 Accueil" },
    { to: "/admin/hrm", text: "📊 Dashboard" },
    { to: "/admin/hrm/employees", text: "👥 Personnels" },
    { to: "/admin/hrm/departments", text: "🏢 Départements" },
    { to: "/admin/hrm/services", text: "🛠 Services" },
    { to: "/admin/hrm/functions", text: "💼 Fonctions" },
    { to: "/admin/hrm/salaries", text: "💰 Salaires" },
    { to: "/admin/hrm/leaves", text: "🌴 Congés" },
  ];

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-6">{t("hrm")}</h2>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                    location.pathname === link.to ? "bg-gray-900" : ""
                  }`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default HRMLayout;
