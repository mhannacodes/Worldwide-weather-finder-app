function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
      minutes = `0${minutes}`;
    }
   return(`${day}</br> ${hours}:${minutes}`)}

function formatFiveDayDates (timestamp) {
  let date = new Date(timestamp)
  let daysAbbreviation = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ]
  return(`${daysAbbreviation[date.getDay()]}`);
}

function cityDefault (city) {
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}
  `).then(tempOutput);
}

function searchCity(event) {
  event.preventDefault();
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  let cityInput = document.querySelector("#city-input").value;
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${units}&appid=${apiKey}
  `).then(tempOutput);
}

function getPosition () {
  navigator.geolocation.getCurrentPosition(getCoordinates);
}

function getCoordinates (position) {
  console.log(position)
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`).then(tempOutput);
  }

function tempOutput (response) {
  let temperature = document.querySelector(`#temp-integer`);
  let cityDisplayed = document.querySelector("#city-name");
  let weatherDescriptionElement = document.querySelector("#weather-details");
  let todayDate = document.querySelector("#current-date");
  celsiusTemp = response.data.main.temp;
  let weatherDesc = response.data.weather[0].description;
  let weatherHumidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  temperature.innerHTML = Math.round(celsiusTemp);
  cityDisplayed.innerHTML = response.data.name;
  weatherDescriptionElement.innerHTML = `${weatherDesc}<br>Humidity: ${weatherHumidity}%<br>Wind: ${Math.round(windSpeed)} KM/H`;
  todayDate.innerHTML = `${formatDate(response.data.dt*1000)}<small>(Last Updated)</small>`;
  setBgImage (response.data.weather[0].id);
  fiveDayForecast (latitude, longitude)
}

function setBgImage (id) {
  let background = document.querySelector(".forecast-today");
  if (200 <= id && id <= 299) {background.setAttribute("id", "bg-image-storm");}
  if (300 <= id && id <= 599) {background.setAttribute("id", "bg-image-raindrops");}
  if (600 <= id && id <= 699) {background.setAttribute("id", "bg-image-snow");}
  if (700 <= id && id<= 730) {background.setAttribute("id", "bg-image-fog");}
  if (id === 800) {background.setAttribute("id","bg-image-clear-sky");}
  if (801 <= id && id <= 802) {background.setAttribute("id", "bg-image-partly-sunny")}
  if (803 <= id && id <= 804) {background.setAttribute("id", "bg-image-grey-overcast");} 
}

function fiveDayForecast (lat,long) {
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=${units}&appid=${apiKey}`).then(fiveDayOutput);
}

function fiveDayOutput(response) {
  console.log(response.data);
  let fiveDayForecasts = [
    {day:"#current-day",dayInteger:0},
    {day:"#day-one", dayInteger:1}, 
    {day:"#day-two",dayInteger:2}, 
    {day:"#day-three",dayInteger:3}, 
    {day:"#day-four",dayInteger:4}
  ];
  for (let fiveDayForecast in fiveDayForecasts) {
  let temperature  = document.querySelector(`${fiveDayForecasts[fiveDayForecast].day} .high-low`);
  temperature.innerHTML = `${Math.round(response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].temp.day)}°/${Math.round(response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].temp.night)}°`;
  let desc = document.querySelector(`${fiveDayForecasts[fiveDayForecast].day} .desc`);
  desc.innerHTML = `${response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].weather[0].main}`;
  let precip = document.querySelector(`${fiveDayForecasts[fiveDayForecast].day} .precipitation`);
  precip.innerHTML = `pop: ${Math.round(response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].pop*100)}%`;
  let iconElement = document.querySelector(`${fiveDayForecasts[fiveDayForecast].day} .symbol`)
  iconElement.src =`https://openweathermap.org/img/wn/${response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].weather[0].icon}.png`;
  let dayName = document.querySelector(`${fiveDayForecasts[fiveDayForecast].day} .card-title`)
  dayName.innerHTML = formatFiveDayDates(response.data.daily[fiveDayForecasts[fiveDayForecast].dayInteger].dt*1000);
}
}

function convertFahrenheit(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-integer");
  celsius.innerHTML = "°C";
  fahrenheit.innerHTML = "<strong>°F</strong>";
  temperature.innerHTML = Math.round(celsiusTemp*(9.0 / 5.0) + 32);
}

function convertCelsius (event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-integer");
  celsius.innerHTML = "<strong>°C</strong>";
  fahrenheit.innerHTML = "°F";
  temperature.innerHTML = Math.round(celsiusTemp);
}

let celsiusTemp = null;

let searchField = document.querySelector(".locationSearch");
searchField.addEventListener("submit",searchCity);

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click",getPosition)

let celsius = document.querySelector("#units-celsius");
celsius.addEventListener("click", convertCelsius);

let fahrenheit = document.querySelector("#units-fahrenheit");
fahrenheit.addEventListener("click", convertFahrenheit);

cityDefault("New York")