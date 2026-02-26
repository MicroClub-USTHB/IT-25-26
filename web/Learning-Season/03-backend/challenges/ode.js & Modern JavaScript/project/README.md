# Node.js Weather CLI Application

A simple command-line tool built with **Node.js** that fetches **real time weather data** from the **OpenWeather API** and displays it in your terminal.  

Perfect for learning **async/await**, **API integration**, and **error handling** in Node.js.

---

##  Features

- Fetch weather by city name
- Async/Await API calls
- Environment variables for API key security
- Error handling for:
  - Invalid city
  - Invalid API key
  - Network issues
- Clean and readable ES6+ code structure

---

##  Installation

1) Clone the repository:

```
git clone <your-repo-url>
cd weather-cli
```

2) Install dependencies:
```
npm install
```

## Setup Environment Variables

Create a .env file in the project root:

```
OPENWEATHER_API_KEY=your_real_api_key_here
```

## Usage

Run the CLI with a city name:
node index.js Algiers

### Example output:
```
City: Algiers
Temperature: 12.68°C
Description: mist
humidity: 53%
```
## Error Handling

The app gracefully handles common errors:
| Error Type      | Message Example                                  |
| --------------- | ---------------------------------------          |
| Invalid city    | city not found, check the city name and try again|
| Invalid API key | invalid API key                                  |
| Network issue   | network error, check your internet connection    |
| Missing API key | API key missing in .env file                     |

## Technologies Used

 - Node.js – Runtime environment
 - Axios – HTTP requests library
 - dotenv – Environment variable management
 - OpenWeather API – Real-time weather data

## 📁 Project Structure
```
weather-cli/
│
├── index.js          # Main CLI logic
├── package.json      # Node.js dependencies
├── .env              # API key (ignored in Git)
├── .gitignore        # Exclude node_modules and .env
└── README.md         # Project documentation
```

### Made by [Maya Otsmane]