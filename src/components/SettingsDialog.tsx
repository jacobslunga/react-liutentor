import {
  DeviceDesktopIcon,
  GearIcon,
  MoonIcon,
  SunIcon,
} from "@primer/octicons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type FC, type JSX, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/contexts/TranslationsContext";

const SettingsDialog: FC = () => {
  const { setTheme, theme } = useTheme();
  const { t } = useTranslation();
  const { changeLanguage, languages, language } = useLanguage();
  const [_, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setSystemPrefersDark(isDarkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const themeOptions: {
    id: "light" | "dark" | "system";
    label: string;
    icon: JSX.Element;
  }[] = [
    {
      id: "light",
      label: "Light",
      icon: <SunIcon className="w-5 h-5" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <MoonIcon className="w-5 h-5" />,
    },
    {
      id: "system",
      label: "System",
      icon: <DeviceDesktopIcon className="w-5 h-5" />,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <GearIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90%] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t("settings")}</DialogTitle>
          <DialogDescription>{t("settingsDescription")}</DialogDescription>
        </DialogHeader>

        {/* Theme Selector */}
        <div className="space-y-3">
          <h3 className="font-medium">{t("theme")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("themeDescription")}
          </p>
          <div className="flex gap-2">
            {themeOptions.map(({ id, label, icon }) => (
              <div
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  "flex-1 cursor-pointer rounded-md border border-border transition-all",
                  "flex flex-col items-center justify-center gap-2 py-4 hover:bg-primary/5 hover:border-primary",
                  theme === id
                    ? "bg-primary/10 border-primary hover:bg-primary/10"
                    : "bg-card"
                )}
              >
                {icon}
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Language Selector */}
        <div className="space-y-4">
          <h3 className="font-medium">{t("settingsLanguage")}</h3>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger className="w-full">
              <SelectValue>{languages[language]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languages).map(([lang, label]) => (
                <SelectItem key={lang} value={lang}>
                  {label as string}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
