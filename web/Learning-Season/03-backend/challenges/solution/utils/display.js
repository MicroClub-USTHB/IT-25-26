// knows how to format the data and display it in the console. no api specific logic should be here
'use strict'
export function displayWeather(data){
    const divider= '-'.repeat(20);
    
    console.log(divider);
    console.log(`City: ${data.city}, ${data.country}`);
    console.log(`Temperature: ${data.temperature}°C`);
    console.log(`Humidity: ${data.humidity}%`);
    console.log(`Wind Speed: ${data.windSpeed} m/s`);
    console.log(`Description: ${data.description}`);
    console.log(divider);
}