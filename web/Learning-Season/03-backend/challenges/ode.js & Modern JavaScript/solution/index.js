require('dotenv').config();
const prompt = require('prompt-sync')({ sigint: true }); // package for getting input



const API_KEY = process.env.API_KEY // api_key
let city_name;
do {
  city_name = prompt("enter a city name to get its weather status: ");

  if (!city_name) {
    console.log("city name cannot be empty. Try again");
  } else if (/\d/.test(city_name)) // wch had syntax asahbi, hbit nchecki berk bli not a number
  {
    console.log("city name cannot contain numbers. Try again");

  }
}while (!city_name || /\d/.test(city_name)); // while empty or includes number


//fetching data
async function getWeather() {
    try {
        if (!API_KEY) {
            throw new Error("API-KEY is missing !!! check env file!!!!!!!")
        }
        const geocoding_response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&appid=${API_KEY}`)
        
        if (geocoding_response.status === 401 || geocoding_response.status === 403){
            throw new Error("INVALID API KEY!!")
        }        
        if (geocoding_response.status === 504) {
            throw new Error("Server error, try again later")
        }
        if (geocoding_response.status === 408) {
            throw new Error("slow or unstable client internet connection, check your internet")
        }
        const geocoding_data = await geocoding_response.json() 
        if (geocoding_data.length === 0) // if city name was wrong
            {
            throw new Error("Invalid city name")
        }
        if (!geocoding_response.ok) {
            throw new Error(`Unexpected error: ${geocoding_response.status}`)
        }
        city_name = geocoding_data['0']['name'] //updated city_name variable
        const country = geocoding_data['0']['country']
        let lat = geocoding_data['0']['lat']
        let lon = geocoding_data['0']['lon']
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        if (response.status === 504) {
            throw new Error("Server error, try again later")
        }
        if (response.status === 408) {
            throw new Error("slow or unstable client internet connection, check your internet")
        }
        if (!response.ok) {
            throw new Error(`Unexpected error: ${response.status}`)
        }
        const data = await response.json()
        const weather = data['weather'][0]['main']
        const temp = data['main']['temp']
        const humidity = data['main']['humidity']
        const weather_status = {
        "Country" : country,
        "city" : city_name,
        "weather" : weather,
        "temp" : temp,
        "humidity" : humidity
        }
        console.log(weather_status)
    }catch (error){
            console.error("Something went wrong: ", error.message)
        
    }
}

getWeather()



