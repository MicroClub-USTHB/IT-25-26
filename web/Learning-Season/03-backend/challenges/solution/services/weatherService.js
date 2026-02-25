// allowed to make http requests, export the async function. handles all api specific logic.
'use strict'
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY= process.env.API_KEY;
const BASE_URL= process.env.BASE_URL||'https://api.openweathermap.org/data/2.5';


if (!API_KEY) {
    console.error('FATAL: OPENWEATHER_API_KEY is not set in .env');
    process.exit(1);
}

//helper
function buildUrl(city){
    const params= new URLSearchParams({
        q: city,
        appid: API_KEY,
        units: 'metric',
    });

    return `${BASE_URL}/weather?${params}`;
        
}

function normalizeWeatherData(raw){
    return{
        city: raw.name,
        country: raw.sys.country,
        temperature: Math.round(raw.main.temp),
        humidity: raw.main.humidity,
        windSpeed: raw.wind.speed,
        description: raw.weather[0].description,
        windSpeed: raw.wind.speed,
    }
}

export async function fetchWeather(city) {
    try{
        const url= buildUrl(city);
        //make request
        const response= await fetch(url);

        //check http status
        if(!response.ok){
            const errBody= await response.json().catch(() => ({}));
            const message= errBody.message||response.statusText;

            throw new Error(`[${response.status}] ${message}`);
        }

        //parse json
        const raw= await response.json();
        return normalizeWeatherData(raw);
    } catch(err){
        //re throw with context so the caller knows what failed
        throw new Error(`fetchWeather failed: ${err.message}`);
    }
}

