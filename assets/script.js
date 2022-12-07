// GLOBAL VARIABLES
let formSearch = document.querySelector("#form-search");
let inputSearch = document.querySelector("#input-search");
let historySearch = document.querySelector("#history-search");

let cityCurrent = document.querySelector("#city-current");
let tempCurrent = document.querySelector("#temp-current");
let windCurrent = document.querySelector("#wind-current");
let humiCurrent = document.querySelector("#humi-current");

let divForecast = document.querySelector("#div-forecast");

let currentWeatherUrl = [];
let fiveDayUrl = [];

let today = dayjs();
let arrayCities = JSON.parse(localStorage.getItem("cities")) || [];

// FUNCTIONS
function init() {
  historySearch.innerHTML = "";
  arrayCities.forEach((city) => {
    let btnCity = document.createElement("button");
    btnCity.innerHTML += `${city}`;
    btnCity.setAttribute("data-city", city);
    btnCity.classList.add(
      "bg-indigo-400",
      "hover:bg-indigo-500",
      "text-white",
      "mt-1"
    );
    historySearch.append(btnCity);
  });
}

function searchCity(event) {
  event.preventDefault();
  let cityLogged =
    inputSearch.value.trim() || event.target.getAttribute("data-city");
  let currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityLogged}&appid=517f19dc586407c39701b016a6edf914&units=imperial`;
  if (cityLogged === "") {
    return;
  }
  // Clear input after submitting
  inputSearch.value = "";
  // Clear five-day forecast HTML
  divForecast.innerHTML = "";
  // Confirm cities array includes the search input; if not, push/unshift the search into the array.
  let containsCity = arrayCities.includes(cityLogged);
  if (containsCity) {
  } else {
    arrayCities.unshift(cityLogged);
  }
  localStorage.setItem("cities", JSON.stringify(arrayCities.slice(-10)));
  init();
  // Begin to retrieve from API
  fetch(currentWeatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let currentWeatherIcons = data.weather[0].icon;
      // Apply API to search for five-day forecast data
      let fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityLogged}&appid=1216c6d8b1f2b30f4fcbb22eb9353470&units=imperial`;
      cityCurrent.innerHTML = `${data.name} ${today.format(
        "M/DD/YYYY"
      )} <img src="http://openweathermap.org/img/wn/${currentWeatherIcons}@2x.png">`;
      tempCurrent.innerHTML = `🌡: ${data.main.temp}°F`;
      windCurrent.innerHTML = `💨: ${data.wind.speed}MPH`;
      humiCurrent.innerHTML = `😅: ${data.main.humidity}%`;
      // Fetch five-day forecast data
      fetch(fiveDayUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          // For loop to generate five-day forecast
          for (let i = 1; i < 6; i++) {
            let fiveDayIcons = data.list[i].weather[0].icon;
            let fiveDayDiv = document.createElement("div");
            let fiveDayDate = document.createElement("h3");
            let fiveDayTemp = document.createElement("p");
            let fiveDayWind = document.createElement("p");
            let fiveDayHumi = document.createElement("p");
            fiveDayDiv.classList.add(
              "rounded",
              "p-2",
              "text-white",
              "bg-indigo-500"
            );
            // Add styling to HTML
            fiveDayDate.classList.add("text-lg", "font-bold", "pb-3");
            fiveDayTemp.classList.add("pb-3");
            fiveDayWind.classList.add("pb-3");
            fiveDayHumi.classList.add("pb-3");
            // Add data to HTML
            fiveDayDate.innerHTML = `${today
              .add([i], "day")
              .format(
                "M/DD/YYYY"
              )} <img src="http://openweathermap.org/img/wn/${fiveDayIcons}@2x.png">`;
            fiveDayTemp.innerHTML = `🌡: ${data.list[i].main.temp}°F`;
            fiveDayWind.innerHTML = `💨: ${data.list[i].wind.speed}MPH`;
            fiveDayHumi.innerHTML = `😅: ${data.list[i].main.humidity}%`;
            // Display data to page
            fiveDayDiv.append(
              fiveDayDate,
              fiveDayTemp,
              fiveDayWind,
              fiveDayHumi
            );
            divForecast.append(fiveDayDiv);
          }
        });
    });
}

//CALL FUNCTIONS
init();

//EVENT LISTENERS
formSearch.addEventListener("submit", searchCity);
historySearch.addEventListener("click", searchCity);

//CONTENT REPOSITORY
// if (data.main.temp > 65) {
//   currentCard.classList.add("current-styling-hot");
// } else {
//   currentCard.classList.add("current-styling-cold");
// }
