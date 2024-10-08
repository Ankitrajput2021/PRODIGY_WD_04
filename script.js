const apiKey = '942295dafcced4f3cdd12aec7620cd4f';
const fetchWeatherBtn = document.getElementById('fetch-weather');
const fetchGeolocationBtn = document.getElementById('fetch-geolocation-weather');
const weatherDetails = document.getElementById('weather-details');
const getStartedButton = document.getElementById('get-started');
const homepage = document.querySelector('.homepage');
const weatherContainer = document.querySelector('.weather-container');

// Event listener for "Get Started" button
getStartedButton.addEventListener('click', () => {
  homepage.classList.add('hidden');
  weatherContainer.classList.remove('hidden');
  document.body.style.backgroundImage = "url('default-weather.jpg')"; // Change to a default weather background
});

fetchWeatherBtn.addEventListener('click', () => {
  const locationInput = document.getElementById('location-input').value.trim();
  if (locationInput) {
    const location = encodeURIComponent(locationInput);
    fetchWeatherByCity(location);
  } else {
    weatherDetails.innerHTML = 'Please enter a location.';
  }
});

fetchGeolocationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    }, () => {
      weatherDetails.innerHTML = 'Unable to retrieve your location. Please try again.';
    });
  } else {
    weatherDetails.innerHTML = 'Geolocation is not supported by your browser.';
  }
});

function fetchWeatherByCity(location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetchWeather(url);
}

function fetchWeather(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        weatherDetails.innerHTML = `Error: ${data.message}`;
      }
    })
    .catch(error => {
      weatherDetails.innerHTML = 'Error fetching weather data. Please try again.';
      console.error('Error:', error);
    });
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherDetails.innerHTML = `
    <h2>Weather in ${name}</h2>
    <img src="${iconUrl}" alt="${weather[0].description}" class="weather-icon">
    <p>Temperature: ${main.temp}°C</p>
    <p>Feels Like: ${main.feels_like}°C</p>
    <p>Weather: ${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;

  changeBackground(weather[0].main.toLowerCase());
}

function changeBackground(weatherCondition) {
  switch (weatherCondition) {
    case 'clear':
      document.body.style.backgroundImage = "url('clear-sky.jpg')";
      break;
    case 'clouds':
      document.body.style.backgroundImage = "url('cloudy.jpg')";
      break;
    case 'rain':
      document.body.style.backgroundImage = "url('rain.jpg')";
      break;
    case 'snow':
      document.body.style.backgroundImage = "url('snow.jpg')";
      break;
    case 'thunderstorm':
      document.body.style.backgroundImage = "url('thunderstorm.jpg')";
      break;
    default:
      document.body.style.backgroundImage = "url('default-weather.jpg')";
      break;
  }
}
