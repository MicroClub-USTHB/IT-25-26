import type { CacheEntry, CacheStats, WeatherDto } from './types.js';

export interface IWeatherProvider {
  forecast(forecast: 'current' | 'hourly' | 'daily'): IWeatherProvider;
  getWeather(city: string, count?: number): Promise<WeatherDto>;
  reset(): IWeatherProvider;
}

export interface IWeatherService extends IWeatherProvider {
  noCache(): IWeatherService;
}
export interface ICacheService {
  defaultTimeout?: number;
  has(key: string): Promise<boolean>;
  get(key: string): Promise<CacheEntry | null>;
  set(key: string, value: any, timeout?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  getStats(): CacheStats;
  dump(): void;
  clearTimers?(): void;
}

export interface ICliService {
  run(): Promise<void>;
  inline(): ICliService;
}
