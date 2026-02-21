# 🌦️ Weather CLI

A command-line interface tool to fetch real-time weather data from OpenWeather API.

## ✨ Features

- 🌍 Search weather by city name
- 🌡️ Display temperature, humidity, wind speed, and more
- 🔐 Secure API key management using environment variables
- 🛡️ Comprehensive error handling:
  - Invalid city names
  - Network connectivity issues
  - Invalid API keys
  - API errors
- ⏳ Async/Await based API requests
- 🧠 Clean ES6+ JavaScript structure

## 🚀 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your OpenWeather API key to `.env`:
   ```
   WEATHER_API_KEY=your_actual_api_key
   ```
   Get your free API key from: https://openweathermap.org/api

## 📖 Usage

Run the CLI tool:
```bash
npm start
```

Or:
```bash
npm run dev
```

Then enter any city name to get its current weather:
```
🌍 Enter city name (or "exit" to quit): London
```

## 🧪 Error Handling

The CLI handles various error scenarios:

✅ **Valid City**
```
🌍 Enter city name: London
🌦️ Weather in London, GB
🌡️ Temperature: 15°C
```

❌ **Invalid City**
```
🌍 Enter city name: InvalidCity123
🌍 City "InvalidCity123" not found. Please check the spelling and try again.
```

⚠️ **Network Issues**
```
🌐 Network error. Please check your internet connection.
```

🔐 **Invalid API Key**
```
🔐 Invalid API key. Please check your WEATHER_API_KEY in .env file.
```

## 🏗️ Project Structure

```
weather-cli/
├── index.js          # Main CLI application
├── package.json      # Project dependencies and scripts
├── .env             # Environment variables (not committed)
├── .env.example     # Template for environment variables
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## 🛠️ Technologies Used

- Node.js
- OpenWeather API
- ES6+ JavaScript (async/await, destructuring, modules)
- dotenv for environment variable management

## 📝 License

ISC
