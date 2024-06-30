import { customArrow } from "./renderHTML.js";

export function createHTML(
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

export function create(item, index) {
  //create div container - tried to use createHTML() did not work...
  let weatherItem = document.createElement("div");
  weatherItem.id = `weather-item${index}`;
  let containerBottom = document.querySelector(".containerBottom");
  containerBottom.append(weatherItem);
  //creating content
  const { dt, wind, weather } = item;
  const { temp_max, temp_min, temp } = item.main;
  let icon = weather[0].icon;
  // //filter try two

  const date = new Date(dt * 1000);
  const today = new Date();
  weatherItem = document.getElementById(`weather-item${index}`);

  const containerWeather = document.querySelector(".containerWeather");
  containerWeather.style.border = "rgb(251, 189, 99) solid 5px";

  createHTML("", weatherItem, `containerFuture${index}`, "div");
  let containerFuture = document.querySelector(`.containerFuture${index}`);
  createHTML(unixToHuman(dt), containerFuture, dt, "h2");
  createHTML("", containerFuture, `statsContainer${index}`, "div");
  let statsContainer = document.querySelector(`.statsContainer${index}`);
  createHTML(`Temp: ${Math.round(temp)} °C`, statsContainer, "temp");
  createHTML(`Max temp: ${Math.round(temp_max)} °C`, statsContainer, "maxTemp");
  createHTML(`Min temp: ${Math.round(temp_min)} °C`, statsContainer, "minTemp");
  createHTML(`Windspeed: ${Math.round(wind.speed)}`, statsContainer, "wind");
  let windElement = document.getElementsByClassName("wind");
  createHTML("", windElement[index], "arrow", "img", "./img/up-arrow.svg");
  customArrow(item.wind.deg, item.wind.speed, index);
  createHTML(weather[0].description.capitalize(), statsContainer, "clouds");
  createHTML("", containerFuture, `iconContainer${index}`, "div");
  let iconContainer = document.querySelector(`.iconContainer${index}`);
  iconContainer.classList.add("iconContainer");
  createHTML(shortAnswer(item), iconContainer, "shortAnswer");
  createHTML("", iconContainer, "image", "img", icon);

  //append weather items to the right place
  for (let i = 1; i < 5; i++) {
    let futureShow = document.querySelector(`.FutureShow${i}`);
    let containerSlideDown = document.querySelector(`.containerSlideDown${i}`);
    containerSlideDown.classList.add("containerSlideDown");

    // Create a new date object for the future day
    let futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i); // Adds 'i' days to 'today'

    console.log("date:", date.getDate());
    console.log("Future Date:", futureDate.getDate());

    // Check if the date matches and the hour is 12 or 13
    if (date.getDate() === futureDate.getDate()) {
      if (date.getHours() === 12 || date.getHours() == 13) {
        futureShow.prepend(weatherItem);
      } else {
        containerSlideDown.append(weatherItem);
      }
    }
  }
}

// get day and change date
export function unixToHuman(UnixTime) {
  const d = new Date(UnixTime * 1000);
  const today = new Date();
  if (
    d.getDate() !== today.getDate() &&
    (d.getHours() === 12 || d.getHours() == 13)
  ) {
    let day = dayjs(d).format("ddd MMMM D");
    return day;
  } else if (d.getDate() !== today.getDate()) {
    let day = dayjs(d).format("ddd MMM D, hh:mmA");
    return day;
  } else {
    let day = dayjs(d).format("ddd MMMM D, hh:mmA");
    return day;
  }
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shortAnswer(item) {
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

//Comedown
export function comeDown(item, hiddenItem) {
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
      } else if (item2.classList.contains("on")) {
        item2.classList.remove("on");
        item2.classList.add("off");
      }
    });
  });
}
