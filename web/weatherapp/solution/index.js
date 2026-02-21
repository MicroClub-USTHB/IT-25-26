import 'dotenv/config';
import readline from 'readline';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}`;

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Fetch weather data from WeatherAPI.com
 * @param {string} city - City name to search
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    if (!API_KEY) {
        throw new Error('❌ API key not found. Please check your .env file.');
    }

    const url = `${BASE_URL}&q=${encodeURIComponent(city)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Handle API errors (weatherapi.com returns error in response body)
        if (data.error) {
            if (data.error.code === 1006) {
                throw new Error(`🌍 City "${city}" not found. Please check the spelling and try again.`);
            }
            if (data.error.code === 2006) {
                throw new Error('🔐 Invalid API key. Please check your WEATHER_API_KEY in .env file.');
            }
            throw new Error(`⚠️ API Error: ${data.error.message || 'Unknown error occurred'}`);
        }
        
        if (!response.ok) {
            throw new Error(`⚠️ HTTP Error: ${response.status} ${response.statusText}`);
        }
        
        return data;
    } catch (error) {
        // Handle network errors
        if (error.message.includes('fetch')) {
            throw new Error('🌐 Network error. Please check your internet connection.');
        }
        throw error;
    }
}

/**
 * Display weather information in a formatted way
 * @param {Object} data - Weather data from WeatherAPI.com
 */
function displayWeather(data) {
    const { location, current } = data;
    
    console.log('\n' + '='.repeat(50));
    console.log(`🌦️  Weather in ${location.name}, ${location.country}`);
    console.log('='.repeat(50));
    console.log(`🌡️  Temperature: ${current.temp_c}°C (feels like ${current.feelslike_c}°C)`);
    console.log(`📊 Condition: ${current.condition.text}`);
    console.log(`💧 Humidity: ${current.humidity}%`);
    console.log(`💨 Wind Speed: ${current.wind_kph} km/h`);
    console.log(`🔽 Pressure: ${current.pressure_mb} mb`);
    console.log('='.repeat(50) + '\n');
}

/**
 * Prompt user for city and fetch weather
 */
function askForCity() {
    rl.question('🌍 Enter city name (or "exit" to quit): ', async (city) => {
        city = city.trim();
        
        if (city.toLowerCase() === 'exit' || city.toLowerCase() === 'quit') {
            console.log('👋 Thank you for using Weather CLI!');
            rl.close();
            return;
        }
        
        if (!city) {
            console.log('⚠️  Please enter a valid city name.');
            askForCity();
            return;
        }
        
        try {
            console.log(`\n🔍 Fetching weather data for "${city}"...`);
            const weatherData = await fetchWeatherData(city);
            displayWeather(weatherData);
        } catch (error) {
            console.error(`\n${error.message}\n`);
        }
        
        // Ask for another city
        askForCity();
    });
}

// Start the CLI
console.log('\n🌦️  Welcome to Weather CLI');
console.log('━'.repeat(50));
askForCity();