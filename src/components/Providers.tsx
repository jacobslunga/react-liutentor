import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TranslationsProvider } from "@/contexts/TranslationsContext";

interface Props {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TranslationsProvider>{children}</TranslationsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
