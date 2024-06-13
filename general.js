export const lightblue = "rgba(183, 231, 252, 1)";
export const blue = "rgba(133, 188, 239, 1)";
export const green = "rgba(169, 243, 167, 1)";
export const yellow = "rgba(248, 255, 172, 1)";
export const orange = "rgba(251, 189, 99, 1)";
export const red = "rgba(244, 150, 130, 1)";
export const purple = "rgba(180, 130, 244, 1)";

export function toast(message) {
  if (message === undefined) {
    message = "Sorry, something went wrong. Please try again or search a city";
  }
  return `<div class="errorMsg"><p id="errorMsg">${message}</p></div>`;
}

export const engLang = {
  "TypeError: Failed to fetch":
    "Sorry, we are having technical difficulties. Try again later",
  "error message": "Please try again",
  "TypeError: Cannot read properties of undefined (reading 'lat')":
    "That is not a valid city, please check your spelling.",
  GeolocationPositionError:
    "Please share your location or search for a city in the searchbar.",
};
