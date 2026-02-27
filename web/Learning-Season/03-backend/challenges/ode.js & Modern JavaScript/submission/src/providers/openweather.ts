import type { IWeatherService } from '../interfaces.js';
import {
  toCurrentWeatherDto,
  toDailyForecastDto,
  toHourlyForecastDto,
} from '../utils/mappers.js';

export class OpenWeatherApi implements IWeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  private _forecast: 'current' | 'hourly' | 'daily' = 'current';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenWeather API key is required');
    }
    this.apiKey = apiKey;
  }

  reset(): IWeatherService {
    this._forecast = 'current';
    return this;
  }

  forecast(forecast: 'current' | 'hourly' | 'daily'): IWeatherService {
    this._forecast = forecast;
    return this;
  }

  private buildUrl(
    endpoint: string,
    params: Record<string, string | number>,
  ): string {
    const query = new URLSearchParams({
      ...params,
      appid: this.apiKey,
    }).toString();
    return `${this.baseUrl}/${endpoint}?${query}`;
  }

  async getWeather(location: string, count?: number) {
    let endpoint: string;
    let mapper;
    switch (this._forecast) {
      case 'current':
        endpoint = 'weather';
        mapper = toCurrentWeatherDto;
        break;
      case 'hourly':
        endpoint = 'forecast';
        mapper = toHourlyForecastDto;
        break;
      case 'daily':
        endpoint = 'forecast/daily';
        mapper = toDailyForecastDto;
        break;
      default:
        throw new Error('Invalid forecast type');
    }

    const url = this.buildUrl(endpoint, {
      q: location,
      cnt: count || (this._forecast === 'hourly' ? 4 : 7),
    });
    const res = await fetch(url);
    const data = (await res.json()) as any;

    if (!res.ok) {
      throw new Error(`${data.message || res.statusText}`);
    }

    return mapper(data);
  }
}
