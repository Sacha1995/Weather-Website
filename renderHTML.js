import {
  blue,
  green,
  lightblue,
  orange,
  purple,
  rootRef,
  yellow,
} from "./general.js";
import { comeDown, createHTML, getRandom } from "./utils.js";

//variables
export let title;
export let intro;

//turn it in html
createHTML("", rootRef, "main", "main");
export const main = document.querySelector("main");

export function writeWeather(result) {
  // create HTML
  main.innerHTML = ""; // deletes spinner
  createHTML(
    `The weather for the next 5 days in ${result.city.name}:`,
    main,
    "intro",
    "p",
    "",
    "prepend"
  );
  intro = document.querySelector(".intro");
  createHTML("Can the kids play outside?", main, "title", "h1", "", "prepend");
  title = document.querySelector(".title");

  // containers for styling --- not very well done, could definitely be shorter....
  createHTML("", main, "containerWeather", "div");
  const containerWeather = document.querySelector(".containerWeather");
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
  let futureShow1 = document.querySelector(`.FutureShow1`);
  let futureShow2 = document.querySelector(`.FutureShow2`);
  let futureShow3 = document.querySelector(`.FutureShow3`);
  let futureShow4 = document.querySelector(`.FutureShow4`);
  createHTML("", futureShow1, "containerSlideDown1", "div");
  createHTML("", futureShow2, "containerSlideDown2", "div");
  createHTML("", futureShow3, "containerSlideDown3", "div");
  createHTML("", futureShow4, "containerSlideDown4", "div");

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
}

export function createComeDown() {
  //clickable show rest of weather details
  let display = document.getElementsByClassName("display");
  let displayArr = Array.from(display);
  let future = document.getElementsByClassName("future");
  let futureArr = Array.from(future);

  let todayList = document.querySelectorAll(".today");
  let todayListLast = todayList[todayList.length - 1];
  todayListLast.classList.add("margin-bottom");

  displayArr.forEach((item) => {
    comeDown(item, futureArr);
  });
}

//filter
export function filter(item, index) {
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

//search API HTML
const Containerintro = document.createElement("div");
Containerintro.classList.add("containerIntro");
rootRef.prepend(Containerintro);

const searchInfo = createHTML(
  "Search the weather in a city:",
  Containerintro,
  "searchInfo"
);

createHTML("", Containerintro, "searchBar", "input");
export const search = document.querySelector(".searchBar");
search.setAttribute("type", "text");

createHTML("Search", Containerintro, "searchBtn", "button");
export const searchBtn = document.querySelector(".searchBtn");

// changing picture and answer
export function answer(input) {
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

export function picture(input) {
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

//Windarrow
export function customArrow(deg, speed, index) {
  let arrow = document.getElementsByClassName("arrow");
  speed = Math.round(speed);
  if (speed === 0 || speed === 1) {
    arrow[index].style.backgroundColor = lightblue;
  } else if (speed === 2 || speed === 3 || speed === 4) {
    arrow[index].style.backgroundColor = blue;
  } else if (speed === 5 || speed === 6) {
    arrow[index].style.backgroundColor = green;
  } else if (speed === 7 || speed === 8) {
    arrow[index].style.backgroundColor = yellow;
  } else if (speed === 9 || speed === 10) {
    arrow[index].style.backgroundColor = orange;
  } else if (speed === 11) {
    arrow[index].style.backgroundColor = red;
  } else if (speed === 12) {
    arrow[index].style.backgroundColor = purple;
  } else {
    arrow[index].style.backgroundColor = "white";
  }
  arrow[index].style.webkitTransform = "rotate(" + deg + "deg)";
}
