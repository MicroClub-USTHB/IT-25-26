import { useEffect, useRef, useCallback } from "react";
import type { PrayerTime } from "~/data/prayer-data";

/**
 * Robust frontend notification scheduler.
 * Uses periodic polling and visibility checks to ensure notifications fire
 * even if the browser throttles background timers.
 * 
 * Note: Since this is a frontend-only React app without a Service Worker push implementation,
 * notifications will only work while the tab is open.
 */
export function useNotifications(
  prayerTimes: PrayerTime[],
  enabled: boolean,
  preferences: Record<string, boolean> = {},
): void {
  const firedNotifications = useRef<Set<string>>(new Set());

  const checkAndFireNotifications = useCallback(() => {
    if (!enabled || prayerTimes.length === 0) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const now = new Date();
    const nowMs = now.getTime();
    const todayStr = now.toISOString().split("T")[0]; // Use local date string

    for (const prayer of prayerTimes) {
      if (!prayer.isPrayer) continue; // skip Sunrise
      if (preferences[prayer.name] === false) continue;

      const [h, m] = prayer.time.split(":").map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);

      // Notify 1 minute before
      const notifyMs = target.getTime() - 60_000;
      
      // Delay is positive if we've passed the target notification time
      const delay = nowMs - notifyMs;
      
      const uniqueKey = `${todayStr}-${prayer.name}`;

      // If we are past the notification time but within a 5-minute grace period
      if (delay >= 0 && delay < 5 * 60_000) {
        if (!firedNotifications.current.has(uniqueKey)) {
          new Notification("Prayer Time Approaching", {
            body: `${prayer.name} prayer in 1 minute`,
            icon: "/favicon.svg",
            tag: `prayer-${prayer.name}`,
          });
          firedNotifications.current.add(uniqueKey);
        }
      }
    }
  }, [prayerTimes, enabled, preferences]);

  useEffect(() => {
    if (!enabled) return;

    // Run an initial check immediately
    checkAndFireNotifications();

    // Use setInterval (10 seconds) instead of setTimeout to combat browser throttling
    // This acts as a time-sync mechanism that naturally checks the system clock.
    const intervalId = setInterval(checkAndFireNotifications, 10_000);

    // Add focus listeners to instantly catch up on missed notifications
    // when the user switches back to the tab.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkAndFireNotifications();
      }
    };
    
    window.addEventListener("focus", checkAndFireNotifications);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", checkAndFireNotifications);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkAndFireNotifications, enabled]);
}
