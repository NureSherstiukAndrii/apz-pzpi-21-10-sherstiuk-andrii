import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationsEn from "./locales/en/translation";
import translationsUa from "./locales/ua/translation";

const resources = {
  en: {
    translation: translationsEn,
  },
  ua: {
    translation: translationsUa,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "ua",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
