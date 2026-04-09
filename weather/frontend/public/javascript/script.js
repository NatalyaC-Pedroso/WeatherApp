const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i"),
  suggestions = inputPart.querySelector(".suggestions");

const apiKey = "66c990c39d72140acd942316c0d6f516"; // Substitua pela sua chave Api
let api;
let debounceTimer;


window.addEventListener("load", () => {
  getLocationWeather();
});

inputField.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  const query = inputField.value.trim();
  if (query.length > 0) {
    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
  } else {
    hideSuggestions();
  }
});

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    clearTimeout(debounceTimer);
    hideSuggestions();
    requestApi(inputField.value);
  }
});


function getLocationWeather() {
  if (navigator.geolocation) {
    infoTxt.innerText = "Getting your location...";
    infoTxt.classList.add("pending");
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    infoTxt.innerText = "Geolocation not supported";
    infoTxt.classList.add("error");
  }
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function requestApiByCoordinates(latitude, longitude) {
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchSuggestions(query) {
  const geoApi = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
  fetch(geoApi)
    .then(res => res.json())
    .then(data => showSuggestions(data))
    .catch(() => hideSuggestions());
}

function showSuggestions(cities) {
  suggestions.innerHTML = '';
  if (cities.length > 0) {
    cities.forEach(city => {
      const div = document.createElement('div');
      div.textContent = `${city.name}, ${city.country}`;
      div.addEventListener('click', () => {
        inputField.value = `${city.name}, ${city.country}`;
        hideSuggestions();
        requestApiByCoordinates(city.lat, city.lon);
      });
      suggestions.appendChild(div);
    });
    suggestions.classList.add('show');
  } else {
    hideSuggestions();
  }
}

function hideSuggestions() {
  suggestions.classList.remove('show');
  suggestions.innerHTML = '';
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  requestApiByCoordinates(latitude, longitude);
}

function onError(error) {
  infoTxt.innerText = `Erro de localização: ${error.message}. Digite uma cidade no campo acima.`;
  infoTxt.classList.replace("pending", "error");
}


function getBackgroundImage() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const time = hour + minute / 60; 
  
  if (hour >= 5 && hour < 10) {
    // Nascer do sol (05:00 - 09:59)
    return "../assets/imagens/nascer do sol.jpg";
  } else if (hour >= 10 && time < 17.75) {
    // Dia (10:00 - 17:44)
    return "../assets/imagens/dia.jpeg";
  } else if (time >= 17.75 && time < 18.75) {
    // Pôr do sol (17:45 - 18:44)
    return "../assets/imagens/pôr do sol.jpg";
  } else {
    // Noite (18:45 - 04:59)
    return "../assets/imagens/noite.jpeg";
  }
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
    const { temp, feels_like, humidity, pressure } = info.main;
    const { speed } = info.wind;
    const { all } = info.clouds;
    const updatedAt = new Date(info.dt * 1000).toLocaleTimeString();

  
    if (id == 800) {
      wIcon.src = "../assets/imagens/Sol.png";
    } 
      else if (id >= 200 && id <= 232) {
        wIcon.src = "../assets/imagens/Raio.png";
      } 
      else if (id >= 600 && id <= 622) {
        wIcon.src = "../assets/imagens/Neve.png";
      } 
      else if (id >= 701 && id <= 781) {
        wIcon.src = "../assets/imagens/Vento.png";
      } 
      else if (id >= 801 && id <= 804) {
        wIcon.src = "../assets/imagens/Nublado.png";
      } 
      else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        wIcon.src = "../assets/imagens/Raio com chuva.png";
      }

    
    weatherPart.querySelector(".temp .numb").innerText = Math.round(temp);
    weatherPart.querySelector(".weather").innerText = description.charAt(0).toUpperCase() + description.slice(1);
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.round(feels_like);
    
    
    const humidityElement = weatherPart.querySelector(".bottom-details .humidity span");
    if (humidityElement) {
      humidityElement.innerText = `${humidity}%`;
    }
    
    
    console.log(`Temperatura: ${temp}°C | Umidade: ${humidity}% | Atualizado em: ${updatedAt} | Pressão: ${pressure}hPa | Vento: ${speed}m/s`);
    
  
    const backgroundImage = getBackgroundImage();
    wrapper.style.backgroundImage = `url('${backgroundImage}')`;
    
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
