import { useState, useEffect } from "react";
import { formatTime } from "~/utils/time-utils";


export interface ClockState {
  now: Date;
  timeString: string;
  timeOnly: string;
  period: string;
  dateString: string;
  hijriDate: string;
}

const HIJRI_MONTHS = {
  en: [
    "Muharram",
    "Safar",
    "Rabi\u02bc al-Awwal",
    "Rabi\u02bc al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Sha\u02bcban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi\u02bcda",
    "Dhu al-Hijja",
  ],
  ar: [
    "محرم",
    "صفر",
    "ربيع الأول",
    "ربيع الآخر",
    "جمادى الأولى",
    "جمادى الآخرة",
    "رجب",
    "شعبان",
    "رمضان",
    "شوال",
    "ذو القعدة",
    "ذو الحجة",
  ]
};

/**
 * Approximate Gregorian-to-Hijri conversion.
 * Accurate to within ±1 day for modern dates.
 */
function toHijri(date: Date): { day: number; month: number; year: number } {
  const jd =
    Math.floor((14 + date.getMonth() + 1) / 12);
  const y = date.getFullYear() + 4800 - jd;
  const m = date.getMonth() + 1 + 12 * jd - 3;
  let julianDay =
    date.getDate() +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  const l = julianDay - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const ll = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - ll) / 5316) * Math.floor((50 * ll) / 17719) +
    Math.floor(ll / 5670) * Math.floor((43 * ll) / 15238);
  const l2 =
    ll -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hijriMonth = Math.floor((24 * l2) / 709);
  const hijriDay = l2 - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  return { day: hijriDay, month: hijriMonth, year: hijriYear };
}

export function useClock(timeFormat: "12h" | "24h", locale: "en" | "ar" = "en"): ClockState {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const timeParts = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const timeString = formatTime(timeParts, timeFormat, locale);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  
  let timeOnly = "";
  if (timeFormat === "24h") {
    timeOnly = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  } else {
    const h12 = h % 12 || 12;
    timeOnly = `${h12}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  let period = "";
  if (timeFormat === "12h") {
    if (locale === "ar") {
      period = h >= 12 ? "مساءً" : "صباحاً";
    } else {
      period = h >= 12 ? "PM" : "AM";
    }
  }

  const dateString = now.toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hijri = toHijri(now);
  const monthName = HIJRI_MONTHS[locale][hijri.month - 1] ?? "";
  const weekdayName = now.toLocaleDateString(locale === "ar" ? "ar-DZ" : "en-US", { weekday: "long" });
  const hijriDate = locale === "ar"
    ? `${weekdayName}، ${hijri.day} ${monthName} ${hijri.year} هـ`
    : `${weekdayName}, ${hijri.day} ${monthName} ${hijri.year} AH`;

  return { now, timeString, timeOnly, period, dateString, hijriDate };
}
