export type PrayerName = "Fajr" | "Sunrise" | "Duha" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export interface PrayerTime {
  name: PrayerName;
  time: string; // "HH:MM" 24h
  label: string;
  icon: string;
  isPrayer: boolean; // false for Sunrise
}

export interface Location {
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  timezone: string;
  latitude: number;
  longitude: number;
  cityId: number;
}







export interface Wilaya {
  id: number;
  cityId: number;
  name: string;
  nameAr: string;
  latitude: number;
  longitude: number;
}


