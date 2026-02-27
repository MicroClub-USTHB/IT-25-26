import 'dotenv/config';
import type { ICacheService, IWeatherService } from '../interfaces.js';
import type { WeatherDto } from '../types.js';
import { detectCity } from '../utils/helpers.js';

export class WeatherService implements IWeatherService {
  private _forecast: 'current' | 'hourly' | 'daily' = 'current';
  private _noCache: boolean = false;

  constructor(
    protected readonly weatherProvider: IWeatherService,
    protected readonly cacheProvider: ICacheService,
  ) {}

  reset() {
    this._forecast = 'current';
    this._noCache = false;
    return this;
  }

  forecast(forecast: 'current' | 'hourly' | 'daily') {
    this._forecast = forecast;
    return this;
  }

  noCache() {
    this._noCache = true;
    return this;
  }

  async getWeather(location: string, count?: number) {
    if (this._noCache === false) {
      const cached = await this.cacheProvider.get(
        `${this._forecast}:${location}`,
      );
      console.log('cache:', cached ? 'HIT' : 'MISS');
      if (cached) return cached as WeatherDto;
    }

    this.weatherProvider.forecast(this._forecast);

    if (!location) {
      location = await detectCity();
    }

    const data = await this.weatherProvider.getWeather(location, count);

    if (this._noCache === false) {
      await this.cacheProvider.set(`${this._forecast}:${location}`, data);
    }

    return data;
  }
}
