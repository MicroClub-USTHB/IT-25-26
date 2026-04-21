# Weather CLI

A Node.js command-line app that fetches real-time weather data from [OpenWeatherMap](https://openweathermap.org/), built with TypeScript.

Supports current conditions, hourly forecasts, and multi-day forecasts — with both inline and interactive REPL modes.

---

## Features

- Current weather, hourly forecast, and daily forecast
- Inline mode for quick one-shot queries
- Interactive REPL mode for continuous querying
- In-memory cache with TTL to avoid redundant API calls
- Auto-detects your city via IP if no location is provided

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
OPENWEATHER_API_KEY=your_openweather_api_key
```

- Get an OpenWeatherMap API key at [openweathermap.org](https://home.openweathermap.org/users/sign_up)

---

## Usage

### Inline mode

```bash
npm start -- [location] [options]
```

| Option             | Description                             |
| ------------------ | --------------------------------------- |
| `-H, --hourly [n]` | Hourly forecast (`n` hours, default: 4) |
| `-d, --daily [n]`  | Daily forecast (`n` days, default: 7)   |
| `--no-cache`       | Disable cache for this request          |
| `--show-cache`     | Print cache state after fetching        |

**Examples:**

```bash
# Current weather in Algiers
npm start -- algiers

# 8-hour forecast
npm start -- blida -H 8

# 5-day forecast with no cache
npm start -- "new york" -d 5 --no-cache

# Auto-detect city
npm start
```

### Interactive mode

```bash
npm start -- -i
# or
npm start -- --interactive
```

Inside the REPL:

```
weather-cli> weather algiers
weather-cli> weather algiers -H 6
weather-cli> weather algiers -d 3
weather-cli> help
weather-cli> clear
weather-cli> exit
```

---

## Project Structure

```
src/
├── index.ts                  # Entry point
├── interfaces.ts             # Core interfaces
├── types.ts                  # DTOs and shared types
├── core/
│   ├── cli.ts                # CLI orchestrator (inline + interactive)
│   ├── weather.ts            # WeatherService (caching, forecasting)
│   └── weather-command.ts    # Shared Commander command builder
├── providers/
│   ├── openweather.ts        # OpenWeatherMap API client
│   └── cache/
│       ├── local-cache.ts    # In-memory cache with TTL
│       └── file-cache.ts     # File-based cache (not yet implemented)
└── utils/
    ├── helpers.ts            # Includes city auto-detection
    ├── mappers.ts            # API response → DTO transformers
    └── printers.ts           # Formatted console output
```

---

## Scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm start`       | Run with `tsx` (no build needed) |
| `npm run build`   | Compile TypeScript to `dist/`    |
| `npm run preview` | Run compiled output from `dist/` |
