import chalk from 'chalk';
import type {
  CurrentWeatherDto,
  DailyForecastDto,
  HourlyForecastDto,
} from '../types.js';

const weatherEmoji = (main: string) => {
  switch (main.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'snow':
      return '❄️';
    case 'thunderstorm':
      return '⛈️';
    case 'drizzle':
      return '🌦️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default:
      return '';
  }
};

// ------------------------------
// Current Weather Printer
// ------------------------------
export const printCurrentWeather = (data: CurrentWeatherDto) => {
  console.log(chalk.blue.bold(`\n🌆 Weather in ${data.city}, ${data.country}`));
  console.log(
    `${weatherEmoji(data.condition.main)}  ${chalk.yellow.bold(data.condition.description)}`,
  );
  console.log(
    `🌡️  Temperature: ${data.temperature}°C (feels like ${data.feelsLike}°C)`,
  );
  console.log(
    `🌡️  Min/Max: ${data.minTemperature}°C / ${data.maxTemperature}°C`,
  );
  console.log(`💧 Humidity: ${data.humidity}%`);
  console.log(
    `💨 Wind: ${data.windSpeed} m/s, ${data.windDirection}° ${data.windGust ? `(gusts ${data.windGust} m/s)` : ''}`,
  );
  if (data.rainLastHour)
    console.log(`🌧️  Rain last hour: ${data.rainLastHour} mm`);
  console.log(`☁️  Cloudiness: ${data.cloudiness}%`);
  console.log(
    `🌅 Sunrise: ${data.sunrise.toLocaleTimeString()} | 🌇 Sunset: ${data.sunset.toLocaleTimeString()}`,
  );
  console.log(chalk.gray(`⏰ Updated: ${data.timestamp.toLocaleString()}`));
};

// ------------------------------
// Daily Forecast Printer
// ------------------------------
export const printDailyForecast = (data: DailyForecastDto, daysCount = 7) => {
  console.log(
    chalk.blue.bold(
      `\n📅 ${daysCount}-Day Forecast for ${data.city}, ${data.country}\n`,
    ),
  );

  data.days.slice(0, daysCount).forEach((day) => {
    const dateStr = day.date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    console.log(chalk.green.bold(dateStr));
    console.log(
      `${weatherEmoji(day.condition.main)}  ${chalk.yellow(day.condition.description)}`,
    );
    console.log(
      `🌡️ Day: ${day.temperature.day}°C | Night: ${day.temperature.night}°C`,
    );
    console.log(
      `💧 Humidity: ${day.humidity}% | ☁️ Cloudiness: ${day.cloudiness}% | 🌦️ Rain: ${day.rain ?? 0} mm`,
    );
    console.log(`💨 Wind: ${day.windSpeed} m/s, ${day.windDirection}°`);
    console.log(
      `🌅 Sunrise: ${day.sunrise.toLocaleTimeString()} | 🌇 Sunset: ${day.sunset.toLocaleTimeString()}\n`,
    );
  });
};

// ------------------------------
// Hourly Forecast Printer
// ------------------------------
export const printHourlyForecast = (
  data: HourlyForecastDto,
  hoursCount = 4,
) => {
  console.log(
    chalk.blue.bold(
      `\n⏱️ Hourly Forecast for ${data.city}, ${data.country} (next ${hoursCount} hours)\n`,
    ),
  );

  data.hours.slice(0, hoursCount).forEach((hour) => {
    const timeStr = hour.date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    console.log(chalk.green.bold(timeStr));
    console.log(
      `${weatherEmoji(hour.condition.main)}  ${chalk.yellow(hour.condition.description)}`,
    );
    console.log(
      `🌡️ Temp: ${hour.temperature}°C (feels like ${hour.feelsLike}°C)`,
    );
    console.log(
      `💧 Humidity: ${hour.humidity}% | ☁️ Clouds: ${hour.cloudiness}% | 🌦️ Rain: ${hour.rainLastHour ?? 0} mm`,
    );
    console.log(`💨 Wind: ${hour.windSpeed} m/s, ${hour.windDirection}°`);
    console.log(`🌓 Part of Day: ${hour.partOfDay}\n`);
  });
};
