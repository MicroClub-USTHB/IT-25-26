const express = require("express");
const router = express.Router();
const axios = require("axios");
require('dotenv').config();

const mySecretKey = process.env.API;



// {
//   "city": "alger"  sample
// }

router.get("/weather", async (req, res) => {
  let apiKey =  mySecretKey;
  let city = req.body.city;

  try {
    const weatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
   const display= res.json({
      city: weatherData.data.name,
      temperature: weatherData.data.main.temp,
      description: weatherData.data.weather[0].description,
      humidity: weatherData.data.main.humidity,
    });

    console.log({
      city: weatherData.data.name,
      temperature: weatherData.data.main.temp,
      description: weatherData.data.weather[0].description,
      humidity: weatherData.data.main.humidity,
    })
  } catch (error){
    res.send(res.message);
  }
});
module.exports = router;