import type { WeatherDto } from './types.js';

export interface IWeatherService {
  forecast(forecast: 'current' | 'hourly' | 'daily'): IWeatherService;
  getWeather(city: string, count?: number): Promise<WeatherDto>;
  reset(): IWeatherService;
}

export interface ICacheService {
  has(key: string): Promise<boolean>;
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}

export interface ICliService {
  run(): Promise<void>;
  inline(): ICliService;
}
