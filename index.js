// imports
import { engLang, toast } from "./general.js";
import {
  createComeDown,
  filter,
  main,
  search,
  searchBtn,
  writeWeather,
} from "./renderHTML.js";
import { spinner } from "./spinner.js";
import { create } from "./utils.js";

//capitalize first letter
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

//initiate get location
const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
navigator.geolocation.getCurrentPosition(success, error, options);

//callbacks for success and error
function success({ coords }) {
  console.log("Success", location);
  const { latitude, longitude } = coords;
  getWeather(latitude, longitude);
}
function error(error) {
  console.log("Error", error);
  main.innerHTML = toast(engLang[error]);
}

//go get the weather data from the api
async function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=c9c04097e886eeff6e86ac740354f877&units=metric`;

  //get data and turn into object
  let result;
  try {
    result = await fetch(url);
    result = await result.json();
    console.log(result);
  } catch (e) {
    error(e);
    return;
  }

  // Create HTML
  writeWeather(result);

  // goes through the API info and filters
  result.list.forEach((item, index) => {
    filterAPI(item, index);
  });

  //filter API
  function filterAPI(item, index) {
    const date = new Date(item.dt * 1000);
    const today = new Date();

    // Calculate the future date (5 days from today)
    let futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 5);

    if (date.getDate() !== futureDate.getDate()) {
      create(item, index); // creates HTML
      filter(item, index); //filters HTML and puts in right container
    }
  }

  // Create HTML
  createComeDown(result);
}

//searchAPI eventlisteners
searchBtn.addEventListener("click", (e) => {
  let searchCity = search.value;
  getSearchAPI(searchCity);
});

search.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    let searchCity = search.value;
    getSearchAPI(searchCity);
  }
});

// API function
async function getSearchAPI(city) {
  main.innerHTML = spinner;
  let searchURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=5&appid=c9c04097e886eeff6e86ac740354f877`;
  let result = await fetch(searchURL);
  result = await result.json();
  try {
    getWeather(result[0].lat, result[0].lon);
  } catch (e) {
    error(e);
    return;
  }
  console.log(result[0].lat, result[0].lon);
}
