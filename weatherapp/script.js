const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

const apiKey = "66c990c39d72140acd942316c0d6f516"; // Replace with your actual API key
let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong, API Error";
      infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    if (id == 800) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-16.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-17.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-18.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-19.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-20.png";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src =
        "http://codingstella.com/wp-content/uploads/2024/01/download-21.png";
    }

    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(
      feels_like
    );
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
