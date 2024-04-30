import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import ReactPostprocessor from "i18next-react-postprocessor";

function replaceLiterals(text = "", dynamicValues = {}) {
  let returnText = text;
  const regex = /[^\{\{][\{]\w+/;
  if (regex.exec(text) !== null) {
    Object.keys(dynamicValues).forEach((key) => {
      returnText = returnText.replace(`{${key.toUpperCase()}}`, dynamicValues[key]);
    });
  }

  return returnText;
}

const templatePostprocessor = {
  type: "postProcessor",
  name: "templatePostprocessor",
  process: function (value, key, options, translator) {
    return replaceLiterals(value, options);
  },
};


i18n
  .use(new ReactPostprocessor())
  .use(templatePostprocessor)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: ["translations"],
    defaultNS: "translations",
    debug: false,
    lng: localStorage.getItem("i18nextLng") || "en_IN",
    fallbackLng:"en_IN",
    returnObjects:true,
    postProcess: [`reactPostprocessor`, "templatePostprocessor"],
    resources: {
    },
  });