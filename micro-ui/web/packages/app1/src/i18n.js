import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import Backend from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // .use(Backend)
  .init({
    ns: ["translations"],
    defaultNS: "translations",
    debug: true,
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng:"en",
    returnObjects:true,
    // backend:{
    //   loadPath:'/locales/{{lng}}/{{ns}}.json'
    // },
    resources: {
      // en:{
      //   translation:{
      //     greeting: 'Hello, Welcome!',
      //   }
      // },
      // hi:{
      //   translation:{
      //     greeting: 'नमस्ते, स्वागत है!',
      //   }
      // },
      // fr:{
      //   translation:{
      //     greeting: 'Bonjour bienvenue',
      //   }
      // },
    },
  });


  // i18n.addResourceBundle('en', 'sample', {
  //   "meet": 'hello from namespace 1'
  // });
  // i18n.addResourceBundle('hi', 'sample', {
  //   "meet": 'Hindi'
  // });
  // i18n.addResourceBundle('fr', 'sample', {
  //   "meet": 'French'
  // });