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
let result = "";

async function getWeather(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=c9c04097e886eeff6e86ac740354f877`;

  //get data and turn into object
  result = await fetch(url);
  result = await result.json();

  console.log(result.city, result.list);
}

//turn it in html
function createHTML(tag, text, container) {
  let input = document.createTextNode(text);
  let element = document.createElement(tag);
  element.append(input);
  container.append(element);
}

createHTML("h1", "Weather", rootRef);
createHTML("p", `here is the weather`, rootRef); // I tried to add the name of the city with ${result.city.name}, but that did not work. How would I do that?

function createLists(list, array) {
  let element = document.createElement(list); // create ul or ol tag
  let listItemsTags = document.createElement("li"); // create list items
  let input = document.createTextNode("Item 1"); //create input list items
  listItemsTags.append(input); // put input in list item
  element.append(listItemsTags); // put list item in ul or ol
  rootRef.append(element); // puts ul/ol in html
}

createLists("ul", result.list);
