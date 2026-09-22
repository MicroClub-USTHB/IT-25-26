import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppContext } from "~/context/app-context";
import { useLanguage } from "~/i18n/language-context";
import { useColorScheme } from "@dazl/color-scheme/react";
import type { Locale } from "~/i18n/translations";

type ColorScheme = "light" | "dark" | "system";

/**
 * Hook to manage draft settings state before persisting to global context/localStorage.
 * Now includes Language and Theme to ensure a unified "Save" experience.
 */
export function useSettingsDraft() {
  const context = useAppContext();
  const { locale, setLocale } = useLanguage();
  const { configScheme, setColorScheme } = useColorScheme();

  // Draft state initialized from current values
  const [draftFormat, setDraftFormat] = useState(context.timeFormat);
  const [draftNotifications, setDraftNotifications] = useState(context.notificationsEnabled);
  const [draftPrefs, setDraftPrefs] = useState(context.notificationPreferences);
  const [draftLocale, setDraftLocale] = useState<Locale>(locale);
  const [draftTheme, setDraftTheme] = useState<ColorScheme>(configScheme);

  // Sync draft with global state if it changes externally
  useEffect(() => {
    setDraftFormat(context.timeFormat);
    setDraftNotifications(context.notificationsEnabled);
    setDraftPrefs(context.notificationPreferences);
    setDraftLocale(locale);
    setDraftTheme(configScheme);
  }, [context.timeFormat, context.notificationsEnabled, context.notificationPreferences, locale, configScheme]);

  // Determine if there are unsaved changes across ALL settings
  const isDirty = useMemo(() => {
    const isFormatDirty = draftFormat !== context.timeFormat;
    const isNotifDirty = draftNotifications !== context.notificationsEnabled;
    const isLocaleDirty = draftLocale !== locale;
    const isThemeDirty = draftTheme !== configScheme;
    const isPrefsDirty = JSON.stringify(draftPrefs) !== JSON.stringify(context.notificationPreferences);
    
    return isFormatDirty || isNotifDirty || isLocaleDirty || isThemeDirty || isPrefsDirty;
  }, [draftFormat, draftNotifications, draftPrefs, draftLocale, draftTheme, context, locale, configScheme]);

  /**
   * Persists ALL draft settings to their respective global providers.
   */
  const save = async () => {
    try {
      // Premium feedback delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Persist to context / storage
      context.setTimeFormat(draftFormat);
      context.setNotificationsEnabled(draftNotifications);
      setLocale(draftLocale);
      setColorScheme(draftTheme);
      
      // Batch sync prayer-specific notification preferences
      Object.entries(draftPrefs).forEach(([prayer, enabled]) => {
        if (context.notificationPreferences[prayer] !== enabled) {
          context.setNotificationPreference(prayer, enabled);
        }
      });
      
      return { success: true };
    } catch (error) {
      console.error("Failed to save settings:", error);
      return { success: false, error: "Critical error: Could not save settings to storage." };
    }
  };

  const discard = useCallback(() => {
    setDraftFormat(context.timeFormat);
    setDraftNotifications(context.notificationsEnabled);
    setDraftPrefs(context.notificationPreferences);
    setDraftLocale(locale);
    setDraftTheme(configScheme);
  }, [context, locale, configScheme]);

  const resetToDefaults = useCallback(() => {
    setDraftFormat("12h");
    setDraftNotifications(false);
    setDraftPrefs({});
    setDraftLocale("en");
    setDraftTheme("system");
  }, []);

  const setNotificationPreference = useCallback((prayerName: string, enabled: boolean) => {
    setDraftPrefs((prev) => ({ ...prev, [prayerName]: enabled }));
  }, []);

  return {
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
    discard,
    resetToDefaults,
  };
}
