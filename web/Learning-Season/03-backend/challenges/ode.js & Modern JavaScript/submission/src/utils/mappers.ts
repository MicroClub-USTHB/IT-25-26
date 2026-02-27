import type {
  CurrentWeatherDto,
  DailyForecastDto,
  DailyForecastItemDto,
  HourlyForecastDto,
  HourlyForecastItemDto,
  WeatherConditionDto,
  CoordinatesDto,
} from '../types.js';

// ------------------------------
// Helpers
// ------------------------------

const kelvinToCelsius = (k: number) => +(k - 273.15).toFixed(1);

const mapWeatherCondition = (w: {
  id: number;
  main: string;
  description: string;
  icon: string;
}): WeatherConditionDto => ({
  ...w,
  iconUrl: `https://openweathermap.org/img/wn/${w.icon}@2x.png`,
});

const mapCoordinates = (lat: number, lon: number): CoordinatesDto => ({
  lat,
  lon,
});

// ------------------------------
// Current Weather Mapper
// ------------------------------

export const toCurrentWeatherDto = (data: any): CurrentWeatherDto => ({
  city: data.name,
  country: data.sys.country,
  coordinates: mapCoordinates(data.coord.lat, data.coord.lon),
  temperature: kelvinToCelsius(data.main.temp),
  feelsLike: kelvinToCelsius(data.main.feels_like),
  minTemperature: kelvinToCelsius(data.main.temp_min),
  maxTemperature: kelvinToCelsius(data.main.temp_max),
  humidity: data.main.humidity,
  pressure: data.main.pressure,
  visibility: data.visibility,
  windSpeed: data.wind.speed,
  windDirection: data.wind.deg,
  windGust: data.wind.gust,
  cloudiness: data.clouds.all,
  rainLastHour: data.rain?.['1h'],
  condition: mapWeatherCondition(data.weather[0]),
  sunrise: new Date(data.sys.sunrise * 1000),
  sunset: new Date(data.sys.sunset * 1000),
  timestamp: new Date(data.dt * 1000),
});

// ------------------------------
// Daily Forecast Mapper
// ------------------------------

export const toDailyForecastDto = (data: any): DailyForecastDto => ({
  city: data.city.name,
  country: data.city.country,
  timezone: data.city.timezone,
  days: data.list.map(
    (day: any): DailyForecastItemDto => ({
      date: new Date(day.dt * 1000),
      temperature: {
        day: kelvinToCelsius(day.temp.day),
        min: kelvinToCelsius(day.temp.min),
        max: kelvinToCelsius(day.temp.max),
        night: kelvinToCelsius(day.temp.night),
        morning: kelvinToCelsius(day.temp.morn),
        evening: kelvinToCelsius(day.temp.eve),
      },
      feelsLike: {
        day: kelvinToCelsius(day.feels_like.day),
        night: kelvinToCelsius(day.feels_like.night),
        morning: kelvinToCelsius(day.feels_like.morn),
        evening: kelvinToCelsius(day.feels_like.eve),
      },
      humidity: day.humidity,
      pressure: day.pressure,
      windSpeed: day.speed,
      windDirection: day.deg,
      windGust: day.gust,
      cloudiness: day.clouds,
      precipitationProbability: day.pop,
      rain: day.rain,
      condition: mapWeatherCondition(day.weather[0]),
      sunrise: new Date(day.sunrise * 1000),
      sunset: new Date(day.sunset * 1000),
    }),
  ),
});

// ------------------------------
// Hourly Forecast Mapper
// ------------------------------

export const toHourlyForecastDto = (data: any): HourlyForecastDto => ({
  city: data.city.name,
  country: data.city.country,
  timezone: data.city.timezone,
  hours: data.list.map(
    (hour: any): HourlyForecastItemDto => ({
      date: new Date(hour.dt * 1000),
      temperature: kelvinToCelsius(hour.main.temp),
      feelsLike: kelvinToCelsius(hour.main.feels_like),
      humidity: hour.main.humidity,
      pressure: hour.main.pressure,
      windSpeed: hour.wind.speed,
      windDirection: hour.wind.deg,
      windGust: hour.wind.gust,
      cloudiness: hour.clouds.all,
      visibility: hour.visibility,
      precipitationProbability: hour.pop,
      rainLastHour: hour.rain?.['1h'],
      condition: mapWeatherCondition(hour.weather[0]),
      partOfDay: hour.sys.pod === 'd' ? 'day' : 'night',
    }),
  ),
});
