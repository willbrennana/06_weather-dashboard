// GLOBAL VARIABLES
let btnSearch = document.querySelector("#btn-search");
let inputSearch = document.querySelector("#input-search");
let divCurrent = document.querySelector("#div-current");
let divCity = document.querySelector("#div-city");

let currentWeatherUrl = [];
let fiveDayUrl = [];

let logSearch = document.querySelector("#log-search");
let historySearch = document.querySelector("#history-search");
let h1Forecast = document.querySelector("#h1-forecast");

let arrayCities = JSON.parse(localStorage.getItem("Cities")) || [];

// FUNCTIONS
function init() {
  let count = 0;
  arrayCities.forEach((object) => {
    if (count < 10) {
      let pastCity = document.createElement("div");
      if (object.city.split(" ").length > 1) {
        let newString = "";
        for (let i = 0; i < object.city.split(" ").length; i++) {
          newString +=
            object.city.split(" ")[i][0].toUpperCase() +
            object.city.split(" ")[i].toLowerCase().slice(1);
          newString += " ";
        }
        pastCity.innerHTML = newString.trim();
      } else {
        pastCity.innerHTML =
          object.city[0].toUpperCase() + object.city.toLowerCase().slice(1);
      }

      historySearch.append(pastCity);
      count++;
      pastCity.classList.add("past-styling");
      btnSearch.addEventListener("click", pastSearch);
    }
  });
}

function searchToday() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "." + dd + "." + yyyy;
  return today.toString();
}

function searchCity(city) {
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=517f19dc586407c39701b016a6edf914&units=imperial`;

  fetch(currentWeatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      divCurrent.innerHTML = "";
      let currentCard = document.createElement("div");
      currentCard.innerHTML += `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>`;
      currentCard.innerHTML += `<h1> ${data.name} (${searchToday()})</h1>`;
      currentCard.innerHTML += `<h2>Temp: ${data.main.temp}°F</h2>`;
      currentCard.innerHTML += `<h2>Humidity: ${data.main.humidity}%</h2>`;
      currentCard.innerHTML += `<h2>Wind Speed: ${data.wind.speed} mph</h2>`;
      if (data.main.temp > 65) {
        currentCard.classList.add("current-styling-hot");
      } else {
        currentCard.classList.add("current-styling-cold");
      }
      divCurrent.append(currentCard);
    });

  let fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=1216c6d8b1f2b30f4fcbb22eb9353470&units=imperial`;
  fetch(fiveDayUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      divCity.innerHTML = "";
      for (let i = 0; i < data.list.length; i++) {
        let dtText = data.list[i].dt_txt.split(" ")[1];
        if (dtText === "15:00:00") {
          let cityCard = document.createElement("div");
          cityCard.innerHTML += `<img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"/>`;
          cityCard.innerHTML += `<h1>${data.list[i].dt_txt.split(" ")[0]}</h1>`;
          cityCard.innerHTML += `<h2>Temp: ${data.list[i].main.temp}°F</h2>`;
          cityCard.innerHTML += `<h2>Humidity: ${data.list[i].main.humidity}%</h2>`;
          cityCard.innerHTML += `<h2>Wind Speed: ${data.list[i].wind.speed}mph</h2>`;
          if (data.list[i].main.temp > 65) {
            cityCard.classList.add("styling-hot");
          } else {
            cityCard.classList.add("styling-cold");
          }
          divCity.append(cityCard);
        }
      }
    });
}

function pastSearch(event) {
  let city = event.target.innerHTML;
  searchCity(city);
}

function search() {
  let city = inputSearch.value;
  searchCity(city);

  let objectCities = {
    city: city,
  };
  arrayCities.unshift(objectCities);
  localStorage.setItem("Cities", JSON.stringify(arrayCities));
}

init();

btnSearch.addEventListener("click", search);
