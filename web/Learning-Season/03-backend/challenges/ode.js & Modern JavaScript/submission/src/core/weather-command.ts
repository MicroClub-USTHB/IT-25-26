import { Command } from 'commander';
import {
  printCurrentWeather,
  printDailyForecast,
  printHourlyForecast,
} from '../utils/printers.js';
import type {
  CurrentWeatherDto,
  DailyForecastDto,
  HourlyForecastDto,
} from '../types.js';
import type { ICacheService, IWeatherService } from '../interfaces.js';

export function buildWeatherCommand(
  weatherClient: IWeatherService,
  cacheProvider: ICacheService,
): Command {
  const program = new Command();

  program
    .argument('[location]', 'City name or zip code')
    .option('-H, --hourly [hours]', 'Show hourly forecast')
    .option('-d, --daily [days]', 'Show daily forecast')
    .option('--no-cache', 'Disable cache')
    .option('--show-cache', 'Show cache state after fetching data')
    .action(async (location, options) => {
      const { hourly, daily, cache, showCache } = options;
      const forecastFlags = ['hourly', 'daily'].filter((key) => options[key]);
      if (forecastFlags.length > 1) {
        console.error(
          `❌ Only one forecast type is allowed at a time. You passed: ${forecastFlags.join(', ')}`,
        );
        return;
      }

      let forecastType: 'current' | 'hourly' | 'daily' = 'current';
      if (hourly) forecastType = 'hourly';
      if (daily) forecastType = 'daily';

      let count: number | undefined =
        parseInt(hourly, 10) || parseInt(daily, 10);
      count = isNaN(count) ? undefined : count;

      console.log('🔍 Fetching weather data...');

      weatherClient.reset().forecast(forecastType);
      if (!cache) weatherClient.noCache();

      const data = await weatherClient.getWeather(location, count);
      switch (forecastType) {
        case 'current':
          printCurrentWeather(data as CurrentWeatherDto);
          break;
        case 'daily':
          printDailyForecast(data as DailyForecastDto, count);
          break;
        case 'hourly':
          printHourlyForecast(data as HourlyForecastDto, count);
          break;
      }

      if (showCache) {
        cacheProvider.dump();
      }
    });
  return program;
}
