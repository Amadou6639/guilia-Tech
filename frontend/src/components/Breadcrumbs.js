import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ crumbs }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
    >
      <ol className="flex items-center space-x-2 text-base">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast ? (
                <>
                  <Link
                    to={crumb.path}
                    className="text-blue-600 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                  <svg
                    className="w-5 h-5 mx-2 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              ) : (
                <span
                  className="font-semibold text-gray-800"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
