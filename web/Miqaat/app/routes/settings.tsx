import { useState } from "react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { useSettingsDraft } from "~/hooks/use-settings-draft";
import { Toast } from "~/components/toast/toast";

import { TimeFormatToggle } from "../blocks/settings/time-format-toggle";
import { ThemeToggle } from "../blocks/settings/theme-toggle";
import { NotificationToggle } from "../blocks/settings/notification-toggle";
import { LanguageToggle } from "../blocks/settings/language-toggle";
import { SettingsActions } from "../blocks/settings/settings-actions";
import styles from "./settings.module.css";

const DEFAULT_LOCATION = {
  city: "Algiers",
  cityAr: "الجزائر",
  country: "Algeria",
  countryAr: "الجزائر",
  timezone: "Africa/Algiers",
  latitude: 36.75,
  longitude: 3.06,
  cityId: 27,
};

export default function Settings() {
  const { setLocation } = useAppContext();
  const { t } = useLanguage();
  
  const {
    draftFormat,
    setDraftFormat,
    draftNotifications,
    setDraftNotifications,
    draftPrefs,
    setNotificationPreference,
    draftLocale,
    setDraftLocale,
    draftTheme,
    setDraftTheme,
    isDirty,
    save,
    resetToDefaults,
  } = useSettingsDraft();

  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await save();
    setIsSaving(false);
    
    if (result.success) {
      setToast({ message: t("settings.saved") || "Settings saved successfully", type: "success" });
    } else {
      setToast({ message: result.error || "Failed to save settings", type: "error" });
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setLocation(DEFAULT_LOCATION);
    setToast({ message: t("settings.reset.success") || "Settings reset to defaults", type: "success" });
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.pageTitle}>{t("settings.title")}</h1>
      
      <div className={styles.grid}>
        <div className={styles.topSection}>
          <div className={styles.timeFormatArea}>
            <TimeFormatToggle
              value={draftFormat}
              onChange={setDraftFormat}
            />
          </div>
          <div className={styles.languageArea}>
            <LanguageToggle
              value={draftLocale}
              onChange={setDraftLocale}
            />
          </div>
          <div className={styles.themeArea}>
            <ThemeToggle
              value={draftTheme}
              onChange={setDraftTheme}
            />
          </div>
        </div>

        <div className={styles.bottomSection}>
          <NotificationToggle
            value={draftNotifications}
            onChange={setDraftNotifications}
            preferences={draftPrefs}
            onPreferenceChange={setNotificationPreference}
          />
        </div>
      </div>

      <div className={styles.actionsBox}>
        <SettingsActions 
          onSave={handleSave} 
          onReset={handleReset} 
          isDirty={isDirty}
          isSaving={isSaving}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}

