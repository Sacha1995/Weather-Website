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
  console.log(result);

  // Change place name
  let title =
    result.city.name == undefined ? `Weather` : `Weather ${result.city.name}`;

  let intro =
    result.city.name == undefined
      ? `The weather for the nex 5 days;`
      : `The weather for the nex 5 days in ${result.city.name}:`;

  createHTML(title, containerWeather, "title", "h1");
  createHTML(intro, containerWeather, "intro");

  // goes through the API info
  result.list.forEach((item, index) => {
    create(item, index);
  });

  //filter
  result.list.forEach((item, index) => {
    filter(item, index);
  });
}

//turn it in html
createHTML("", rootRef, "containerWeather", "div");
const containerWeather = document.querySelector(".containerWeather");

function createHTML(text, container, className, tag = "p", src) {
  let input = document.createTextNode(text);
  let element = document.createElement(tag);
  element.append(input);
  element.classList.add(className);
  container.append(element);

  if (tag === "img") {
    element.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${src}@2x.png`
    );
  }
}

function create(item, index) {
  //create div container - tried to use createHTML() did not work...
  let div = document.createElement("div");
  div.id = `weather-item${index}`;
  containerWeather.append(div);
  //creating content
  const { dt, wind, weather } = item;
  const { temp_max, temp_min, temp } = item.main;
  const { icon } = weather[0];

  createHTML(unixToHuman(dt), div, "date", "h2");
  createHTML(`Temperature: ${temp} °C`, div, "temp");
  createHTML(`Maximum temperature: ${temp_max} °C`, div, "maxTemp");
  createHTML(`Minimum temperature: ${temp_min} °C`, div, "minTemp");
  createHTML(`Windspeed: ${wind.speed}`, div, "wind");
  createHTML(`Clouds: ${weather[0].description}`, div, "clouds");
  createHTML("", div, "image", "img", icon);
}

// get day and change date
function unixToHuman(UnixTime) {
  const d = new Date(UnixTime * 1000);
  let day = dayjs(d).format("dddd MMMM D, hh:mmA");
  return day;
}

//search API
//**************************Try later if we can shorten!************************************** */
const search = document.createElement("input");
search.setAttribute("type", "text");
rootRef.prepend(search);

const searchBtn = document.createElement("button");
searchBtn.innerHTML = "Search";
searchBtn.classList.add("searchBtn");
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

//filter
function filter(item, index) {
  const date = new Date(item.dt * 1000);
  const today = new Date();
  let weatherItem = document.getElementById(`weather-item${index}`);
  if (date.getDate() !== today.getDate()) {
    console.log(weatherItem);
    weatherItem.classList.add("off");
  }
  console.log(date.getHours());
  if (date.getHours() === 12 || date.getHours() == 13) {
    weatherItem.classList.remove("off");
  }
}
