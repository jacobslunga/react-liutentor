import { type FC, createContext, useContext, useEffect, useState } from "react";

type Language = "sv" | "en";

interface LanguageContextProps {
  language: Language;
  changeLanguage: (lang: Language) => void;
  languages: Record<Language, string>;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

const languages: Record<Language, string> = {
  sv: "Svenska",
  en: "English",
};

export const LanguageProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    return storedLanguage ?? "sv";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
