require('dotenv').config();
//CONSTANTS
const API_KEY = process.env.API_KEY
const LAT = -76.67954
const LON = -42.80039

async function getWeather() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}`)
    if (!response.ok){
        throw new Error("a problem has occured")
    }
    const data = await response.json()
    let weather = data['weather'][0]['main']
    let temp = data['main']['temp']
    let humidity = data['main']['humidity']
    const weather_status = {
    "weather" : weather,
    "temp" : temp,
    "humidity" : humidity
    }
    console.log(weather_status)
}

getWeather()



