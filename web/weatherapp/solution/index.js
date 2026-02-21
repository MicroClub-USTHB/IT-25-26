import 'dotenv/config';
import readline from 'readline';

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Fetch weather data from OpenWeather API
 * @param {string} city - City name to search
 * @returns {Promise<Object>} Weather data
 */
async function fetchWeatherData(city) {
    if (!API_KEY) {
        throw new Error('❌ API key not found. Please check your .env file.');
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Handle API errors
        if (response.status === 401) {
            throw new Error('🔐 Invalid API key. Please check your WEATHER_API_KEY in .env file.');
        }
        
        if (response.status === 404) {
            throw new Error(`🌍 City "${city}" not found. Please check the spelling and try again.`);
        }
        
        if (!response.ok) {
            throw new Error(`⚠️ API Error: ${data.message || 'Unknown error occurred'}`);
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
 * @param {Object} data - Weather data from API
 */
function displayWeather(data) {
    const { name, sys, main, weather, wind } = data;
    
    console.log('\n' + '='.repeat(50));
    console.log(`🌦️  Weather in ${name}, ${sys.country}`);
    console.log('='.repeat(50));
    console.log(`🌡️  Temperature: ${main.temp}°C (feels like ${main.feels_like}°C)`);
    console.log(`📊 Condition: ${weather[0].main} - ${weather[0].description}`);
    console.log(`💧 Humidity: ${main.humidity}%`);
    console.log(`💨 Wind Speed: ${wind.speed} m/s`);
    console.log(`🔽 Pressure: ${main.pressure} hPa`);
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