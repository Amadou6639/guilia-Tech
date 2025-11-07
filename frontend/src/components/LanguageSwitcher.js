import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => changeLanguage('en')} className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'en' ? 'bg-blue-700 text-white' : 'text-black hover:bg-blue-500'}`}>EN</button>
      <button onClick={() => changeLanguage('fr')} className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'fr' ? 'bg-blue-700 text-white' : 'text-black hover:bg-blue-500'}`}>FR</button>
      <button onClick={() => changeLanguage('es')} className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'es' ? 'bg-blue-700 text-white' : 'text-black hover:bg-blue-500'}`}>ES</button>
      <button onClick={() => changeLanguage('ru')} className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'ru' ? 'bg-blue-700 text-white' : 'text-black hover:bg-blue-500'}`}>RS</button>
    </div>

  );
};

export default LanguageSwitcher;
