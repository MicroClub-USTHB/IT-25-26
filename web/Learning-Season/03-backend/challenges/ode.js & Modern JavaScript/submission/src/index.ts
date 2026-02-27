import { CliService } from './core/cli.js';
import { WeatherService } from './core/weather.js';
import { LocalCacheProvider } from './providers/cache/local-cache.js';
import { OpenWeatherApi } from './providers/openweather.js';

const args = process.argv.slice(2);

function initCli() {
  const isInteractive = args.includes('-i') || args.includes('--interactive');
  let cacheProvider;

  if (isInteractive) {
    cacheProvider = new LocalCacheProvider();
  } else {
    // cacheProvider = new FileCacheProvider(); not implemented yet
    cacheProvider = new LocalCacheProvider();
  }

  const weatherProvider = new OpenWeatherApi(process.env.OPENWEATHER_API_KEY!);
  const weatherClient = new WeatherService(weatherProvider, cacheProvider);

  const cliClient = new CliService(weatherClient);

  if (!isInteractive) {
    return cliClient.inline();
  }

  return cliClient;
}

async function start() {
  try {
    const cliClient = initCli();
    await cliClient.run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error fetching weather data:', message);
    process.exitCode = 1;
  }
}

start();
