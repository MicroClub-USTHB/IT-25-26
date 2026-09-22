import { useState, useEffect } from "react";
import type { PrayerTime } from "~/data/prayer-data";

export type PrayerStatus = "forbidden" | "duha" | null;

/**
 * Determines the current prayer status based on Sunrise and Dhuhr times.
 *
 * Timeline:
 *  - Sunrise → Sunrise + 15 min:       "forbidden" (nafl prayer prohibited)
 *  - Sunrise + 15 min → Dhuhr - 15 min: "duha"      (Duha prayer time)
 *  - Dhuhr - 15 min → Dhuhr:            "forbidden" (nafl prayer prohibited)
 *  - Otherwise:                          null
 */
export function usePrayerStatus(prayerTimes: PrayerTime[]): PrayerStatus {
  const [status, setStatus] = useState<PrayerStatus>(null);

  useEffect(() => {
    if (prayerTimes.length === 0) return;

    const sunrise = prayerTimes.find((p) => p.name === "Sunrise");
    const dhuhr = prayerTimes.find((p) => p.name === "Dhuhr");
    if (!sunrise || !dhuhr) return;

    const [sunH, sunM] = sunrise.time.split(":").map(Number);
    const sunriseMinutes = sunH * 60 + sunM;

    const [dhuH, dhuM] = dhuhr.time.split(":").map(Number);
    const dhuhrMinutes = dhuH * 60 + dhuM;

    const calc = () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (nowMinutes >= sunriseMinutes && nowMinutes < sunriseMinutes + 15) {
        setStatus("forbidden");
      } else if (nowMinutes >= sunriseMinutes + 15 && nowMinutes < dhuhrMinutes - 15) {
        setStatus("duha");
      } else if (nowMinutes >= dhuhrMinutes - 15 && nowMinutes < dhuhrMinutes) {
        setStatus("forbidden");
      } else {
        setStatus(null);
      }
    };

    calc();
    const interval = setInterval(calc, 15000); // re-check every 15 seconds
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return status;
}
