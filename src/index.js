let apiKey = "dd37c3810894c4465a983bfc0448362a";
let apiRootUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
let city = "Dallas";
let units = "metric";
let temp;
//Getting Current Date/Time
function getDay(day) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}
function getMonth(month) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}
function getTime(hour, minute) {
  if (minute < 10) {
    minute = `0${minute}`;
  }
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${minute} PM`;
  } else {
    return `${hour}:${minute} AM`;
  }
}
function formatDate(timestamp) {
  let currentDate = new Date(timestamp);
  let day = getDay(currentDate.getDay());
  let month = getMonth(currentDate.getMonth());
  let date = currentDate.getDate();
  let year = currentDate.getFullYear();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();
  let time = getTime(hour, minute);
  let newDate = `${day}, ${month} ${date}, ${year} ${time}`;
  return newDate;
}
function forecastTime(timestamp) {
  let time = new Date(timestamp);
  let hour = time.getHours();
  let minute = time.getMinutes();
  time = getTime(hour, minute);
  return time;
}
//change icon
function changeIcon(icon) {
  let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  document.querySelector("#currentIcon").src = iconUrl;
}
//basic location and temp function
function showTemp(response) {
  let tempSelector = document.querySelector("#currentTemp");
  temp = Math.round(response.data.main.temp);
  tempSelector.innerHTML = temp;
  city = response.data.name;
  let citySelector = document.querySelector(".cityName");
  citySelector.innerHTML = city;
  let searchValue = document.querySelector("#searchCityID");
  searchValue.value = null;
  farBtn.classList.remove("selected");
  celBtn.classList.add("selected");
  let iconId = response.data.weather[0].icon;
  changeIcon(iconId);
  let dateElement = document.querySelector("#currentDate");
  dateElement.innerHTML = `${formatDate(response.data.dt * 1000)}`;
}
function showForecast(response) {
  let i = 0;
  while (i < 5) {
    document.querySelector(`#forecast${i}min`).innerHTML = Math.round(
      response.data.list[i].main.temp_min
    );
    document.querySelector(`#forecast${i}max`).innerHTML = Math.round(
      response.data.list[i].main.temp_max
    );
    document.querySelector(`#time${i}`).innerHTML = forecastTime(
      response.data.list[i].dt * 1000
    );
    i++;
  }

  //console.log(response.data.list[0].main.temp_max);
}
//default temp function at page load
function defaultTemp() {
  let apiUrl = `${apiRootUrl}${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(showTemp);
  let apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiForecastUrl).then(showForecast);
}
defaultTemp();
//city search selector
function cityFunction(event) {
  event.preventDefault();
  let searchValue = document.querySelector("#searchCityID");
  city = searchValue.value;
  defaultTemp();
}
let searchCity = document.querySelector("#searchCity");
searchCity.addEventListener("submit", cityFunction);

//current location selector

function longAndLat(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(showTemp);
}
function locationFunction(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(longAndLat);
}

let currentLocation = document.querySelector("#currentLocBtn");
currentLocation.addEventListener("click", locationFunction);

// Celsius/Farhenheit converter
function cToFFunc(num) {
  return Math.round((num * 9) / 5 + 32);
}
function fToCFunc(num) {
  return Math.round(((num - 32) * 5) / 9);
}
function farFunction(event) {
  event.preventDefault();
  farBtn.classList.add("selected");
  celBtn.classList.remove("selected");
  let tempSelector = document.querySelector("#currentTemp");
  let cToF = Number(tempSelector.innerHTML);
  cToF = cToFFunc(cToF);
  tempSelector.innerHTML = `${cToF}`;
  let i = 0;
  while (i < 5) {
    let tempMin = document.querySelector(`#forecast${i}min`).innerHTML;
    tempMin = Math.round(cToFFunc(tempMin));
    document.querySelector(`#forecast${i}min`).innerHTML = tempMin;
    tempMax = document.querySelector(`#forecast${i}max`).innerHTML;
    tempMax = Math.round(cToFFunc(tempMax));
    document.querySelector(`#forecast${i}max`).innerHTML = tempMax;
    i++;
  }
}

function celFunction(event) {
  event.preventDefault();
  farBtn.classList.remove("selected");
  celBtn.classList.add("selected");
  let tempSelector = document.querySelector("#currentTemp");
  tempSelector.innerHTML = temp;
  let i = 0;
  while (i < 5) {
    let tempMin = document.querySelector(`#forecast${i}min`).innerHTML;
    tempMin = Math.round(fToCFunc(tempMin));
    document.querySelector(`#forecast${i}min`).innerHTML = tempMin;
    tempMax = document.querySelector(`#forecast${i}max`).innerHTML;
    tempMax = Math.round(fToCFunc(tempMax));
    document.querySelector(`#forecast${i}max`).innerHTML = tempMax;
    i++;
  }
}

let farBtn = document.querySelector("#toFar");
let celBtn = document.querySelector("#toCelsius");
farBtn.addEventListener("click", farFunction);
celBtn.addEventListener("click", celFunction);
