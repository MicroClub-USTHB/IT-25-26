import "dotenv/config";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(city) {
  if (!API_KEY) {
    throw new Error(
      "Missing API key."
    );
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your OPENWEATHER_API_KEY."); // 401 Unauthorized when the API key is invalid or missing
    }
    if (response.status === 404) { // 404 Not Found when the city does not exist
      throw new Error(`City "${city}" not found. Please check the city name.`);
    }
    throw new Error(`API error (${response.status}): ${data.message}`); // Handle other errors like 500...ect
  }

  return data;
}

function displayWeather(data) {
  const city = data.name;
  const country = data.sys.country;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const description =
    data.weather[0].description.charAt(0).toUpperCase() +
    data.weather[0].description.slice(1);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;

  console.log(`  🌍 ${city}, ${country} \n`);
  console.log(`  🌡  Temperature : ${temp}°C (feels like ${feelsLike}°C)`);
  console.log(`  🌤  Weather     : ${description}`);
  console.log(`  💧 Humidity    : ${humidity}%`);
  console.log(`  💨 Wind Speed  : ${windSpeed} m/s`);
}

async function main() {
  const city = process.argv[2];

  if (!city) {
    console.error("Usage: node index.js <city>");
    console.error("Example: node index.js London");
    process.exit(1);
  }

  try {
    const data = await getWeather(city);
    displayWeather(data);
  } catch (error) {
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.error("Network error: Unable to reach the weather API. Check your internet connection.");
    } else {
      console.error("Something went wrong:", error.message);
    }
    process.exit(1);
  }
}

main();