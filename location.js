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

  createHTML(title, rootRef, "h1");
  createHTML(intro, rootRef);

  // createLists("ul", result.list);
  result.list.forEach((item) => {
    create(item);
  });
}

//turn it in html
function createHTML(text, container, tag = "p") {
  let input = document.createTextNode(text);
  let element = document.createElement(tag);
  element.append(input);
  container.append(element);
}

function create(item) {
  console.log(item);
  //create div container
  let div = document.createElement("div");
  div.classList.add("weather-item");
  rootRef.append(div);
  //creating content
  createHTML(Day(item.dt_txt), div, "h1");
  createHTML(`Temperature: ${item.main.temp} °C`, div);
  createHTML(`Maximum temperature: ${item.main.temp_max} °C`, div);
  createHTML(`Minimum temperature: ${item.main.temp_min} °C`, div);
  createHTML(`Windspeed: ${item.wind.speed}`, div);
  createHTML(`Clouds: ${item.weather[0].description}`, div);
}

// get day and change date
function Day(date) {
  const d = new Date(date);
  let weekdayIndex = d.getDay();
  console.log(weekdayIndex);
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
