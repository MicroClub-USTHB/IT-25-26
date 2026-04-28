# 🌦 Weather CLI App

A Node.js command-line application that fetches real-time weather data from the [OpenWeatherMap API](https://openweathermap.org/api) and displays it in the console.

---

## Features

- Interactive city input — no flags or arguments required
- Also supports CLI argument for scripted/automated use
- Clean error handling for invalid cities, bad API keys, and network failures
- Modular architecture: service layer, display layer, and entry point are fully separated
- Secure API key management via environment variables

---



## Example Output

```
Enter city name: Alger
Fetching weather data for Algiers...
--------------------
City: Algiers, DZ
Temperature: 14°C
Humidity: 48%
Wind Speed: 0.51 m/s
Description: fog
--------------------
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Empty city input | Prints usage message and exits |
| City not found (404) | Prints `[404] city not found` |
| Invalid API key (401) | Prints `[401] Invalid API key` |
| No internet / network failure | Prints fetch error message |

---

## Tech Stack

- **Node.js** (ES Modules)
- **node-fetch** — HTTP requests
- **dotenv** — environment variable management
- **readline** — interactive terminal input

