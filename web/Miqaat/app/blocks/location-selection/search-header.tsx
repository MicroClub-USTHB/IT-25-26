import classnames from "classnames";
import { useLanguage } from "~/i18n/language-context";
import style from "./search-header.module.css";

export interface SearchHeaderProps {
  className?: string;
}

export function SearchHeader({ className }: SearchHeaderProps) {
  const { t, locale } = useLanguage();
  return (
    <div className={classnames("flex flex-col gap-3 text-center", className)}>
      <h1 
        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight"
        style={{ fontFamily: locale === "ar" ? "var(--family-brand-ar)" : "inherit" }}
      >
        {t("location.title")}
      </h1>
      <p className="text-md text-slate-500 dark:text-zinc-400 font-medium mx-auto leading-relaxed">
        {t("location.subtitle")}
      </p>
    </div>
  );
}
