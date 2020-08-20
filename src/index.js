let apiKey = "dd37c3810894c4465a983bfc0448362a";
let apiRootUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
let city = "Dallas";
let units = "metric";
let temp;
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
}
//default temp function at page load
function defaultTemp() {
  let apiUrl = `${apiRootUrl}${city}&appid=${apiKey}&&units=${units}`;
  axios.get(apiUrl).then(showTemp);
  console.log(apiUrl);
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
  console.log(apiUrl);
}
function locationFunction(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(longAndLat);
}

let currentLocation = document.querySelector("#currentLocBtn");
currentLocation.addEventListener("click", locationFunction);

// Celsius/Farhenheit converter

function farFunction(event) {
  event.preventDefault();
  farBtn.classList.add("selected");
  celBtn.classList.remove("selected");
  let tempSelector = document.querySelector("#currentTemp");
  let cToF = Number(tempSelector.innerHTML);
  cToF = Math.round((cToF * 9) / 5 + 32);
  tempSelector.innerHTML = `${cToF}`;
}

function celFunction(event) {
  event.preventDefault();
  farBtn.classList.remove("selected");
  celBtn.classList.add("selected");
  let tempSelector = document.querySelector("#currentTemp");
  tempSelector.innerHTML = temp;
}

let farBtn = document.querySelector("#toFar");
let celBtn = document.querySelector("#toCelsius");
farBtn.addEventListener("click", farFunction);
celBtn.addEventListener("click", celFunction);

//Getting Current Date/Time
function getTodaysDate() {
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
  function getDate() {
    let currentDate = new Date();
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
  let today = document.querySelector(".currentDay");
  today.innerHTML = getDate();
}
getTodaysDate();
//Search City Function
