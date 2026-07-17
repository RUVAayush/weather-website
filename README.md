# weather-website
https://medium.com/@rkb.aayush17112501/building-a-weather-app-using-html-css-javascript-and-a-live-weather-api-3bdbf6b1eaab

Building a Weather App Using HTML, CSS, JavaScript and a Live Weather API

Introduction

Weather checking is something almost everyone does daily, but most people just open an app on their phone without thinking about how it actually works behind the scenes. As part of my college project, I decided to build my own Weather App from scratch using only front-end technologies. This article explains what the project is, what technologies were used, and how each part of the app works. The idea is that anyone reading this, even without prior knowledge of the project, should be able to understand how it was built and how it functions.

What This Project Does

The Weather App allows a user to:

- Search weather of any city in the world by typing its name
- Get weather of the current location using the device GPS
- See live temperature, minimum and maximum temperature, and a short weather description
- View extra details like sunrise time, sunset time, feels-like temperature, humidity, wind speed, air pressure, visibility, and country code
- See an hourly forecast for the next 24 hours
- See a 5-day forecast
- View recent search history so the user does not have to type the same city again
- Experience a background that changes color depending on the weather condition and whether it is day or night at that location

This makes the app more than just a temperature display. It behaves like a small, functional weather dashboard.

Tech Stack Used

The project is built using only front-end technologies, which makes it beginner friendly and easy to host anywhere.

- HTML5 — used for the structure of the webpage
- CSS3 — used for styling, layout, and responsive design
- Bootstrap 5 — used for basic layout support
- JavaScript (Vanilla JS) — used for all logic, API calls, and DOM manipulation
- OpenWeatherMap API — used to fetch real weather data
- LocalStorage (Browser Storage) — used to save recent search history

No backend or database is used in this project. Everything runs directly in the browser, which is why it is called a front-end only project.

Project Structure

The project has three main files:

- index.html — contains the structure of the webpage, such as input box, buttons, and sections for weather details
- style.css — handles the visual design, including colors, spacing, card layout, and responsiveness
- script.js — contains all the logic of the app, including API calls and updating the webpage dynamically

Keeping HTML, CSS, and JavaScript in separate files is a good coding practice because it keeps the structure, design, and logic clearly separated.

How the App Works (Step by Step)

Become a Medium member
1. Fetching Weather Data
When a user searches for a city or allows location access, the app sends a request to the OpenWeatherMap API. Two API calls are made:

- One for current weather data (temperature, humidity, wind, etc.)
- One for 5-day forecast data, which actually returns data in 3-hour intervals

The app uses the fetch() function along with async and await to get this data without freezing the webpage.

2. Displaying Current Weather
Once the data is received, a function called updateUI() takes over. It updates the city name, temperature, weather icon, sunrise and sunset time, humidity, wind speed, pressure, and visibility directly on the webpage. It also calculates the local time of the searched city using the timezone value returned by the API, so the correct local time is shown, not the user’s own device time.

3. Hourly Forecast
The forecast API returns data in 3-hour steps. The app picks the first 8 entries, which cover the next 24 hours, and displays them as small cards showing time, weather icon, and temperature.

4. 5-Day Forecast
To show only one entry per day, the app filters the forecast list and picks the reading that is closest to 12:00 PM (noon) for each day. This gives a clean 5-day summary instead of showing every 3-hour update.

5. Search History
Every time a search is successful, the city name is saved in the browser’s LocalStorage. The app keeps only the last 5 searches. This way, if the user closes the browser and comes back later, their recent search history is still available.

6. Location Based Search
When the location button is clicked, the app uses the browser’s Geolocation API to get the user’s latitude and longitude. This location is then used to fetch weather data instead of typing a city name manually.

7. Dynamic Background
This is one of the more interesting parts of the project. Based on the weather condition (clear, cloudy, rainy, snow) and whether it is currently day or night in that city, the app changes the background gradient of the entire page. For example, a sunny afternoon shows a bright orange-yellow background, while clear weather at night shows a dark blue background. This is done by adding different CSS classes to the page using JavaScript depending on the API response.

8. Error Handling
If a wrong or non-existing city name is entered, the app catches the error and shows a simple message saying the city was not found, instead of the page breaking or showing a blank screen.

Responsive Design

The layout is built using CSS clamp() function and media queries so that the app looks good on both mobile phones and larger screens. On smaller screens, the detail cards automatically rearrange into a single column instead of two columns, making it easier to read on mobile devices.

Key Concepts Used in This Project

- DOM Manipulation — updating webpage content dynamically using JavaScript
- Asynchronous JavaScript — using async, await, and fetch() to handle API calls
- REST API Integration — sending requests and handling JSON responses from an external API
- Browser Storage — using LocalStorage to save data without a database
- Geolocation API — accessing device location with user permission
- Responsive Web Design — making the app usable on all screen sizes
- Conditional UI Rendering — changing the interface based on data received, such as weather type and time of day

Conclusion

This project is a good example of how much can be achieved using only HTML, CSS, and JavaScript, without needing any backend setup. It covers real-world skills like working with external APIs, handling asynchronous data, managing browser storage, and designing a responsive interface. For any beginner in web development, a project like this is useful because it touches multiple important concepts at once, rather than teaching them in isolation.

This Weather App is not just a college assignment; it works as a genuine, usable mini weather tool that fetches real, live data every time it is used.
