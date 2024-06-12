// //elements
const rootRef = document.getElementById("root");
let icon;
let title;
let intro;
let display;
let future;

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
}

//go get the weather data from the api
async function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=c9c04097e886eeff6e86ac740354f877&units=metric`;

  //get data and turn into object
  let result = await fetch(url);
  result = await result.json();
  console.log(result);

  // Change place name & containers
  title = "Can the kids play outside?";

  intro =
    result.city.name == undefined
      ? `The weather for the next 5 days;`
      : `The weather for the next 5 days in ${result.city.name}:`;

  createHTML(intro, main, "intro", "p", "", "prepend");
  intro = document.querySelector(".intro");
  createHTML(title, main, "title", "h1", "", "prepend");
  title = document.querySelector(".title");
  createHTML("", main, "containerSun", "div");
  let containerSun = document.querySelector(".containerSun");
  createHTML(
    "From when to when can the kids play outside?",
    containerSun,
    "sunQuestion"
  );
  createHTML(
    `Sunrise today is at ${dayjs(result.city.sunrise * 1000).format("hh:mmA")}`,
    containerSun,
    "sunrise"
  );
  createHTML(
    `Sunset today is at ${dayjs(result.city.sunset * 1000).format("hh:mmA")}`,
    containerSun,
    "sunset"
  );
  createHTML(
    "",
    containerSun,
    "sunriseImg",
    "img",
    "./img/weather-icons/017-sunrise.svg"
  );

  // containers for styling
  createHTML("", containerWeather, "containerTop", "div", "", "prepend");
  const containerTop = document.querySelector(".containerTop");
  createHTML("", containerTop, "containerAnswer", "div");
  const containerAnswer = document.querySelector(".containerAnswer");
  createHTML("", containerTop, "containerToday", "div");
  const containerToday = document.querySelector(".containerToday");
  createHTML("", containerWeather, "containerBottom", "div");
  const containerBottom = document.querySelector(".containerBottom");
  createHTML("", containerBottom, `FutureShow1`, "div");
  createHTML("", containerBottom, `FutureShow2`, "div");
  createHTML("", containerBottom, `FutureShow3`, "div");
  createHTML("", containerBottom, `FutureShow4`, "div");
  createHTML("", containerBottom, `FutureShow5`, "div");

  // goes through the API info
  result.list.forEach((item, index) => {
    create(item, index);
  });

  //answer and picture
  createHTML(
    "",
    containerAnswer,
    "changingImage",
    "img",
    picture(result.list[0]),
    "prepend"
  );

  createHTML(
    answer(result.list[0]),
    containerAnswer,
    "answer",
    "p",
    "",
    "prepend"
  );

  //filter
  result.list.forEach((item, index) => {
    filter(item, index);
    display = document.getElementsByClassName("display");
    future = document.getElementsByClassName("future");
    customArrow(item.wind.deg, item.wind.speed, index);
  });

  let displayArr = Array.from(display);
  let futureArr = Array.from(future);

  displayArr.forEach((item) => {
    comeDown(item, futureArr);
  });

  let todayList = document.querySelectorAll(".today");
  let todayListLast = todayList[todayList.length - 1];
  todayListLast.classList.add("margin-bottom");

  console.log("result list", result.list);
  console.log("result list first item", result.list[0]);
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
    if (src.startsWith(`./img`)) {
      element.setAttribute("src", src);
    } else {
      element.setAttribute("src", `./img/weather-icons/${src}.svg`);
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
  let weatherItem = document.createElement("div");
  weatherItem.id = `weather-item${index}`;
  let containerBottom = document.querySelector(".containerBottom");
  containerBottom.append(weatherItem);
  //creating content
  const { dt, wind, weather } = item;
  const { temp_max, temp_min, temp } = item.main;
  icon = weather[0].icon;

  // //filter try two

  const date = new Date(item.dt * 1000);
  const today = new Date();
  weatherItem = document.getElementById(`weather-item${index}`);

  createHTML("", weatherItem, `containerFuture${index}`, "div");
  let containerFuture = document.querySelector(`.containerFuture${index}`);
  createHTML(unixToHuman(dt), containerFuture, dt, "h2");
  createHTML("", containerFuture, `statsContainer${index}`, "div");
  let statsContainer = document.querySelector(`.statsContainer${index}`);
  createHTML(`Temperature: ${Math.round(temp)} °C`, statsContainer, "temp");
  createHTML(`Max temp: ${Math.round(temp_max)} °C`, statsContainer, "maxTemp");
  createHTML(`Min temp: ${Math.round(temp_min)} °C`, statsContainer, "minTemp");
  createHTML(`Windspeed: ${Math.round(wind.speed)}`, statsContainer, "wind");
  let windElement = document.getElementsByClassName("wind");
  console.log(windElement);
  createHTML("", windElement[index], "arrow", "img", "./img/up-arrow.svg");
  createHTML(weather[0].description.capitalize(), statsContainer, "clouds");
  createHTML("", containerFuture, `iconContainer${index}`, "div");
  let iconContainer = document.querySelector(`.iconContainer${index}`);
  iconContainer.classList.add("iconContainer");
  createHTML(shortAnswer(item), iconContainer, "shortAnswer");
  createHTML("", iconContainer, "image", "img", icon);

  let futureShow1 = document.querySelector(`.FutureShow1`);
  let futureShow2 = document.querySelector(`.FutureShow2`);
  let futureShow3 = document.querySelector(`.FutureShow3`);
  let futureShow4 = document.querySelector(`.FutureShow4`);
  let futureShow5 = document.querySelector(`.FutureShow5`);
  for (let i = 1; i < 6; i++) {
    let futureShow = document.querySelector(`.FutureShow${i}`);
    if (date.getDate() === today.getDate() + i)
      if (date.getHours() === 12 || date.getHours() == 13) {
        futureShow.prepend(weatherItem);
      } else {
        futureShow.append(weatherItem);
      }
  }
}

// get day and change date
function unixToHuman(UnixTime) {
  const d = new Date(UnixTime * 1000);
  const today = new Date();
  if (
    d.getDate() !== today.getDate() &&
    (d.getHours() === 12 || d.getHours() == 13)
  ) {
    let day = dayjs(d).format("ddd MMMM D");
    return day;
  } else {
    let day = dayjs(d).format("ddd MMMM D, hh:mmA");
    return day;
  }
}

//search API
const Containerintro = document.createElement("div");
Containerintro.classList.add("containerIntro");
rootRef.prepend(Containerintro);

const searchInfo = createHTML(
  "Search the weather in a city:",
  Containerintro,
  "searchInfo"
);

createHTML("", Containerintro, "searchBar", "input");
const search = document.querySelector(".searchBar");
search.setAttribute("type", "text");

createHTML("Search", Containerintro, "searchBtn", "button");
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
  title.innerHTML = "";
  intro.innerHTML = "";
  getWeather(result[0].lat, result[0].lon);
}

//filter
function filter(item, index) {
  const date = new Date(item.dt * 1000);
  const today = new Date();
  let weatherItem = document.getElementById(`weather-item${index}`);
  let containerToday = document.querySelector(".containerToday");
  if (date.getDate() !== today.getDate()) {
    weatherItem.classList.add("off");
  }
  if (
    date.getDate() !== today.getDate() &&
    (date.getHours() === 12 || date.getHours() == 13)
  ) {
    weatherItem.classList.remove("off");
    weatherItem.classList.add("display");
  }
  if (date.getDate() === today.getDate()) {
    weatherItem.classList.add("today");
    containerToday.append(weatherItem);
  } else {
    weatherItem.classList.add("future");
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
    if (temp > 27) {
      return "Yes! Who has the waterballoons?";
    } else if (temp > 18) {
      return "Yes! Make sure to put sunscreen on";
    } else {
      return "Yes! Don't forget your coat";
    }
  } else if (icon === "03d" || icon === "04d") {
    return "Yes, off they go!";
  } else if (id === 500 || id === 300 || id === 301) {
    return "Yes, they are not made of sugar";
  } else if (icon === "09d" || icon === "10d") {
    return "No, where is that ipad again?";
  } else if (id === 600) {
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
    return "./img/baby.png";
  } else if (icon === "11d") {
    return `./img/cuddle/${getRandom(1, 6)}.svg`;
  } else if (icon === "01d" || icon === "02d") {
    if (temp > 18) {
      return `./img/yes-warm/${getRandom(1, 7)}.svg`;
    } else if (temp > 27) {
      return `./img/yes-hot/${getRandom(1, 11)}.svg`;
    } else {
      return `./img/yes/${getRandom(1, 23)}.svg`;
    }
  } else if (icon === "03d" || icon === "04d") {
    return `./img/yes/${getRandom(1, 23)}.svg`;
  } else if (id === 500 || id === 300 || id === 301) {
    return `./img/rain/${getRandom(1, 2)}.svg`;
  } else if (icon === "09d" || icon === "10d") {
    return `./img/no/${getRandom(1, 6)}.svg`;
  } else if (id === 600) {
    return `./img/snow-outside/${getRandom(1, 3)}.svg`;
  } else if (icon === "13d") {
    return `./img/snow-inside/1.svg`;
  } else if (icon === "50d") {
    return `./img/mist/1.svg`;
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shortAnswer(item) {
  let icon = item.weather[0].icon;
  let id = item.weather[0].id;
  if (icon[icon.length - 1] === "n") {
    return "No";
  } else if (id === 500 || id === 300 || id === 301) {
    return "Yes";
  } else if (
    icon === "11d" ||
    icon === "09d" ||
    icon === "10d" ||
    icon === "13d"
  ) {
    return "No";
  } else if (icon === "50d") {
    return "Probably not";
  } else {
    return "Yes";
  }
}

//comedown
function showItem() {
  const item = document.querySelector(".future");
  console.log("something");
  item.toggleAttribute("hidden");
}

function comeDown(item, hiddenItem) {
  item.addEventListener("click", (e) => {
    hiddenItem.forEach((item2) => {
      let unix = item.querySelector("h2").className;
      let unix2 = item2.querySelector("h2").className;
      let clickedDate = new Date(unix * 1000);
      let hiddenDate = new Date(unix2 * 1000);
      if (hiddenDate.getDate() === clickedDate.getDate()) {
        if (item2.classList.contains("off")) {
          item2.classList.remove("off");
          item2.classList.add("on");
        } else if (!item2.classList.contains("display")) {
          item2.classList.remove("on");
          item2.classList.add("off");
        }
      }
    });
  });
}

//Arrow
function customArrow(deg, speed, index) {
  let arrow = document.getElementsByClassName("arrow");
  speed = Math.round(speed);
  if (speed === 0 || speed === 1) {
    arrow[index].style.backgroundColor = "rgba(183, 231, 252, 1)";
  } else if (speed === 2 || speed === 3 || speed === 4) {
    arrow[index].style.backgroundColor = "rgba(133, 188, 239, 1)";
  } else if (speed === 5 || speed === 6) {
    arrow[index].style.backgroundColor = "rgba(169, 243, 167, 1)";
  } else if (speed === 7 || speed === 8) {
    arrow[index].style.backgroundColor = "rgba(248, 255, 172, 1)";
  } else if (speed === 9 || speed === 10) {
    arrow[index].style.backgroundColor = "rgba(251, 189, 99, 1)";
  } else if (speed === 11) {
    arrow[index].style.backgroundColor = "rgba(244, 150, 130, 1)";
  } else if (speed === 12) {
    arrow[index].style.backgroundColor = "rgba(180, 130, 244, 1)";
  } else {
    arrow[index].style.backgroundColor = "white";
  }
  // arrow[index].style.transform = "rotate(" + 90 + " deg)"; this one does not work?
  arrow[index].style.webkitTransform = "rotate(" + deg + "deg)";
}
