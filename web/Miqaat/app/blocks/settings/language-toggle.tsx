import { Globe } from "lucide-react";
import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import type { Locale } from "~/i18n/translations";
import style from "./language-toggle.module.css";

export interface LanguageToggleProps {
  className?: string;
  value: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageToggle({ className, value, onChange }: LanguageToggleProps) {
  const { t } = useLanguage();

  const options: { value: Locale; label: string }[] = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.header}>
        <div className={style.iconBox}>
          <Globe size={18} />
        </div>
        <span className={style.title}>{t("settings.language")}</span>
      </div>
      <p className={style.sectionDesc} style={{ margin: "0 0 1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        {t("settings.language.desc" as any)}
      </p>
      <div className={style.options}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className={classnames(style.option, value === opt.value && style.optionActive)}
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

