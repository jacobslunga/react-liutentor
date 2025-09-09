import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type Translations = Record<string, Record<string, string>>;

interface TranslationContextProps {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextProps | null>(null);

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error(
      "useTranslation must be used within a TranslationsProvider"
    );
  }
  return ctx;
};

export const TranslationsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    fetch("/translations.json")
      .then((res) => res.json())
      .then((data: Translations) => setTranslations(data))
      .catch((err) => console.error("Failed to load translations:", err));
  }, []);

  const t = (key: string): string => {
    if (!translations) return key;
    return translations[language]?.[key] ?? key;
  };

  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};
