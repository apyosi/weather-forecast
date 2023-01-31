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
    `https://api.openweathermap.org/geo/1.0/direct?q=${searchWord}&limit=5&appid=${apiKey}`
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