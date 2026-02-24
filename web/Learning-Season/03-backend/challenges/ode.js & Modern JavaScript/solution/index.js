require('dotenv').config();
const prompt = require('prompt-sync')({ sigint: true }); // package for getting input



const API_KEY = process.env.API_KEY // api_key
let city_name; // initial declare
do {
  city_name = prompt("enter a city name to get its weather status: ");

  if (!city_name) {
    console.log("city name cannot be empty. Try again");
}}while (!city_name) // while empty


//fetching data
async function getWeather() {
    try {
        if (!API_KEY) {
            throw new Error("API-KEY is missing !!! check env file!!!!!!!")
        }
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=${"metric"}&appid=${API_KEY}`)
        if (response.status === 401 || response.status === 403){
            throw new Error("INVALID API KEY!!")
        }
        if (response.status === 504) {
            throw new Error("Server error, try again later")
        }
        if (response.status === 408) {
            throw new Error("slow or unstable client internet connection, check your internet")
        }
        
        const data = await response.json()
        console.log(data)
        if (response.status === 404) // if city name was wrong
            {
            throw new Error("Invalid city name")
        }
        if (!response.ok) {
            throw new Error(`Unexpected error: ${response.status}`)
        }
        const country = data['sys']['country']
        city_name = data.name //ktacheft bli t9der dir . fi plaset ['']
        const weather = data['weather'][0]['main']
        const temp = data['main']['temp']
        const humidity = data['main']['humidity']
        const weather_status = {
        "country" : country,
        "city" : city_name,
        "weather" : weather,
        "temp" : `${temp}°C`,
        "humidity" : `${humidity}%`
        }
        console.log(weather_status)
    }catch (error){
            console.error("Something went wrong: ", error.message)   
    }
}


getWeather() // dédicace l Anouar



