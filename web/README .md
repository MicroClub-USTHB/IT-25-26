# 🌤️ e · MDCopy Weather CLI App

A **Node.js** command-line app that fetches real-time weather data for any city using the **OpenWeatherMap API**.

---

## 📁 Project Structure
```
project/
├── index.js       # Main application logic
├── .env           # Environment variables (API key) — never share this!
├── .gitignore     # Ignores .env and node_modules
├── package.json   # Project metadata & dependencies
└── README.md      # You are here
```

---

## ⚙️ Setup

1. **Install dependencies**
```bash
npm install
```

2. **Get a free API key**  
Sign up at [OpenWeatherMap](https://openweathermap.org) → My Account → API Keys

3. **Create your `.env` file**
```env
dotenvOPENWEATHER_API_KEY=your_api_key_here
```

⚠️ **Never share your API key or push `.env` to GitHub!**

---

## 🚀 Usage
```bash
node index.js <city>
```

### Examples
```bash
node index.js London
node index.js Riyadh
node index.js "New York"
```

### Example Output
```
🔍 Fetching weather for "London"...

 🌍 Weather in London, GB  
 =============================
 🌡️  Temperature : 18°C 
      Feels like : 16°C  
 🌤️  Weather     : Clear Sky 
 💧  Humidity    : 60%        
 💨  Wind Speed  : 3.5 m/s    

```

---

## 🧠 How It Works

The app is split into **5 clean functions**:

| Function             | Purpose                                           |
- Uses **ES Modules** — requires `"type": "module"` in `package.json`