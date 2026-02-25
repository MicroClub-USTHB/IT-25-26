# 🌦 Backend Challenge #1 – Weather API CLI App

In this challenge, you will build a simple Node.js application that fetches weather data from a public API and displays the result in the console.

This project will help you practice:

- Node.js fundamentals
- Working with external APIs
- Async/Await & Promises
- Error handling
- Environment variables
- ES6+ features

## 🎯 Learning Objectives

By completing this challenge, you should be able to:

- Initialize a Node.js project using npm
- Install and use external packages
- Work with async/await
- Handle API errors properly
- Use environment variables securely
- Structure a small backend application correctly

---

## 🛠 Project Requirements

### 1️⃣ Project Setup

You must:

- Initialize project using:

```bash
npm init -y
```

- Create:

```bash
project/
├── index.js
├── .env
├── package.json
```

### 2️⃣ Weather API Integration

You must:

- Use a public weather API (OpenWeather or similar)
- Store your API key inside a .env file
- Fetch weather data for a city
- Display the result in the console

Example output:

```bash
City: London
Temperature: 18°C
Weather: Clear Sky
Humidity: 60%
```

### 3️⃣ Async/Await & Error Handling

You must:

- Use async/await
- Wrap API call inside try/catch
- Handle:
  1. Invalid city name
  2. Network errors
  3. Invalid API key

Example:

```js
try {
  // fetch weather
} catch (error) {
  console.error("Something went wrong:", error.message);
}
```

---

## 🧠 Technical Constraints

- Do NOT use callbacks
- Use async/await only
- Do NOT ignore error handling
- Keep code clean and readable

---

## 🏁 Deliverables

Your submission must include:

- Working API integration
- Environment variable usage
- Clean and organized README file
