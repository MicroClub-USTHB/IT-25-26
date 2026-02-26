//CLI (for testing / running manually)


//Sends a request to a weather API
//Gets data
//Returns useful info

//loading environment variables : 1)Reads .env file, 2)Loads API key into process.env
require("dotenv").config();
//axios is a library to send http requests 
const axios = require("axios");
//creating the tool function 
async function weatherTool(city) {
     try {
    //async because API calls take time (internet), async allows await.
    const key = process.env.OPENWEATHER_API_KEY; //it reads the api key from .env
    if (!key) {
      throw new Error("API key is missing in .env file");
     } 
    //creating the api url
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    //n3ayto lel api 
    const res = await axios.get(url); //This sends an HTTP GET request. equivalent to opening the url in a browser
    
    return { //extracting useful data
      city: res.data.name,
     temp: res.data.main.temp,
     description: res.data.weather[0].description,
     humidity: res.data.main.humidity
    };
 } catch (error) {
    //case if api responded with an error
     if (error.response) {
      if (error.response.status === 404) { //city not found
        console.log("city not found, check the city name and try again");
      } else if (error.response.status === 401) { //invalid api key 
        console.log("invalid API key");
      } else { //other problems
        console.log("API error:", error.response.data.message);
      }
    } else if (error.request) {
      console.log("network error, check your internet connection");
    } else {
      console.log("ERROR", error.message);
    }

    return null;
  }
}

//testing 
(async () => {
const city = process.argv[2] || "Algiers";
const data = await weatherTool(city);
 if (data) {
  console.log("City:", data.city);
  console.log("Temperature:", data.temp + "°C");
  console.log("Description:", data.description);
  console.log("humidity:", data.humidity + "%");
  }
})();

//kmlna the weather CLI core
//3yit :) 