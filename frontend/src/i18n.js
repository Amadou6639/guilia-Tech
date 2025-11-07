import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr', 'es', 'ru'],
    fallbackLng: 'fr',
    debug: true,
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
      // Ajout de cette fonction pour personnaliser les requêtes de i18next
      request: (options, url, payload, callback) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open(options.verb || 'GET', url, true);
          // Ne pas ajouter l'en-tête Authorization pour ces requêtes
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, {
                  status: xhr.status,
                  data: xhr.responseText,
                });
              } else {
                callback(new Error(xhr.statusText), {
                  status: xhr.status,
                  data: xhr.responseText,
                });
              }
            }
          };
          xhr.send(payload);
        } catch (error) {
          console.error(error);
          callback(error, { status: 0, data: null });
        }
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
