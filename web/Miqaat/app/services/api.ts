import type { PrayerTime, Wilaya } from "~/data/prayer-data";
import {
  fetchCities,
  fetchDailyPrayerTimes,
  fetchPrayerTimesRange,
  formatDate,
  type ApiPrayerTimesEntry,
} from "./prayerApi";

/* ------------------------------------------------------------------ */
/*  Static Wilaya Metadata                                            */
/*  The API only returns Arabic city names and IDs.                   */
/*  This table maps API city IDs → English names + coordinates        */
/*  (needed for GPS nearest-city matching and bilingual display).     */
/* ------------------------------------------------------------------ */

interface WilayaMeta {
  cityId: number;
  name: string;
  nameAr: string;
  latitude: number;
  longitude: number;
}

const WILAYA_META: Record<number, WilayaMeta> = {
  1: { cityId: 1, name: "Djelfa", nameAr: "الجلفة", latitude: 34.67, longitude: 3.25 },
  2: { cityId: 2, name: "Tébessa", nameAr: "تبسة", latitude: 35.4, longitude: 8.12 },
  3: { cityId: 3, name: "Bir El Ater", nameAr: "بئر العاتر", latitude: 34.75, longitude: 8.06 },
  4: { cityId: 4, name: "Khenchela", nameAr: "خنشلة", latitude: 35.44, longitude: 7.14 },
  5: { cityId: 5, name: "El Oued", nameAr: "الوادي", latitude: 33.37, longitude: 6.85 },
  6: { cityId: 6, name: "Batna", nameAr: "باتنة", latitude: 35.56, longitude: 6.17 },
  7: { cityId: 7, name: "Touggourt", nameAr: "تقرت", latitude: 33.1, longitude: 6.06 },
  8: { cityId: 8, name: "Biskra", nameAr: "بسكرة", latitude: 34.85, longitude: 5.73 },
  10: { cityId: 10, name: "Bou Saâda", nameAr: "بوسعادة", latitude: 35.21, longitude: 4.17 },
  11: { cityId: 11, name: "Ain El Melh", nameAr: "عين الملح", latitude: 34.84, longitude: 2.89 },
  12: { cityId: 12, name: "Hassi R'Mel", nameAr: "حاسي الرمل", latitude: 32.93, longitude: 3.27 },
  13: { cityId: 13, name: "Laghouat", nameAr: "الأغواط", latitude: 33.8, longitude: 2.88 },
  14: { cityId: 14, name: "Ain Oussera", nameAr: "عين وسارة", latitude: 35.45, longitude: 2.9 },
  15: { cityId: 15, name: "Tissemsilt", nameAr: "تيسمسيلت", latitude: 35.61, longitude: 1.81 },
  16: { cityId: 16, name: "Tiaret", nameAr: "تيارت", latitude: 35.37, longitude: 1.32 },
  17: { cityId: 17, name: "El Bayadh", nameAr: "البيض", latitude: 33.69, longitude: 1.02 },
  18: { cityId: 18, name: "Saïda", nameAr: "سعيدة", latitude: 34.83, longitude: 0.15 },
  19: { cityId: 19, name: "Mascara", nameAr: "معسكر", latitude: 35.4, longitude: 0.14 },
  20: { cityId: 20, name: "Naâma", nameAr: "النعامة", latitude: 33.27, longitude: -0.31 },
  21: { cityId: 21, name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس", latitude: 35.19, longitude: -0.63 },
  22: { cityId: 22, name: "Ibn Badis", nameAr: "ابن باديس", latitude: 35.22, longitude: -0.71 },
  23: { cityId: 23, name: "Tlemcen", nameAr: "تلمسان", latitude: 34.88, longitude: -1.32 },
  24: { cityId: 24, name: "Aïn Témouchent", nameAr: "عين تموشنت", latitude: 35.3, longitude: -1.14 },
  25: { cityId: 25, name: "Sebdou", nameAr: "سبدو", latitude: 34.64, longitude: -1.33 },
  26: { cityId: 26, name: "Maghnia", nameAr: "مغنية", latitude: 34.86, longitude: -1.73 },
  27: { cityId: 27, name: "Algiers", nameAr: "الجزائر", latitude: 36.75, longitude: 3.06 },
  28: { cityId: 28, name: "Oran", nameAr: "وهران", latitude: 35.7, longitude: -0.63 },
  29: { cityId: 29, name: "Mostaganem", nameAr: "مستغانم", latitude: 35.93, longitude: 0.09 },
  30: { cityId: 30, name: "Relizane", nameAr: "غليزان", latitude: 35.74, longitude: 0.56 },
  31: { cityId: 31, name: "Chlef", nameAr: "الشلف", latitude: 36.16, longitude: 1.33 },
  32: { cityId: 32, name: "Aïn Defla", nameAr: "عين الدفلى", latitude: 36.26, longitude: 1.97 },
  33: { cityId: 33, name: "Tipaza", nameAr: "تيبازة", latitude: 36.59, longitude: 2.45 },
  34: { cityId: 34, name: "Médéa", nameAr: "المدية", latitude: 36.26, longitude: 2.75 },
  35: { cityId: 35, name: "Blida", nameAr: "البليدة", latitude: 36.47, longitude: 2.83 },
  36: { cityId: 36, name: "Boumerdès", nameAr: "بومرداس", latitude: 36.76, longitude: 3.47 },
  37: { cityId: 37, name: "Bouira", nameAr: "البويرة", latitude: 36.38, longitude: 3.9 },
  38: { cityId: 38, name: "Dellys", nameAr: "دلس", latitude: 36.91, longitude: 3.91 },
  39: { cityId: 39, name: "Tizi Ouzou", nameAr: "تيزي وزو", latitude: 36.71, longitude: 4.05 },
  40: { cityId: 40, name: "M'Sila", nameAr: "المسيلة", latitude: 35.7, longitude: 4.54 },
  41: { cityId: 41, name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج", latitude: 36.07, longitude: 4.76 },
  42: { cityId: 42, name: "Béjaïa", nameAr: "بجاية", latitude: 36.75, longitude: 5.08 },
  43: { cityId: 43, name: "Sétif", nameAr: "سطيف", latitude: 36.19, longitude: 5.41 },
  44: { cityId: 44, name: "Jijel", nameAr: "جيجل", latitude: 36.82, longitude: 5.77 },
  45: { cityId: 45, name: "Mila", nameAr: "ميلة", latitude: 36.45, longitude: 6.26 },
  46: { cityId: 46, name: "Constantine", nameAr: "قسنطينة", latitude: 36.37, longitude: 6.61 },
  47: { cityId: 47, name: "Skikda", nameAr: "سكيكدة", latitude: 36.88, longitude: 6.91 },
  48: { cityId: 48, name: "Oum El Bouaghi", nameAr: "أم البواقي", latitude: 35.88, longitude: 7.11 },
  49: { cityId: 49, name: "Guelma", nameAr: "قالمة", latitude: 36.46, longitude: 7.43 },
  50: { cityId: 50, name: "Annaba", nameAr: "عنابة", latitude: 36.9, longitude: 7.77 },
  51: { cityId: 51, name: "Souk Ahras", nameAr: "سوق أهراس", latitude: 36.29, longitude: 7.95 },
  52: { cityId: 52, name: "El Tarf", nameAr: "الطارف", latitude: 36.77, longitude: 8.31 },
  53: { cityId: 53, name: "Adrar", nameAr: "أدرار", latitude: 27.87, longitude: -0.29 },
  54: { cityId: 54, name: "Tindouf", nameAr: "تندوف", latitude: 27.67, longitude: -8.15 },
  55: { cityId: 55, name: "Béchar", nameAr: "بشار", latitude: 31.62, longitude: -2.22 },
  56: { cityId: 56, name: "Timimoun", nameAr: "تميمون", latitude: 29.26, longitude: 0.23 },
  57: { cityId: 57, name: "Reggane", nameAr: "رقان", latitude: 26.72, longitude: 0.17 },
  58: { cityId: 58, name: "Bordj Badji Mokhtar", nameAr: "برج باجي مختار", latitude: 21.33, longitude: 0.95 },
  59: { cityId: 59, name: "Beni Abbès", nameAr: "بني عباس", latitude: 30.13, longitude: -2.17 },
  60: { cityId: 60, name: "Ain Salah", nameAr: "عين صالح", latitude: 27.2, longitude: 2.47 },
  61: { cityId: 61, name: "El Meniaa", nameAr: "المنيعة", latitude: 30.58, longitude: 2.88 },
  62: { cityId: 62, name: "Ghardaïa", nameAr: "غرداية", latitude: 32.49, longitude: 3.67 },
  63: { cityId: 63, name: "Ouargla", nameAr: "ورقلة", latitude: 31.95, longitude: 5.33 },
  64: { cityId: 64, name: "Tamanrasset", nameAr: "تمنراست", latitude: 22.79, longitude: 5.53 },
  65: { cityId: 65, name: "Ain Guezzam", nameAr: "عين قزام", latitude: 19.57, longitude: 5.77 },
  66: { cityId: 66, name: "Illizi", nameAr: "إليزي", latitude: 26.51, longitude: 8.48 },
  67: { cityId: 67, name: "Djanet", nameAr: "جانت", latitude: 24.55, longitude: 9.48 },
  68: { cityId: 68, name: "Ain Amenas", nameAr: "عين أمناس", latitude: 28.05, longitude: 9.63 },
  69: { cityId: 69, name: "Beni Ounif", nameAr: "بني ونيف", latitude: 32.05, longitude: -1.25 },
};

/* ------------------------------------------------------------------ */
/*  API → App Type Mappers                                            */
/* ------------------------------------------------------------------ */

/**
 * Normalize time strings from API (e.g. "4:32") to "HH:MM" format.
 */
function normalizeTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Calculate Duha time as 15 minutes after Sunrise.
 */
function calculateDuha(sunriseTime: string): string {
  const [h, m] = sunriseTime.split(":").map(Number);
  const totalMinutes = h * 60 + m + 15;
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

/**
 * Map an API prayer times entry to the app's PrayerTime[] format.
 * Shurooq → Sunrise, Duha → Sunrise + 15 mins.
 */
function mapApiEntryToPrayerTimes(entry: ApiPrayerTimesEntry): PrayerTime[] {
  const sunrise = normalizeTime(entry.Shurooq);
  const duha = calculateDuha(entry.Shurooq);

  return [
    { name: "Fajr", label: "Fajr", time: normalizeTime(entry.Fajr), icon: "moon", isPrayer: true },
    { name: "Sunrise", label: "Sunrise", time: sunrise, icon: "sunrise", isPrayer: false },
    { name: "Duha", label: "Duha", time: duha, icon: "sun-dim", isPrayer: true },
    { name: "Dhuhr", label: "Dhuhr", time: normalizeTime(entry.Dhuhr), icon: "sun", isPrayer: true },
    { name: "Asr", label: "Asr", time: normalizeTime(entry.Asr), icon: "cloud-sun", isPrayer: true },
    { name: "Maghrib", label: "Maghrib", time: normalizeTime(entry.Maghrib), icon: "sunset", isPrayer: true },
    { name: "Isha", label: "Isha", time: normalizeTime(entry.Isha), icon: "star", isPrayer: true },
  ];
}

/* ------------------------------------------------------------------ */
/*  Public API Functions                                              */
/* ------------------------------------------------------------------ */

/** Fetch all wilayas (cities) from the API, enriched with metadata. */
export async function fetchWilayas(): Promise<Wilaya[]> {
  const cities = await fetchCities();
  return cities.map((city, index) => {
    const meta = WILAYA_META[city._id];
    return {
      id: index + 1,
      cityId: city._id,
      name: meta?.name ?? city.MADINA_NAME,
      nameAr: meta?.nameAr ?? city.MADINA_NAME,
      latitude: meta?.latitude ?? 36.75,
      longitude: meta?.longitude ?? 3.06,
    };
  });
}

/** Fetch today's prayer times for a given city. */
export async function fetchPrayerTimes(cityId: number): Promise<PrayerTime[]> {
  const entries = await fetchDailyPrayerTimes(cityId);
  if (!entries || entries.length === 0) {
    throw new Error("No prayer times data returned from API.");
  }
  return mapApiEntryToPrayerTimes(entries[0]);
}

/** Fetch prayer times for an entire month. */
export interface DayPrayerTimes {
  date: string; // "YYYY-MM-DD"
  day: number;
  times: PrayerTime[];
}

export async function fetchMonthlyPrayerTimes(
  cityId: number,
  year: number,
  month: number, // 0-indexed
): Promise<DayPrayerTimes[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(daysInMonth).padStart(2, "0")}`;

  const entries = await fetchPrayerTimesRange(cityId, startDate, endDate);

  return entries.map((entry) => {
    const d = new Date(entry.GeoDate);
    return {
      date: entry.GeoDate,
      day: d.getDate(),
      times: mapApiEntryToPrayerTimes(entry),
    };
  });
}

/** Find the nearest wilaya for GPS coordinates using static metadata. */
export async function findNearestLocation(
  lat: number,
  lng: number,
): Promise<{ wilaya: Wilaya } | null> {
  // Use the static metadata table for distance calculations
  const entries = Object.values(WILAYA_META);
  let nearest: WilayaMeta | null = null;
  let minDist = Infinity;

  for (const meta of entries) {
    const dist = Math.hypot(meta.latitude - lat, meta.longitude - lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = meta;
    }
  }

  if (!nearest) return null;

  return {
    wilaya: {
      id: nearest.cityId,
      cityId: nearest.cityId,
      name: nearest.name,
      nameAr: nearest.nameAr,
      latitude: nearest.latitude,
      longitude: nearest.longitude,
    },
  };
}
