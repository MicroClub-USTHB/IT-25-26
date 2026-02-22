require('dotenv').config();
//CONSTANTS
const API_KEY = process.env.API_KEY
let city_name = "london"
async function getWeather() {
    const geocoding_response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&appid=${API_KEY}`)
    if (!geocoding_response.ok) {
        throw new Error("a problem has occured")
    }
    const geocoding_data = await geocoding_response.json() 
    city_name = geocoding_data['0']['name'] //updated city_name variable
    const country = geocoding_data['0']['state']
    let lat = geocoding_data['0']['lat']
    let lon = geocoding_data['0']['lon']
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    if (!response.ok){
        throw new Error("a problem has occured")
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
}

getWeather()



