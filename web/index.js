import dotenv from 'dotenv'
dotenv.config();

const api = process.env.OPENWEATHER_API_KEY;
const urlBas = process.env.URL_BS;

function validateApiKey(){
    if(!api){
        console.error('API key is invalid.');
        process.exit(1);
    }
}

function getCity(){
    const city = process.argv[2];
    if(!city){
        console.error("City is invalid.");
        console.error('Please provide a city as a command-line argument.');
        process.exit(1)
    }
    return city;
} 

async function fetchWeather(city){
    const res = await fetch(`${urlBas}?q=${city}&appid=${api}&units=metric`);
    const data = await res.json();
    if(!res.ok){
        if(res.status === 401){
            console.error('API key is not valid.');
        }else if(res.status === 404){
            console.error(`city ${city} not found.`);
        }else{
            console.error(`Error: ${data.message || 'Unknown error'}`)
        }
        process.exit(1);
    }
    return data;
}
function display(data){
    const city      = data.name;
    const country   = data.sys.country;
    const temp      = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const weather   = data.weather[0].description
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
    const humidity  = data.main.humidity;
    const wind      = data.wind.speed;
    console.log(`Weather in ${city}, ${country}`);
    console.log(`Temperature : ${temp}°C (Feels like ${feelsLike}°C)`);
    console.log(` Weather  : ${weather}`);
    console.log(`Humidity : ${humidity}%`);
    console.log(`│ Wind Speed : ${wind} m/s`);
}

async function main(){
    validateApiKey();
    const city = getCity();
    try{
        console.log(` Fetching weather for ${city}`);
        const data = await fetchWeather(city);
        display(data);
    }catch(e){
    if (e.code === "ENOTFOUND") {
        console.error("Network error: Check your internet connection.");
    } else {
        console.error("Something went wrong:", e.message);
    }
    process.exit(1);
    }
}
main();

