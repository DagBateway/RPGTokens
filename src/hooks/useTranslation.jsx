import React, { createContext, useContext, useState, useEffect } from "react";
import { TRANSLATIONS } from "../constants/Translations";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      // 1. Explicit URL parameter check (Crucial for search engines like Googlebot to index each language separately!)
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const langParam = params.get("lang");
        if (langParam === "it" || langParam === "en") {
          return langParam;
        }
      }

      // 2. Persisted user preference check
      const saved = localStorage.getItem("rpg_tokens_lang");
      if (saved) return saved;
    } catch (e) {}
    
    return "en"; // Strict English default for first-paint/first-load!
  });

  // Sync document level attributes and SEO meta on language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = TRANSLATIONS[language].docTitle;
    const metaDesc = document.querySelector('meta[name="Description"]') || document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", TRANSLATIONS[language].docDescription);
    }
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) {
      metaTitle.setAttribute("content", TRANSLATIONS[language].docTitle);
    }
  }, [language]);

  // Non-persisted region auto-detection on mount if no preference has been saved yet
  useEffect(() => {
    try {
      // If there is an explicit URL parameter (e.g. from Googlebot), do not run background auto-detection
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      if (langParam === "it" || langParam === "en") {
        return;
      }

      const saved = localStorage.getItem("rpg_tokens_lang");
      if (saved) return; // Respect saved setting, do not run auto-detection
    } catch (e) {}

    const detectItaly = async () => {
      // 1. Browser language check
      const browserLangs = navigator.languages || [navigator.language];
      const isItalianBrowser = browserLangs.some(lng => lng.toLowerCase().startsWith("it"));
      if (isItalianBrowser) {
        setLanguage("it");
        return;
      }

      // 2. Timezone check
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz === "Europe/Rome" || tz.includes("Europe/Rome") || tz.includes("Rome")) {
          setLanguage("it");
          return;
        }
      } catch (e) {}

      // 3. Fallback Geo-IP check
      try {
        const response = await fetch("https://freeipapi.com/api/json");
        if (response.ok) {
          const data = await response.json();
          if (data && data.countryCode === "IT") {
            setLanguage("it");
          }
        }
      } catch (err) {
        try {
          const res = await fetch("https://ipapi.co/json/");
          if (res.ok) {
            const data = await res.json();
            if (data && (data.country_code === "IT" || data.country === "IT" || data.country_name === "Italy")) {
              setLanguage("it");
            }
          }
        } catch (e) {}
      }
    };

    detectItaly();
  }, []);

  // Manual toggle saves the selection to localStorage to override auto-detection permanently
  const changeLanguage = (lang) => {
    setLanguage(lang);
    try {
      localStorage.setItem("rpg_tokens_lang", lang);
    } catch (e) {}
  };

  const t = (key, replacements = {}) => {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dictionary[key] || TRANSLATIONS.en[key] || key;

    // Process replacements
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, "g"), v);
    });

    return text;
  };

  return (
    <TranslationContext.Provider value={{ t, language, setLanguage: changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
