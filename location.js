// //elements
const rootRef = document.getElementById("root");
let icon;

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
  let title = "Can the kids play outside?";

  let intro =
    result.city.name == undefined
      ? `The weather for the nex 5 days;`
      : `The weather for the nex 5 days in ${result.city.name}:`;

  createHTML(intro, main, "intro", "p", "", "prepend");
  createHTML(title, main, "title", "h1", "", "prepend");

  // goes through the API info
  result.list.forEach((item, index) => {
    create(item, index);
  });

  //filter
  result.list.forEach((item, index) => {
    filter(item, index);
  });

  //answer and picture
  createHTML(
    "",
    containerWeather,
    "changingImage",
    "img",
    picture(result.list[0]),
    "prepend"
  );

  createHTML(
    answer(result.list[0]),
    containerWeather,
    "answer",
    "p",
    "",
    "prepend"
  );
}

//turn it in html
createHTML("", rootRef, "main", "main");
const main = document.querySelector("main");
createHTML("", main, "containerWeather", "div");
const containerWeather = document.querySelector(".containerWeather");

function createHTML(
  text,
  container,
  className,
  tag = "p",
  src,
  placement = ""
) {
  let input = document.createTextNode(text);
  let element = document.createElement(tag);
  element.append(input);
  element.classList.add(className);

  if (tag === "img") {
    if (src.startsWith("./img")) {
      element.setAttribute("src", src);
    } else {
      element.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${src}@2x.png`
      );
    }
  }

  if (placement === "prepend") {
    container.prepend(element);
  } else {
    container.append(element);
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
  icon = weather[0].icon;

  createHTML(unixToHuman(dt), div, "date", "h2");
  createHTML(`Temperature: ${Math.round(temp)} °C`, div, "temp");
  createHTML(`Max temp: ${Math.round(temp_max)} °C`, div, "maxTemp");
  createHTML(`Min temp: ${Math.round(temp_min)} °C`, div, "minTemp");
  createHTML(`Windspeed: ${Math.round(wind.speed)}`, div, "wind");
  createHTML(`Clouds: ${weather[0].description}`, div, "clouds");
  createHTML("", div, "image", "img", icon);
}

// get day and change date
function unixToHuman(UnixTime) {
  const d = new Date(UnixTime * 1000);
  const today = new Date();
  if (
    d.getDate() !== today.getDate() &&
    (d.getHours() === 12 || d.getHours() == 13)
  ) {
    let day = dayjs(d).format("dddd MMMM D");
    return day;
  } else {
    let day = dayjs(d).format("dddd MMMM D, hh:mmA");
    return day;
  }
}

//search API
const intro = document.createElement("div");
intro.classList.add("containerIntro");
rootRef.prepend(intro);

const searchInfo = createHTML(
  "Search the weather in a city:",
  intro,
  "searchInfo"
);

createHTML("", intro, "searchBar", "input");
const search = document.querySelector(".searchBar");
search.setAttribute("type", "text");

createHTML("Search", intro, "searchBtn", "button");
const searchBtn = document.querySelector(".searchBtn");

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
    weatherItem.classList.add("off");
  }
  if (
    date.getDate() !== today.getDate() &&
    (date.getHours() === 12 || date.getHours() == 13)
  ) {
    weatherItem.classList.remove("off");
  }
}

// changing picture and answer
function answer(input) {
  let icon = input.weather[0].icon;
  let id = input.weather[0].id;
  let temp = input.main.temp;
  if (icon[icon.length - 1] === "n") {
    return "No, it is dark outside.";
  } else if (icon === "11d") {
    return "No, cuddle up";
  } else if (icon === "01d" || icon === "02d") {
    if (temp > "18") {
      return "Yes! Make sure to put sunscreen on";
    } else if (temp > "27") {
      return "Yes! Who has the waterballoons?";
    } else {
      return "Yes! Don't forget your coat";
    }
  } else if (id === "500" || id === "300" || id === "301") {
    return "Yes, they are not made of sugar";
  } else if (icon === "09d" || icon === "10d") {
    return "No, where is that ipad again?";
  } else if (id === "600") {
    return "Yes, do you want to build a snowman?";
  } else if (icon === "13d") {
    return "No, let's make some hot coco";
  } else if (icon === "50d") {
    return "Perfect weather for hide and seek";
  }
}

function picture(input) {
  let icon = input.weather[0].icon;
  let id = input.weather[0].id;
  let temp = input.main.temp;
  if (icon[icon.length - 1] === "n") {
    console.log("you are getting here");
    return "./img/baby.png";
  } else if (icon === "11d") {
    return "No, cuddle up";
  } else if (icon === "01d" || icon === "02d") {
    if (temp > "18") {
      return "Yes! Make sure to put sunscreen on";
    } else if (temp > "27") {
      return "Yes! Who has the waterballoons?";
    } else {
      return "Yes! Don't forget your coat";
    }
  } else if (id === "500" || id === "300" || id === "301") {
    return "Yes, they are not made of sugar";
  } else if (icon === "09d" || icon === "10d") {
    return "No, where is that ipad again?";
  } else if (id === "600") {
    return "Yes, do you want to build a snowman?";
  } else if (icon === "13d") {
    return "No, let's make some hot coco";
  } else if (icon === "50d") {
    return "Perfect weather for hide and seek";
  }
}
