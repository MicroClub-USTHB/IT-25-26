# 🌦 Weather CLI App

A simple Node.js command-line application that fetches and displays real-time weather data using the [OpenWeatherMap API](https://openweathermap.org/api).

---

## 📋 Features

- Fetches live weather for any city
- Displays temperature, weather condition, humidity, and wind speed
- Handles errors (invalid city, bad API key, network issues)
- Uses environment variables to protect your API key
- Built with async/await — no callbacks

---

## 🖥 Usage

```bash
node index.js <city>
```

**Examples:**

```bash
node index.js London
node index.js "New York"
node index.js Tokyo
```

**Sample output:**

```

  🌍 London, GB
  
  🌡  Temperature : 18°C (feels like 16°C)
  🌤  Weather     : Clear sky
  💧 Humidity    : 60%
  💨 Wind Speed  : 3.5 m/s
```

---

## ⚠️ Error Handling

| Scenario          | Message                                                              |
| ----------------- | -------------------------------------------------------------------- |
| No city provided  | `Usage: node index.js <city>`                                        |
| Invalid city name | `City "example" not found. Please check the city name.`              |
| Invalid API key   | `Invalid API key. Please check your OPENWEATHER_API_KEY.`            |
| Network failure   | `Network error: Unable to reach the weather API.`                    |
| Missing API key   | `Missing API key. Please set OPENWEATHER_API_KEY in your .env file.` |

---

## 📁 Project Structure

```
weather-cli/
├── index.js        # Main application logic
├── .env            # The API key (hadi lazm tpushiha XD)
├── package.json    # Project metadata and dependencies
└── README.md       # This file
```

---

## 📦 Dependencies

| Package  | Purpose                                 |
| -------- | --------------------------------------- |
| `dotenv` | Loads environment variables from `.env` |
|          |                                         |

