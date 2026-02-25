const express = require("express");
const app = express();
//library for optimisation in  fetch data
const axios = require("axios");

app.get("/weather", async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.long;
  //  data verification
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    console.log("invalid city ");
    res.status(500).json({ message: "invalid city " });
  }

  try {
    // fetch weather information from open-meteo (no api key )
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude: latitude,
        longitude: longitude,
        current_weather: true,
        hourly: "relativehumidity_2m",
      },
    });
    const data = response.data;
    const temp = data.current_weather.temperature+"°C";
    // open meteo return code of weather for each code a weather state
    // i create object of weather with its index
    const weatherCodes = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Freezing drizzle light",
      57: "Freezing drizzle dense",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Freezing rain light",
      67: "Freezing rain heavy",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Rain showers slight",
      81: "Rain showers moderate",
      82: "Rain showers violent",
      85: "Snow showers slight",
      86: "Snow showers heavy",
      95: "Thunderstorm slight/moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    // select weather
    const weather = weatherCodes[data.current_weather.weathercode];
    //its return time zone (not zone)
    const zone = data.timezone;
    const Humidity = data.hourly.relativehumidity_2m[0]+"%";
    // show data
    console.log(
      `the zone ${zone}: \n
     Temperature ${temp} \n
     Weather ${weather} \n
     Humidity ${Humidity}
     `,
    );
    // retrun response (json)
    res.json({
      zone: zone,
      temp: temp,
      weather: weather,
      Humidity:Humidity,
    });
    // catch the error and handling
  } catch (error) {
    console.log("failed request", error.message);
    res.status(500).json({ message: "failed to fetch" });
  }
});
// server listenner
app.listen(3000, () => {
  console.log("i am listenner Port 3000");
});
