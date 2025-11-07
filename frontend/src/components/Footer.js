import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} Guilia Tech Global Service. Tous
          droits réservés.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link to="/" className="hover:text-blue-300">
            {t("home")}
          </Link>
          <Link to="/services" className="hover:text-blue-300">
            {t("services")}
          </Link>
          <Link to="/training" className="hover:text-blue-300">
            {t("training")}
          </Link>
          <Link to="/contact" className="hover:text-blue-300">
            {t("contact")}
          </Link>
          <Link to="/legalNotice" className="hover:text-blue-300">
            {t("legalNotice")}
          </Link>
          <Link to="/termsOfUse" className="hover:text-blue-300">
            {t("termsOfUse")}
          </Link>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span>{t("followUs")}</span>
          <a
            href="https://facebook.com/guiliatechservice/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://twitter.com/GuiliaTech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a
            href="https://instagram.com/GuiliaTech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-300"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.048 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118c-2.136 0-3.863 1.728-3.863 3.863s1.727 3.863 3.863 3.863 3.863-1.728 3.863-3.863S14.136 8.118 12 8.118zM12 14.17c-1.18 0-2.143-.963-2.143-2.143s.963-2.143 2.143-2.143 2.143.963 2.143 2.143S13.18 14.17 12 14.17zM16.838 7.846a1.24 1.24 0 100-2.48 1.24 1.24 0 000 2.48z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://wa.me/23563937676"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-green-400"
            title="Contacter sur WhatsApp"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95l-1.4 5.02 5.13-1.37c1.43.81 3.06 1.24 4.77 1.24h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.53 16.02c-.28-.14-1.67-.82-1.93-.92-.26-.09-.45-.14-.64.14-.19.28-.73.92-.89 1.1-.16.19-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.37-1.2-1.06-1.68-2.25-1.89-2.63-.21-.38-.02-.59.12-.73.13-.13.28-.32.42-.48.14-.16.19-.28.28-.47.1-.19.05-.36-.02-.5-.07-.14-.64-1.54-.87-2.1-.23-.56-.46-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.35-.26.28-1 .97-1 2.38 0 1.41 1.02 2.76 1.17 2.95.14.19 2 3.19 4.84 4.25 2.84 1.06 2.84.71 3.35.68.51-.03 1.67-.68 1.9-1.33.24-.65.24-1.2.17-1.33-.07-.14-.26-.21-.53-.35z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
