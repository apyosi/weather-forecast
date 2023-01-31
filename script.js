// Select html elements with document.querySelector
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const searchResults = document.querySelector("#search-results");
const searchResultList = document.querySelector("#search-results-list");
const formSelect = document.querySelector(".form-select");
const historyEl = document.querySelector("#history");
const today = document.querySelector("#today");
const forecast = document.querySelector(".forecast");
const fiveDay = document.querySelector("#five-day");

//API key to use openweathermap.org free weather data
let apiKey = "6008f3fcaf990bc7c0beb645fd2a3fb3";
let urlGeocoding = `https://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=${apiKey}`;
let urlForecast5 = `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=${apiKey}`;


searchButton.addEventListener("click", fetchGeocoding);

function fetchGeocoding(event) {
  event.preventDefault();
  clearResults();
  let searchWord = searchInput.value;
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${searchWord}&limit=10&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        let name = data[i].name;
        let country = data[i].country;
        let state = data[i].state;
        let lat = data[i].lat;
        let lon = data[i].lon;

        let li = document.createElement("li");
        if (state) {
          li.innerHTML = `<li><a href="#" lat="${lat}" lon="${lon}" title="lat:${lat} lon:${lon}" >${name}, ${country}, ${state}</a></li>`;
        } else {
          li.innerHTML = `<li><a href="#"  lat="${lat}" lon="${lon} title="lat:${lat} lon:${lon}"">${name}, ${country}</a></li>`;
        }
        // searchResultEl.innerHTML +=  li;
        searchResultList.appendChild(li);
      }
      searchResults.innerHTML = `<h3>Results: ${data.length}</h3>`;
    });
}

function clearResults() {
  searchResults.innerHTML = "";
  searchResultList.innerHTML = "";
}

function storeLocation() {
  localStorage.setItem("weatherLocations", JSON.stringify(historyLocations));
}



function fetchCurrentWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderCurrentWeather(data);
    });
}

function fetchForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      renderForecast(data);
    });
}

function renderCurrentWeather(data) {
  let name = data.name;
  let date = moment(data.dt, "X").format("DD/MM/YYYY");
  let time = moment(data.dt, "X").format("HH:mm:ss");
  let {temp, feels_like, temp_min, temp_max, pressure, humidity}= data.main;
  let sunrise = moment(data.sys.sunrise, "X").format("HH:mm:ss");
  let sunset = moment(data.sys.sunset, "X").format("HH:mm:ss");
  let {main, description, icon} = data.weather[0];
  let wind = data.wind.speed;

  let html = `<h3>${name} (${date})</h3>
  <h6>Current Weather conditions updated on ${time}</h6>
  <img src="http://openweathermap.org/img/wn/${icon}@2x.png">
  <p>${main}</p>
  <p>${description}</p>
  <p>Temp: ${temp} &#8451</p>
  <p>Feels Like: ${feels_like} &#8451</p>
  <p>Max temp: ${temp_min} &#8451</p>
  <p>Min temp: ${temp_max} &#8451</p>
  <p>Wind: ${wind} meter/sec.</p>
  <p>Humidity: ${humidity} %</p>
  <p>Pressure: ${pressure} hPa</p>
  <p>Sunrise: ${sunrise}</p>
  <p>Sunset: ${sunset}</p>

  `;
  today.innerHTML = html;
}

function renderForecast(data) {
  

  let html = "";
  for (let i = 8; i < data.list.length; i = i+7) {
    let {dt} = data.list[i];
    let {temp, humidity} = data.list[i].main;
    let {speed} = data.list[i].wind;
    let {icon} = data.list[i].weather[0];
    html += `
    <div class="card text-white bg-dark" style="width: 19%">
    <div class="card-body">
    <p class="card-text">${moment(dt, "X").format("DD/MM/YYYY")}</p>
    <p class="card-text"><img src="http://openweathermap.org/img/wn/${icon}.png"></p>
    <p class="card-text">Temp: ${temp}</p>
    <p class="card-text">Wind: ${speed}</p>
    <p class="card-text">Humidity: ${humidity}</p>
    </div>
    </div>
    `
  }
  forecast.innerHTML = html;
  fiveDay.textContent = "5-Day Forecast:"
}


function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  fetchCurrentWeather(lat, lon);
}

function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.")
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.")
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.")
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.")
      break;
  }
}