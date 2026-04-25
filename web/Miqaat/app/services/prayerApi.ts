/**
 * Adhan DZ API Client
 * Raw fetch layer for https://adhan-dz.dexter21767.com/
 *
 * This module handles all HTTP communication with the API.
 * Response mapping to app types is done in api.ts.
 */

const API_BASE = "https://adhan-dz.dexter21767.com";

/* ------------------------------------------------------------------ */
/*  API Response Types                                                */
/* ------------------------------------------------------------------ */

export interface ApiCity {
  _id: number;
  ParentId: number | null;
  MADINA_NAME: string;
}

export interface ApiPrayerTimesEntry {
  _id: number;
  MADINA_ID: number;
  GeoDate: string; // "YYYY-MM-DD"
  Fajr: string;    // "H:MM" or "HH:MM"
  Shurooq: string; // Sunrise
  Kibla: string;   // Duha / sun zenith
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/* ------------------------------------------------------------------ */
/*  Error Handling                                                    */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response, endpoint: string): Promise<T> {
  if (!res.ok) {
    let message = `API request failed: ${res.status} ${res.statusText}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status, endpoint);
  }
  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  API Functions                                                     */
/* ------------------------------------------------------------------ */

/**
 * Fetch all cities from the API.
 * Returns the raw city list with Arabic names and parent relationships.
 */
export async function fetchCities(): Promise<ApiCity[]> {
  const endpoint = "/cities";
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiCity[]>(res, endpoint);
}

/**
 * Fetch prayer times for a specific city and single date.
 * @param cityId - The city ID from the /cities endpoint
 * @param date - Date in YYYY-MM-DD format. Defaults to today.
 */
export async function fetchDailyPrayerTimes(
  cityId: number,
  date?: string,
): Promise<ApiPrayerTimesEntry[]> {
  const d = date ?? formatDate(new Date());
  const endpoint = `/prayerTimes?cityId=${cityId}&date=${d}`;
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiPrayerTimesEntry[]>(res, endpoint);
}

/**
 * Fetch prayer times for a city over a date range (max 30 days).
 * @param cityId - The city ID
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 */
export async function fetchPrayerTimesRange(
  cityId: number,
  startDate: string,
  endDate: string,
): Promise<ApiPrayerTimesEntry[]> {
  const endpoint = `/prayerTimes?cityId=${cityId}&startDate=${startDate}&endDate=${endDate}`;
  const res = await fetch(`${API_BASE}${endpoint}`);
  return handleResponse<ApiPrayerTimesEntry[]>(res, endpoint);
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Format a Date as YYYY-MM-DD */
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
