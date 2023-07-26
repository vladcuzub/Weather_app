// "use strict"

const cityInput = document.getElementById('cityInput');
const city = document.querySelector('.city');
const description = document.querySelector('.description');
const temp = document.querySelector('.temp');
const humidity = document.querySelector('.humidity');
const wind = document.querySelector('.wind');
const key = "f99282ff1eccef0a2411844b758aaf4b";
let cityFullName;


const getWeather = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") {
    alert("Please enter a valid city name.");
    return; 
  }


  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=5&appid=${key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(" Please try again.");
      }
      return response.json();
    })
    .then(data => {
      if (data.length === 0) {
        throw new Error("City not found. Please enter a valid city name.");
      }

      const cityData = data[0];
      const lat = cityData.lat;
      const lon = cityData.lon;
      cityFullName = cityData.name; 
      return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
    })

    .then(response => {
      if (!response.ok) {
        throw new Error(" Please try again.");
      }
      return response.json();
    })
    .then(data => {
      console.log(data)
      city.innerHTML = cityFullName;
      temp.innerHTML = ` ${data.main.temp} &#8451;`;
      description.innerHTML = `Currently is : ${data.weather[0].description}`
      humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
      wind.innerHTML = `Wind: ${data.wind.speed} m/s`;
    })
    .catch(error => {
      console.error("Fetch error:", error.message);
    });
};

const  convertKelvinToCelsius = (kelvin) => {
  return (kelvin - 273.15).toFixed(1);
}
