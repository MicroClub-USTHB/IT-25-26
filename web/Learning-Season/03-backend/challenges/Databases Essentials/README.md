# 🕌 Prayer Times API – Backend Challenge

In this challenge, you will build a REST API for a Prayer Times system using Node.js.

This project will help you practice:

- Design a database
- Store prayer times
- Expose endpoints for clients (like the React app)
- Handle real backend concerns (validation, structure, logic)

---

## 🛠 Project Requirements

### 📍 Multi-City Prayer Times

Users can request prayer times for any city
Support:

- search by name
- or coordinates (lat/lng)

### 📅 Daily & Monthly Prayer Times

Get prayer times for:

- a single day
- a full month

```http

GET /api/prayer-times?city=Algiers&month=04&year=2026

```

### ⏱️ Next Prayer Endpoint

API calculates:

- current prayer
- next prayer
- remaining time

### 🧾 Admin Panel API

Admin can:

- add/edit prayer times
- manage cities

---

## 🧠 Technical Constraints

- You must use Express.js to build the API
- You must use PostgreSQL or MongoDB as the primary database
- You must use Prisma or Mongoose as the ORM
- Follow good RESTful API design
- testing (Postman)

---

## 🏁 Deliverables

Your submission must include:

- Environment variable usage
- Clean and organized README file
