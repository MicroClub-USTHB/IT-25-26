# PART 1 — Node.js: Technical Definition

## What is Node.js?

Node.js is a runtime environment that allows you to run JavaScript outside the browser, mainly for backend/server development. Instead of using JavaScript only for frontend web pages, Node.js lets you build servers, APIs, real-time apps, automation scripts, and more.

---

## What is a Runtime Environment?

A **runtime environment** is the software layer that **executes your code** and provides everything ineeds to run.

It typically includes:

- A **code interpreter or engine**
- Memory management
- Access to system resources (files, network, processes, etc.)

---

## How Node.js Works (Core Concept)

### Event-Driven Architecture

Node.js reacts to events instead of waiting for tasks to finish.

**Example:**

1. A request comes to a server
2. Node.js processes it asynchronously
3. While waiting for database or file operations, it handles other requests

This makes Node.js fast and scalable.

### Non-Blocking / Asynchronous Execution

Instead of stopping execution until a task finishes, Node.js continues running other tasks.

**Blocking Example (Traditional):**

```
Read file → Wait → Continue program
```

**Non-Blocking Example (Node.js):**

```
Start reading file → Continue program → File finishes later
```

---

## Node.js Use Cases

Node.js is commonly used for:

- REST APIs
- Microservices
- Real-time systems
- Streaming servers
- Authentication services
- API gateways

---

## Installing and Running Node.js

After installation, you can check versions:

```bash
node -v
npm -v
```

- `node` → runs JavaScript files
- `npm` → package manager for installing libraries

---

## Running Your First Node.js Script

Create a file: `app.js`

```javascript
console.log("Hello Node.js");
```

Run:

```bash
node app.js
```

---

## Modules (Very Important Concept)

Node.js uses modules to organize code.

### Built-in Modules

Examples:

- `fs` → file system
- `http` → create servers
- `path` → manage file paths

**Example using fs module:**

```javascript
const fs = require("fs");

fs.writeFileSync("test.txt", "Hello World");

//reading message.txt

const fs = require("fs");

fs.readFile("message.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);

    return;
  }

  console.log(data);
});
```

### Custom Modules

**math.js:**

```javascript
function add(a, b) {
  return a + b;
}
export default add;
```

**app.js:**

```javascript
import add from "./math.js";
console.log(add(2, 3));
```

---

## npm (Node Package Manager)

npm allows installing external libraries.

Initialize project:

```bash
npm init
```

Install package:

```bash
npm install express
```

Dependencies are stored in: `package.json`

---

## Creating a Basic Server

Example HTTP server:

```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.statusCode = 200;

  res.end("Hello World\n");
});
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

Open browser:

```
http://localhost:3000
```

---

# Asynchronous Programming Concepts

## 1. Callbacks

### Definition

A callback is simply a function passed as an argument to another function, which is executed later when a task finishes.

Node.js uses callbacks heavily because many operations (file reading, database queries, network requests) take time.

### Why Callbacks Exist

Node.js does not wait for long operations. Instead, it says:

_"Start this task and call this function when you're done."_

### Basic Example

```javascript
function fetchData(callback) {
  setTimeout(() => {
    console.log("Data received");
    callback();
  }, 2000);
}

function processData() {
  console.log("Processing data...");
}

fetchData(processData);
```

**Execution:**

```

```

### Real Node.js Example (File Reading)

```javascript
const fs = require("fs");

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(data);
});
```

Here:

- `readFile` starts reading
- When finished → callback executes

### Callback Problem: Callback Hell

When many async tasks depend on each other:

```javascript
doTask1(() => {
  doTask2(() => {
    doTask3(() => {
      doTask4();
    });
  });
});
```

**Problems:**

- Hard to read
- Hard to debug
- Hard to maintain

This is why Promises were introduced.

---

## 2. Promises

### Definition

A Promise represents a value that will exist now, later, or never.

It is an object that tracks the state of an async operation.

### Promise States

- **Pending** → still running
- **Fulfilled** → success
- **Rejected** → error

### Creating a Promise

```javascript
const myPromise = new Promise((resolve, reject) => {
  let success = true;

  if (success) {
    resolve("Task completed");
  } else {
    reject("Task failed");
  }
});
```

### Consuming a Promise

```javascript
myPromise
  .then((result) => console.log(result))
  .catch((error) => console.log(error));
```

### Real Example

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data received");
    }, 2000);
  });
}

fetchData().then((data) => console.log(data));
```

### Promise Chaining

Allows sequential async tasks:

```javascript
fetchUser()
  .then((user) => fetchOrders(user))
  .then((orders) => console.log(orders))
  .catch((err) => console.log(err));
```

This already solves callback hell significantly.

---

## 3. Async / Await

### Definition

Async/await is syntactic sugar built on top of Promises. It makes asynchronous code look synchronous.

### Async Function

Declaring a function as `async` automatically makes it return a Promise.

```javascript
async function hello() {
  return "Hello";
}
```

