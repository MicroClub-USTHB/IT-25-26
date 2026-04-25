import { NavLink, Link, useLocation } from "react-router";
import { Settings, MapPin, CalendarDays, Menu, X } from "lucide-react";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { useLanguage } from "~/i18n/language-context";
import style from "./navigation-header.module.css";

export interface NavigationHeaderProps {
  className?: string;
}

export function NavigationHeader({ className }: NavigationHeaderProps) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className={classnames(style.root, className)} aria-label="Main navigation">
      <Link to="/" className={style.logo} aria-label="Prayer Times home">
        <img src="/logo.jpg" alt="Logo" className={style.logoIcon} style={{ objectFit: "cover", background: "transparent", padding: 0 }} />
        <span className={style.logoText}>
          {t("nav.logo.prayer")}
        </span>
      </Link>

      <div className={classnames(style.navWrapper, isMenuOpen && style.navWrapperOpen)}>
        <div className={style.nav}>
          <NavLink
            to="/location"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.location")}
          >
            <MapPin size={18} />
            {t("nav.location")}
          </NavLink>
          <NavLink
            to="/calendar"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.calendar")}
          >
            <CalendarDays size={18} />
            {t("nav.calendar")}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => classnames(style.navLink, isActive && style.navLinkActive)}
            aria-label={t("nav.settings")}
          >
            <Settings size={18} />
            {t("nav.settings")}
          </NavLink>
        </div>
      </div>

      <button 
        className={style.menuToggle} 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  );
}
