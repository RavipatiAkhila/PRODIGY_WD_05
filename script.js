document.getElementById("locationInput").onkeydown = function (event) {
  if (event.key === "Enter") {
      getWeatherByCity();
  }
};

function getWeatherByLatLon(lat, lon, cityName) {
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m`;

  fetch(weatherUrl)
      .then(response => response.json())
      .then(data => {
          let humidity = data.hourly ? data.hourly.relative_humidity_2m[0] : "N/A";
          displayWeather(data.current_weather, cityName, humidity);
      })
      .catch(error => {
          console.error("Error fetching weather:", error);
          alert("Failed to fetch weather data. Please try again.");
      });
}

function getWeatherByCity() {
  let city = document.getElementById("locationInput").value.trim();
  if (!city) {
      alert("Please enter a city name.");
      return;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&format=json`;

  fetch(geoUrl)
      .then(response => response.json())
      .then(data => {
          if (data.results && data.results.length > 0) {
              let lat = data.results[0].latitude;
              let lon = data.results[0].longitude;
              let cityName = data.results[0].name;
              getWeatherByLatLon(lat, lon, cityName);
          } else {
              alert("City not found. Try another.");
          }
      })
      .catch(error => {
          console.error("Error fetching location:", error);
          alert("Error fetching city. Try again.");
      });
}

function getUserLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          position => {
              let lat = position.coords.latitude;
              let lon = position.coords.longitude;

              fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                  .then(response => response.json())
                  .then(data => {
                      let cityName = data.address.city || data.address.town || data.address.village || "Unknown Location";
                      getWeatherByLatLon(lat, lon, cityName);
                  })
                  .catch(error => {
                      console.error("Error fetching location name:", error);
                      alert("Error retrieving city name.");
                  });
          },
          error => {
              alert("Location access denied. Enter a city manually.");
          }
      );
  } else {
      alert("Geolocation not supported.");
  }
}

function displayWeather(weather, cityName, humidity) {
  document.getElementById("weatherInfo").innerHTML = `
      <h2>Weather in ${cityName}</h2>
      <p>Temperature: ${weather.temperature}°C</p>
      <p>Wind Speed: ${weather.windspeed} km/h</p>
      <p>Humidity: ${humidity}%</p>
  `;
}
