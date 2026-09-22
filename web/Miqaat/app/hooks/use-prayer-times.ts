import { useState, useEffect, useCallback } from "react";
import type { PrayerTime, Location } from "~/data/prayer-data";
import { fetchPrayerTimes } from "~/services/api";
import { useLanguage } from "~/i18n/language-context";

const STORAGE_KEY_LOCATION = "prayerApp_location";
const STORAGE_KEY_FORMAT = "prayerApp_timeFormat";
const STORAGE_KEY_NOTIFICATIONS = "prayerApp_notifications";
const STORAGE_KEY_NOTIFICATION_PREFS = "prayerApp_notificationPrefs";

const DEFAULT_LOCATION: Location = {
  city: "Algiers",
  cityAr: "الجزائر",
  country: "Algeria",
  countryAr: "الجزائر",
  timezone: "Africa/Algiers",
  latitude: 36.75,
  longitude: 3.06,
  cityId: 27,
};



function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);

    // For location, ensure new fields exist for backward compatibility
    if (key === STORAGE_KEY_LOCATION) {
      return { ...fallback, ...parsed } as T;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export interface PrayerAppState {
  location: Location;
  timeFormat: "12h" | "24h";
  prayerTimes: PrayerTime[];
  currentPrayer: PrayerTime | null;
  nextPrayer: PrayerTime | null;
  isLoading: boolean;
  error: string | null;
  notificationsEnabled: boolean;
  notificationPreferences: Record<string, boolean>;
  setLocation: (loc: Location) => void;
  setTimeFormat: (f: "12h" | "24h") => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationPreference: (prayerName: string, enabled: boolean) => void;
  refreshPrayerTimes: () => Promise<void>;
}

function determineCurrent(
  times: PrayerTime[],
): { current: PrayerTime | null; next: PrayerTime | null } {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = times; // Use all events including Sunrise and Duha as timeline boundaries
  let current: PrayerTime | null = null;
  let next: PrayerTime | null = null;

  for (let i = 0; i < prayers.length; i++) {
    const [h, m] = prayers[i].time.split(":").map(Number);
    const prayerMinutes = h * 60 + m;
    const nextPrayerMinutes =
      i + 1 < prayers.length
        ? (() => {
          const [nh, nm] = prayers[i + 1].time.split(":").map(Number);
          return nh * 60 + nm;
        })()
        : 24 * 60;

    if (nowMinutes >= prayerMinutes && nowMinutes < nextPrayerMinutes) {
      current = prayers[i];
      next = i + 1 < prayers.length ? prayers[i + 1] : prayers[0];
      break;
    }
  }

  if (!current) {
    current = prayers[prayers.length - 1] ?? null;
    next = prayers[0] ?? null;
  }

  return { current, next };
}

export function usePrayerTimes(): PrayerAppState {
  const { t } = useLanguage();
  const [location, setLocationState] = useState<Location>(
    () => loadFromStorage<Location>(STORAGE_KEY_LOCATION, DEFAULT_LOCATION),
  );
  const [timeFormat, setFormatState] = useState<"12h" | "24h">(
    () => loadFromStorage<"12h" | "24h">(STORAGE_KEY_FORMAT, "12h"),
  );
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(
    () => loadFromStorage<boolean>(STORAGE_KEY_NOTIFICATIONS, false),
  );
  const [notificationPreferences, setNotificationPreferencesState] = useState<Record<string, boolean>>(
    () => loadFromStorage<Record<string, boolean>>(STORAGE_KEY_NOTIFICATION_PREFS, {}),
  );

  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTime | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPrayerTimes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const times = await fetchPrayerTimes(location.cityId);
      setPrayerTimes(times);
      const { current, next } = determineCurrent(times);
      setCurrentPrayer(current);
      setNextPrayer(next);
    } catch {
      setError(t("error.fetchPrayer") ?? "Failed to fetch prayer times. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [location, t]);

  // Fetch on mount and when location changes
  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  // Recalculate current/next prayer every minute
  useEffect(() => {
    if (prayerTimes.length === 0) return;
    const interval = setInterval(() => {
      const { current, next } = determineCurrent(prayerTimes);
      setCurrentPrayer(current);
      setNextPrayer(next);
    }, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const setLocation = (loc: Location) => {
    setLocationState(loc);
    saveToStorage(STORAGE_KEY_LOCATION, loc);
  };



  const setTimeFormat = (f: "12h" | "24h") => {
    setFormatState(f);
    saveToStorage(STORAGE_KEY_FORMAT, f);
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    saveToStorage(STORAGE_KEY_NOTIFICATIONS, enabled);
  };

  const setNotificationPreference = (prayerName: string, enabled: boolean) => {
    const newPrefs = { ...notificationPreferences, [prayerName]: enabled };
    setNotificationPreferencesState(newPrefs);
    saveToStorage(STORAGE_KEY_NOTIFICATION_PREFS, newPrefs);
  };

  return {
    location,
    timeFormat,
    prayerTimes,
    currentPrayer,
    nextPrayer,
    isLoading,
    error,
    notificationsEnabled,
    notificationPreferences,
    setLocation,
    setTimeFormat,
    setNotificationsEnabled,
    setNotificationPreference,
    refreshPrayerTimes: loadPrayerTimes,
  };
}
