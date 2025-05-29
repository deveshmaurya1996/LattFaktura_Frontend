import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

import enTranslations from "../locales/en.json";
import svTranslations from "../locales/sv.json";
import { endpoints } from "../constants/endpoints";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
// Initialize i18n once (not on every render)
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslations },
      sv: { translation: svTranslations },
    },
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

// Create Language Context
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const { user } = useAuth();

  const changeLanguagePreference = async (languagePreference) => {
    try {
      const response = await axiosInstance.patch(endpoints.languageChange.url, {
        languagePreference,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error updating language preference:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const changeLanguage = async (lang) => {
    if (user) {
      const language = await changeLanguagePreference(lang);
      i18n.changeLanguage(language.languagePreference);
      localStorage.setItem("language", language.languagePreference);
      setLanguage(language.languagePreference);
    } else {
      i18n.changeLanguage(lang);
      localStorage.setItem("language", lang);
      setLanguage(lang);
    }
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("language") || "en";
    if (i18n.language !== storedLang) {
      i18n.changeLanguage(storedLang);
      setLanguage(storedLang);
    }
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
