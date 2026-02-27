// ------------------------------
// Shared Types
// ------------------------------
export interface CacheStats {
  hits: number;
  misses: number;
  keys: number;
}

export interface CacheEntry {
  expiresAt: number;
  value: any;
}

export interface CoordinatesDto {
  lat: number;
  lon: number;
}

export interface WeatherConditionDto {
  id: number;
  main: string;
  description: string;
  icon: string;
  iconUrl: string;
}

// ------------------------------
// Current Weather DTO
// ------------------------------

export interface CurrentWeatherDto {
  city: string;
  country: string;
  coordinates: CoordinatesDto;

  temperature: number; // °C
  feelsLike: number; // °C
  minTemperature: number; // °C
  maxTemperature: number; // °C

  humidity: number; // %
  pressure: number; // hPa
  visibility: number; // meters

  windSpeed: number; // m/s
  windDirection: number; // degrees
  windGust?: number;

  cloudiness: number; // %
  rainLastHour?: number; // mm

  condition: WeatherConditionDto;

  sunrise: Date;
  sunset: Date;
  timestamp: Date;
}

// ------------------------------
// Daily Forecast DTO
// ------------------------------

export interface DailyForecastDto {
  city: string;
  country: string;
  timezone: number;
  days: DailyForecastItemDto[];
}

export interface DailyForecastItemDto {
  date: Date;

  temperature: {
    day: number;
    min: number;
    max: number;
    night: number;
    morning: number;
    evening: number;
  };

  feelsLike: {
    day: number;
    night: number;
    morning: number;
    evening: number;
  };

  humidity: number;
  pressure: number;

  windSpeed: number;
  windDirection: number;
  windGust?: number;

  cloudiness: number;
  precipitationProbability: number; // 0–1
  rain?: number; // mm

  condition: WeatherConditionDto;

  sunrise: Date;
  sunset: Date;
}

// ------------------------------
// Hourly Forecast DTO
// ------------------------------

export interface HourlyForecastDto {
  city: string;
  country: string;
  timezone: number;
  hours: HourlyForecastItemDto[];
}

export interface HourlyForecastItemDto {
  date: Date;

  temperature: number;
  feelsLike: number;

  humidity: number;
  pressure: number;

  windSpeed: number;
  windDirection: number;
  windGust?: number;

  cloudiness: number;
  visibility: number;

  precipitationProbability: number;
  rainLastHour?: number;

  condition: WeatherConditionDto;

  partOfDay: 'day' | 'night';
}

export type WeatherDto =
  | CurrentWeatherDto
  | DailyForecastDto
  | HourlyForecastDto;
