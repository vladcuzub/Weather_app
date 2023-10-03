
"use strict";
import { apiKey } from "../js/api.js";

const button = document.querySelector("button");
const cityInput = document.getElementById("cityInput");
const city = document.querySelector(".city");
const description = document.querySelector(".description");
const icon = document.querySelector('.icon');
const temp = document.querySelector(".temp");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const forecastList = document.querySelector(".forecast");
const latMyCity = 51.2254018;
const lonMyCity = 6.7763137;
let cityFullName;

// Function to convert 
const convertUnixToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {weekday: "short",month: "short",day: "numeric"
    });
};

const getCurrentWeather = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("An error occurred while fetching the weather data.");
            }
            return response.json();
        })
        .then((data) => {
            city.innerHTML = data.name;
            temp.innerHTML = ` ${convertKelvinToCelsius(data.main.temp)} &#8451;`;
            description.innerHTML = `Currently is: ${data.weather[0].description}`;
            humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
            wind.innerHTML = `Wind: ${data.wind.speed} m/s`;
        })
        .catch((error) => console.error("Fetch error:", error.message));
};


// 5days weather
const getForecast = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("An error occurred while fetching the forecast data.");
            }
            return response.json();
        })
        .then((data) => {
            forecastList.innerHTML = "";
            for (let i = 0; i < data.list.length; i += 8) {
                const forecastItem = data.list[i];
                const date = convertUnixToDate(forecastItem.dt);
                const temperature = convertKelvinToCelsius(forecastItem.main.temp);
                const description = forecastItem.weather[0].description;
                const iconImg = forecastItem.weather[0].icon;
                const icon = document.querySelector('.icon');
                icon.src = `https://openweathermap.org/img/wn/${iconImg}@2x.png`;
                const listItem = document.createElement("div");
                // const imgElement = document.createElement('img');
                
                // imgElement.src = icon.src
                listItem.innerHTML = `<span>${date}</span><br> <img src=${icon.src} <br> ${description}, <br>${temperature} &#8451;`;
                forecastList.appendChild(listItem);
            }
        })
        .catch((error) => console.error("Fetch error:", error.message));
};

// get input city
const handleGetWeather = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") {
        return window.alert("Please add a City");
    }
    fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
            cityName
        )}&limit=5&appid=${apiKey}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error("Please try again.");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                throw new Error("City not found. Please enter a valid city name.");
            }
            const cityData = data[0];
            const lat = cityData.lat;
            const lon = cityData.lon;
            cityFullName = cityData.name;
            getCurrentWeather(lat, lon);
            getForecast(lat, lon);
        })
        .catch((error) => {
            console.error("Fetch error:", error.message);
        });
    cityInput.value = "";
};

// Convert celsius from kelvin
const convertKelvinToCelsius = (kelvin) => {
    return (kelvin - 273.15).toFixed(1);
};

getCurrentWeather(latMyCity, lonMyCity);
getForecast(latMyCity, lonMyCity);
button.addEventListener("click", handleGetWeather);
