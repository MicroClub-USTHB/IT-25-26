//Reads cli args, calls the service, passes the result to display. 
import dotenv from 'dotenv';
dotenv.config();
import readline from 'readline';
import {fetchWeather} from './services/weatherService.js';
import {displayWeather} from './utils/display.js';


async function askCity(){
    const rl=readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve)=>{
        rl.question('Enter city name: ',(city)=>{
            rl.close();
            resolve(city.trim());
        });
    })
}
async function main() {
    const city= process.argv[2]|| (await askCity());//argv[0]=node, argv[1]=script, argv[2]=first
    
    if(!city){
        console.error('Error: City name cant be empty');
        process.exit(1);
    }
    console.log(`Fetching weather data for ${city}...`);
    try{
        const weather= await fetchWeather(city);
        displayWeather(weather);
    } catch(err){
        console.error('Error:',err.message);
        process.exit(1);
    }
}

main();