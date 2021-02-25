function formatDate(date) {
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
   return(`${day}</br> ${hours}:${minutes}`)
}

function searchCity(event) {
  event.preventDefault();
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  let cityInput = document.querySelector("#city-input").value;
  
  
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${units}&appid=${apiKey}
  `).then(tempOutput);
}

function getPosition (event) {
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
  console.log(response.data)
  let tempResponse = Math.round(response.data.main.temp);
  let temperature = document.querySelector(`#temp-integer`);
  temperature.innerHTML = tempResponse;
  let cityDisplayed = document.querySelector("#city-name");
  cityDisplayed.innerHTML = response.data.name;
  let weatherDesc = response.data.weather[0].main;
  let weatherHumidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let weatherDescriptionElement = document.querySelector("#weather-details");
  weatherDescriptionElement.innerHTML = `${weatherDesc}<br>Humidity: ${weatherHumidity}%<br>Wind: ${Math.round(windSpeed)}km/h`;
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  fiveDayForecast (latitude, longitude)
}

function fiveDayForecast (lat,long) {
  let apiKey = `d468fe5c4c50f2a8c6db046f0712510b`;
  let units = `metric`;
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&units=${units}&appid=${apiKey}`).then(fiveDayOutput);
}

function fiveDayOutput(response) {
  console.log(response.data);
  let fiveDayForecastList = [
    {day:"#current-day",dayInteger:0},
    {day:"#day-one", dayInteger:1}, 
    {day:"#day-two",dayInteger:2}, 
    {day:"#day-three",dayInteger:3}, 
    {day:"#day-four",dayInteger:4}
  ];
  fiveDayForecastList.forEach(function(list,index) {for(let day in list) {
  let temp  = document.querySelector(list[day] ".high-low")
  temp.innerHTML = `${Math.round(response.data.daily(list[dayInteger]).temp.day)}°/${Math.round(response.data.daily(list[dayInteger]).temp.night)}°`;
  let desc = document.querySelector(list[day] ".desc")
  desc.innerHTML = response.data.daily(list[dayInteger]).weather(list[dayInteger]).main;
  let precip = document.querySelector(list[day] ".precipitation")
  precip.innerHTML = Math.round(response.data.daily(list[dayInteger]).rain);
  let icon = document.querySelector(list[day] ".icon")
  icon.innerHTML = Math.round(response.data.daily(list[dayInteger]).weather[dayInteger].icon);}
})
}

function convertFahrenheit(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-integer");
  celsius.innerHTML = `°C`;
  fahrenheit.innerHTML = `<strong>°F</strong>`;
  let tempF = (Number(temperature )* (9.0 / 5.0) + 32);
  temperature.innerHTML = tempF;
}

function convertCelsius(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temp-integer");
  temperate = Number(temperature);
  celsius.innerHTML = "<strong>°C</strong>";
  fahrenheit.innerHTML = `°F`;
  temperature.innerHTML = (temperature - 32)/(9 / 5);
}

let currentDate = new Date();
let todayDate = document.querySelector("#current-date");
todayDate.innerHTML = formatDate(currentDate);

let searchField = document.querySelector(".locationSearch");
searchField.addEventListener("submit",searchCity);

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click",getPosition)

let celsius = document.querySelector("#units-celsius");
celsius.addEventListener("click", convertCelsius);

let fahrenheit = document.querySelector("#units-fahrenheit");
fahrenheit.addEventListener("click", convertFahrenheit);