import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "./translations";

const STORAGE_KEY = "prayerApp_language";

interface LanguageContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function loadLocale(): Locale {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "ar" || raw === "en") return raw;
  } catch {
    // ignore
  }
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const dir = locale === "ar" ? "rtl" : "ltr";

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>): string => {
      let str = translations[locale][key] ?? translations.en[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, v);
        }
      }
      return str;
    },
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
