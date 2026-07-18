// Weather api key from openweathermaps.com
const apiKey = "6555cdab12f038448e8778645559fb4d";
// =========================================

// --- Selectors ---
console.log("Script Loaded:", new Date());
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const hourlyForecast = document.getElementById("hourlyForecast");
const dailyForecast = document.getElementById("dailyForecast");
const historyList = document.getElementById("historyList");

// --- UI Elements ---
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const country = document.getElementById("country");
const weatherIcon = document.getElementById("weatherIcon");
const minTemp = document.getElementById("minTemp");
const maxTemp = document.getElementById("maxTemp");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const dateDisplay = document.getElementById("date");
const localTime = document.getElementById("localTime");

// --- Helper: Update Main DOM ---
function updateUI(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    minTemp.textContent = `Min : ${Math.round(data.main.temp_min)}°C`;
    maxTemp.textContent = `Max : ${Math.round(data.main.temp_max)}°C`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    visibility.textContent = `${data.visibility / 1000} km`;
    country.textContent = data.sys.country;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Times
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    sunrise.textContent = sunriseTime.toLocaleTimeString();
    sunset.textContent = sunsetTime.toLocaleTimeString();
    dateDisplay.textContent = new Date().toDateString();

    const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const cityTime = new Date(utc + (data.timezone * 1000));
    localTime.textContent = cityTime.toLocaleTimeString();

    // Body Class
    const weather = data.weather[0].main.toLowerCase();
    const hour = cityTime.getUTCHours();
    document.body.className = "";

    if (hour >= 6 && hour < 18) {
        if (weather.includes("clear")) document.body.classList.add("sunny");
        else if (weather.includes("cloud")) document.body.classList.add("cloudy");
        else if (weather.includes("rain")) document.body.classList.add("rainy");
        else if (weather.includes("snow")) document.body.classList.add("snow");
    } else {
        document.body.classList.add("clear-night");
    }
}

// --- Main Weather API Function ---
async function getWeather(url) {
    loading.style.display = "block";
    errorMessage.textContent = "";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        
        updateUI(data);
        addHistory(data.name);
    } catch (error) {
        errorMessage.textContent = "❌ City not found.";
    } finally {
        loading.style.display = "none";
    }
}

// --- Forecast API Function ---
async function getForecast(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Forecast data not found");
        const data = await response.json();
        
        displayHourly(data.list);
        displayDaily(data.list);
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// --- Display Next 24 Hours (8 intervals of 3 hours) ---
function displayHourly(list) {
    hourlyForecast.innerHTML = "";
    
    // Loop through the first 8 items (3 hours * 8 = 24 hours)
    for (let i = 0; i < 8; i++) {
        const item = list[i];
        const card = document.createElement("div");
        card.className = "hour-card";
        const time = new Date(item.dt * 1000);
        
        card.innerHTML = `
            <p>${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
            <h4>${Math.round(item.main.temp)}°C</h4>
        `;
        
        hourlyForecast.appendChild(card);
    }
}

// --- Display Next 5 Days ---
function displayDaily(list) {
    dailyForecast.innerHTML = "";
    
    // Filter to get one forecast reading per day (e.g., at noon)
    const noonForecasts = list.filter(item => {
        return item.dt_txt.includes("12:00:00");
    });
    
    noonForecasts.forEach(item => {
        const day = new Date(item.dt * 1000);
        const card = document.createElement("div");
        card.className = "day-card";
        
        card.innerHTML = `
            <h5>${day.toLocaleDateString(undefined, { weekday: 'short' })}</h5>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather icon">
            <h3>${Math.round(item.main.temp)}°C</h3>
            <p>${item.weather[0].main}</p>
        `;
        
        dailyForecast.appendChild(card);
    });
}

// --- History Logic ---
function addHistory(city) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = history.filter(c => c !== city);
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    historyList.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("history")) || [];
    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.onclick = () => {
            cityInput.value = city;
            searchByCity(city);
        };
        historyList.appendChild(li);
    });
}

// --- Search Wrappers (Triggers both Current and Forecast) ---
function searchByCity(city) {
    getWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    getForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
}

function searchByLocation(lat, lon) {
    getWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    getForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
}

// --- Event Listeners ---
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) searchByCity(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        searchByLocation(latitude, longitude);
    });
});

// --- Initialize App ---
searchByCity("Delhi");
displayHistory();
