import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector'; "i18next-browser-languagedetector": "^8.0.0", we dont need as of now
import HttpBackend from 'i18next-http-backend';
const basePath = import.meta.env.BASE_URL;

i18n
  .use(HttpBackend) // we need to have backend else we get cant load resources error
//   .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    backend: {
      loadPath: `${basePath}locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;
