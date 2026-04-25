import { Bell, BellOff, ChevronDown, ChevronUp, AlertCircle, Info } from "lucide-react";
import classnames from "classnames";
import { useState } from "react";
import { useLanguage } from "~/i18n/language-context";
import { useNotificationPermission } from "~/hooks/use-notification-permission";
import style from "./notification-toggle.module.css";
import type { PrayerName } from "~/data/prayer-data";

export interface NotificationToggleProps {
  className?: string;
  value: boolean;
  onChange: (enabled: boolean) => void;
  preferences?: Record<string, boolean>;
  onPreferenceChange?: (prayerName: string, enabled: boolean) => void;
}

const PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export function NotificationToggle({ className, value, onChange, preferences = {}, onPreferenceChange }: NotificationToggleProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const { permission, isGranted, isDenied, isUnsupported, requestPermission } = useNotificationPermission();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isUnsupported) return;

    if (!value) {
      // Turning on: Check permission first
      if (permission === "default") {
        const result = await requestPermission();
        if (result !== "granted") {
          return; // Do not toggle on if denied or dismissed
        }
      } else if (isDenied) {
        // We cannot request again if denied, UI should explain this
        return; 
      }
    }
    
    onChange(!value);
    if (!value) {
      setExpanded(true);
    }
  };

  const showBlockedMessage = isDenied && value; // User had them on but now blocked
  const showEnableMessage = !isGranted && !isDenied && !isUnsupported;

  return (
    <div className={classnames(style.root, className)}>
      <div 
        className={classnames(style.mainRow, value && style.mainRowClickable)} 
        onClick={() => value && setExpanded(!expanded)}
      >
        <div className={style.header}>
          <div className={classnames(style.iconBox, isDenied && style.iconBoxError)}>
            {value && isGranted ? <Bell size={18} /> : <BellOff size={18} />}
          </div>
          <div className={style.info}>
            <div className={style.title}>{t("settings.notifications")}</div>
            <div className={style.desc}>
              {isDenied 
                ? t("settings.notifications.denied") 
                : isUnsupported 
                  ? t("settings.notifications.unsupported")
                  : t("settings.notifications.desc")}
            </div>
          </div>
        </div>
        <div className={style.actions}>
          {value && (
            <div className={style.chevron}>
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          )}
          <button
            className={classnames(
              style.toggle, 
              value && isGranted && style.toggleActive,
              isDenied && style.toggleDisabled
            )}
            onClick={handleToggle}
            disabled={isDenied || isUnsupported}
            role="switch"
            aria-checked={value && isGranted}
            aria-label={t("settings.notifications")}
          >
            <span className={style.toggleThumb} />
          </button>
        </div>
      </div>
      
      {isDenied && (
        <div className={style.blockedMessage}>
          <div className={style.blockedTitle}>
            <AlertCircle size={16} />
            {t("settings.notifications.blocked.title") || "Notifications Blocked"}
          </div>
          <div className={style.blockedDesc}>
            {t("settings.notifications.blocked.guide") || "Your browser is blocking notifications. Please click the lock icon in your address bar to allow them for this site."}
          </div>
        </div>
      )}

      {isUnsupported && (
        <div className={style.unsupportedMessage}>
          {t("settings.notifications.unsupported")}
        </div>
      )}
      
      {value && isGranted && (
        <div className={style.successMessage}>
          <div className={style.successContent}>
            <Info size={14} style={{ flexShrink: 0 }} />
            <span>{t("settings.notifications.scheduled")}</span>
          </div>
          <small>{t("settings.notifications.limitation")}</small>
        </div>
      )}
      
      {value && expanded && isGranted && onPreferenceChange && (
        <div className={style.prayersList}>
          {PRAYERS.map((prayer) => {
            const isEnabled = preferences[prayer] !== false; // true by default
            return (
              <div key={prayer} className={style.prayerRow}>
                <span className={style.prayerName}>{t(`prayer.${prayer}` as any)}</span>
                <button
                  className={classnames(style.toggle, style.smallToggle, isEnabled && style.toggleActive)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreferenceChange(prayer, !isEnabled);
                  }}
                  role="switch"
                  aria-checked={isEnabled}
                  aria-label={t(`prayer.${prayer}` as any)}
                >
                  <span className={style.toggleThumb} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

