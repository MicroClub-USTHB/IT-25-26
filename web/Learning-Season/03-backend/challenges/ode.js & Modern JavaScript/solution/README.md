# Weather CLI

A simple command-line tool that fetches real-time weather data for any city using the OpenWeatherMap API.

## What it does

You enter a city name, and it returns the current weather status including temperature, humidity, weather condition, and country.

## Setup

**1. Clone the repo and install dependencies**
```bash
npm install
```

> This project uses `prompt-sync`for user input and `dotenv` for environment variables.

**2. Get an API key**

Create a free account at [openweathermap.org](https://openweathermap.org/api) and grab your API key.

**3. Create `.env` file and put you api key**
```
API_KEY=your_api_key_here
```

**4. Run the app**
```bash
node index.js
```

## Example

```
enter a city name to get its weather status: Algiers
{
  country: 'DZ',
  city: 'Algiers',
  weather: 'Clear',
  temp: '18°C',
  humidity: '72%'
}
```

## Notes

- Handles API errors (invalid key, city not found, server issues).