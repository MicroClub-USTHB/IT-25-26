import { Link } from "react-router";
import { MapPin, Navigation } from "lucide-react";
import classnames from "classnames";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import style from "./location-display.module.css";

export interface LocationDisplayProps {
  className?: string;
}

export function LocationDisplay({ className }: LocationDisplayProps) {
  const { location } = useAppContext();
  const { t, locale } = useLanguage();
  return (
    <div className={classnames(style.root, className)}>
      <div className={style.locationInfo}>
        <div className={style.icon}>
          <MapPin size={20} />
        </div>
        <div className={style.text}>
          <span className={style.city}>{locale === "ar" ? (location.cityAr || location.city) : location.city}</span>
          <span className={style.country}>{locale === "ar" ? (location.countryAr || location.country) : location.country}</span>
        </div>
      </div>
      <Link to="/location" className={style.changeBtn} aria-label={t("location.change")}>
        <Navigation size={14} />
        {t("location.change")}
      </Link>
    </div>
  );
}
