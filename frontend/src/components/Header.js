import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admintoken');
      setIsAdmin(!!token);
    };

    checkAuth(); // Vérification initiale

    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    setIsAdmin(false);
    navigate('/login-admin');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img className="h-8 w-auto" src="/favicon.ico" alt="Guilia Tech" />
              <span className="ml-2 text-xl font-bold text-blue-700">Guilia Tech</span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-700">{t('home')}</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-700">{t('about')}</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-700">{t('services')}</Link>
            <Link to="/training" className="text-gray-600 hover:text-blue-700">{t('training')}</Link>
            <Link to="/partners" className="text-gray-600 hover:text-blue-700">{t('partners')}</Link>
            <Link to="/blog" className="text-gray-600 hover:text-blue-700">{t('blog')}</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-700">{t('contact')}</Link>
            {isAdmin ? (
              <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-700">Connecté</Link>
            ) : (
              <Link to="/login-admin" className="bg-blue-700 text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-blue-700">Connexion</Link>
            )}
          </nav>
          <div className="flex items-center">
            <LanguageSwitcher />
            {isAdmin && (
              <button onClick={handleLogout} className="ml-4 hidden md:block text-gray-600 hover:text-blue-700">
                {t('logout')}
              </button>
            )}
            {/* Hamburger Button */}
            <div className="md:hidden ml-4">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-blue-700 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('home')}</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('about')}</Link>
          <Link to="/services" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('services')}</Link>
          <Link to="/training" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('training')}</Link>
          <Link to="/partners" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('partners')}</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('blog')}</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">{t('contact')}</Link>
          {isAdmin ? (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">Admin</Link>
          ) : (
            <Link to="/login-admin" onClick={() => setIsOpen(false)} className="bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">login</Link>
          )}
          {isAdmin && (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-blue-700">
              {t('logout')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}