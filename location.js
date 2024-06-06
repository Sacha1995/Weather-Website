// //elements
const rootRef = document.getElementById("root");

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
}

//go get the weather data from the api
async function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=c9c04097e886eeff6e86ac740354f877&units=metric`;

  //get data and turn into object
  let result = await fetch(url);
  result = await result.json();

  // Change place name
  let title =
    result.city.name == undefined ? `Weather` : `Weather ${result.city.name}`;

  let intro =
    result.city.name == undefined
      ? `The weather for the nex 5 days;`
      : `The weather for the nex 5 days in ${result.city.name}:`;

  createHTML(title, containerWeather, "title", "h1");
  createHTML(intro, containerWeather, "intro");

  // createLists("ul", result.list);
  result.list.forEach((item) => {
    create(item);
  });

  //add pictures clouds
  const cloudsArray = document.getElementsByClassName("clouds");
  Array.from(cloudsArray).forEach((item) => {
    addClouds(item);
  });
}

//turn it in html
createHTML("", rootRef, "containerWeather", "div");
const containerWeather = document.querySelector(".containerWeather");

function createHTML(text, container, className, tag = "p") {
  let input = document.createTextNode(text);
  let element = document.createElement(tag);
  element.append(input);
  element.classList.add(className);
  container.append(element);
}

function create(item) {
  //create div container - tried to use createHTML() did not work...
  let div = document.createElement("div");
  div.classList.add("weather-item");
  containerWeather.append(div);
  //creating content
  createHTML(Day(item.dt_txt), div, "date", "h2");
  createHTML(`Temperature: ${item.main.temp} °C`, div, "temp");
  createHTML(`Maximum temperature: ${item.main.temp_max} °C`, div, "maxTemp");
  createHTML(`Minimum temperature: ${item.main.temp_min} °C`, div, "minTemp");
  createHTML(`Windspeed: ${item.wind.speed}`, div, "wind");
  createHTML(`Clouds: ${item.weather[0].description}`, div, "clouds");
}

// get day and change date
function Day(date) {
  const d = new Date(date);
  let weekdayIndex = d.getDay();
  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  date = date.replace("2024-", "");
  date = date.substring(0, date.length - 3); // takes away the seconds
  let dayTitle = week[weekdayIndex] + " " + date;
  return dayTitle;
}

//Add pictures
function addClouds(item) {
  switch (item.innerHTML) {
    case "Clouds: clear sky":
      createHTML("", item, "clearSky", "img");
      let clearSky = document.getElementsByClassName("clearSky");
      addImage(clearSky, "./img/sun.png");
      break;
    case "Clouds: scattered clouds":
      createHTML("", item, "scatteredClouds", "img");
      let scatteredClouds = document.getElementsByClassName("scatteredClouds");
      addImage(scatteredClouds, "./img/cloud-sun.png");
      break;
    case "Clouds: broken clouds":
      createHTML("", item, "brokenClouds", "img");
      let brokenClouds = document.getElementsByClassName("brokenClouds");
      addImage(brokenClouds, "./img/cloud-sun.png");
      break;
    case "Clouds: overcast clouds":
      createHTML("", item, "overcast", "img");
      let overcast = document.getElementsByClassName("overcast");
      addImage(overcast, "./img/only-cloud.png");
      break;
    case "Clouds: few clouds":
      createHTML("", item, "fewClouds", "img");
      let fewClouds = document.getElementsByClassName("fewClouds");
      addImage(fewClouds, "./img/sunshine-with-little-clouds.png");
      break;
    case "Clouds: light rain":
      createHTML("", item, "lightRain", "img");
      let lightRain = document.getElementsByClassName("lightRain");
      addImage(lightRain, "./img/sun-cloud-rain.png");
      break;
  }
}

function addImage(className, imgSrc) {
  Array.from(className).forEach((it) => {
    it.src = imgSrc;
    it.style.width = "20px";
    it.style.marginLeft = "10px";
  });
}

//search API
const search = document.createElement("input");
search.setAttribute("type", "text");
rootRef.prepend(search);

const searchBtn = document.createElement("button");
searchBtn.innerHTML = "Search";
search.after(searchBtn);

const searchInfo = document.createElement("p");
searchInfo.innerHTML = "Search the weather in a city:";
search.before(searchInfo);

searchBtn.addEventListener("click", (e) => {
  let searchCity = search.value;
  getSearchAPI(searchCity);
});

async function getSearchAPI(city) {
  let searchURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=5&appid=c9c04097e886eeff6e86ac740354f877`;
  console.log(searchURL);
  let result = await fetch(searchURL);
  result = await result.json();
  containerWeather.innerHTML = "";
  getWeather(result[0].lat, result[0].lon);
}
