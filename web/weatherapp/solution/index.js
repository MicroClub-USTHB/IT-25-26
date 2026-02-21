import express from 'express';

const app = express();
app.use(express.json());

const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }   
};

const apiKey = process.env.WEATHER_API_KEY;
const url = `https://api.openweathermap.org/data/3.0/onecall?lat=5&lon=10&exclude=current&appid=${apiKey}`;

let data = fetchData(url);
console.log(data);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});