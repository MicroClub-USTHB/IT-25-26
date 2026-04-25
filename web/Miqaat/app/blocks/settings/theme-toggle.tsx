import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./theme-toggle.module.css";

type ColorScheme = "light" | "dark" | "system";

export interface ThemeToggleProps {
  className?: string;
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
}

export function ThemeToggle({ className, value, onChange }: ThemeToggleProps) {
  const { t } = useLanguage();

  const options = [
    { id: "light" as const, label: t("settings.theme.light"), emoji: "☀️", previewClass: style.previewLight },
    { id: "dark" as const, label: t("settings.theme.dark"), emoji: "🌙", previewClass: style.previewDark },
    { id: "system" as const, label: t("settings.theme.system"), emoji: "💻", previewClass: style.previewSystem },
  ];

  return (
    <div className={classnames(style.root, className)}>
      <div className={style.sectionTitle}>{t("settings.theme")}</div>
      <p className={style.sectionDesc}>{t("settings.theme.desc")}</p>
      <div className={style.options} role="radiogroup" aria-label="Theme selection">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={classnames(style.option, value === opt.id && style.optionSelected)}
            onClick={() => onChange(opt.id)}
            role="radio"
            aria-checked={value === opt.id}
            aria-label={`${opt.label} theme`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onChange(opt.id)}
          >
            <div className={classnames(style.previewBox, opt.previewClass)}>{opt.emoji}</div>
            <div className={style.label}>{opt.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