### Await Keyword

`await` pauses execution until a Promise resolves.

### Example

**Using Promises:**

```javascript
fetchData().then((data) => console.log(data));
```

**Using Async/Await:**

```javascript
async function getData() {
  const data = await fetchData();
  console.log(data);
}

getData();
```

### Error Handling

```javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
```

### Why Async/Await Is Preferred

- Cleaner syntax
- Easier debugging
- More readable logic
- Looks like normal sequential code

---

## 4. Event Loop (Most Important Node.js Mechanism)

The Event Loop is what allows Node.js to be non-blocking.

### Core Idea

Node.js runs on one main thread.

Instead of creating new threads for each task, it uses:

- Event queue
- Callback queue
- Event loop scheduler

### How It Works Step-by-Step

**Step 1 — Code runs in Call Stack**

- Synchronous code executes immediately

**Step 2 — Async tasks go to Background**

Examples:

- File reading
- Database queries
- Timers
- Network calls

**Step 3 — Completed tasks go to Callback Queue**

**Step 4 — Event Loop pushes them back to Call Stack when free**

### Example

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Timeout finished");
}, 2000);

console.log("End");
```

### Output

```
Start
End
Timeout finished
```

**Why?**

Because:

1. `Start` executes
2. `setTimeout` registers async timer
3. `End` executes immediately
4. After 2 seconds → callback enters queue
5. Event loop executes it

---

# Package Management

## 1. npm (Node Package Manager)

### What npm Is

npm is the dependency manager for Node.js.

It allows you to:

- Install external libraries
- Manage project dependencies
- Run scripts
- Handle version control of packages
- Share and reuse code modules

Think of npm as:

> The ecosystem that provides tools so you don't have to write everything from scratch.

### Why npm Exists (In Async Context)

Node.js core is minimal. Most advanced features like:

- HTTP frameworks
- Database connectors
- Authentication tools
- Utility libraries

are installed via npm.

**Example:** Instead of writing your own HTTP routing logic, you install a framework.

### Basic npm Commands

**Initialize Project:**

```bash
npm init
```

Creates the `package.json` file.

**Install Dependency:**

```bash
npm install express
```

Installs library locally.

**Install Dev Dependency:**

```bash
npm install nodemon --save-dev
```

Used only during development.

**Install Global Package:**

```bash
npm install -g nodemon
```

Accessible across system.

---

## 2. package.json (Project Manifest File)

### What It Is

`package.json` is the central configuration file of a Node.js project.

It describes:

- Project metadata
- Dependencies
- Scripts
- Project version
- Entry point

### Example package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### Important Sections

#### 1️⃣ Metadata

- `name`
- `version`
- `description`
- `author`
- `license`

Used for project identification.

#### 2️⃣ main

```json
"main": "app.js"
```

Defines application entry point.

#### 3️⃣ Dependencies

`"dependencies"` — Libraries required in production.

Example:

- Express
- Database drivers
- Authentication libraries

#### 4️⃣ devDependencies

Used only during development:

- Testing tools
- Hot reload tools
- Linters

#### 5️⃣ Scripts (Extremely Important)

Scripts allow running commands easily.

Example:

```bash
npm run start
npm run dev
npm test
```

They are shortcuts for automation.

### Why package.json Matters for Async Node Apps

It guarantees:

- Reproducible environments
- Correct dependency versions
- Standardized project setup
- Automated build & run processes

### node_modules Folder

When installing packages:

```
node_modules/
```

Contains:

- Installed libraries
- Their dependencies

Usually very large and never committed to git.

### package-lock.json

Automatically generated file.

**Purpose:**

- Locks exact dependency versions
- Ensures identical installations across machines

---

## 3. Environment Variables (.env Files)

Now this is where security + configuration management enters.

### What .env Files Are

`.env` files store environment variables.

They hold sensitive or environment-specific data like:

- Database passwords
- API keys
- JWT secrets
- Server ports
- Cloud credentials

### Why They Are Needed

You should **NEVER** hardcode secrets like:

```javascript
const password = "mypassword123";
```

**Because:**

- Security risk
- Hard to change across environments
- Cannot safely share code

### Example .env File

```env
PORT=3000
DB_URI=mongodb://localhost:27017/app
JWT_SECRET=superSecretKey
```

### Using .env In Node.js

First install:

```bash
npm install dotenv
```

**Load Environment Variables:**

```javascript
require("dotenv").config();
```

**Access Variables:**

```javascript
const port = process.env.PORT;
```

---

## 4. Why .env Is Crucial in Real Projects

Node apps usually run in multiple environments:

| Environment | Purpose         |
| ----------- | --------------- |
| Development | Local machine   |
| Testing     | QA validation   |
| Production  | Live deployment |

Each environment has different:

- Credentials
- Ports
- Service URLs

`.env` allows switching without changing code.

---

## 5. Security Best Practice

Always add `.env` to:

```
.gitignore
```

**Because secrets must never be pushed to version control.**
