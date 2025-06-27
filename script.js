const apiKey = "YOUR_API_KEY"; // replace with your API key
const cityInput = document.getElementById("cityInput");

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    cityInput.value = lastCity;
    getWeather(lastCity);
  }
};

async function getWeather(city = cityInput.value) {
  if (!city) return;
  localStorage.setItem("lastCity", city);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.cod !== 200) {
    document.getElementById("weatherResult").innerHTML = `<p style="color:red">${data.message}</p>`;
    return;
  }

  document.getElementById("weatherResult").innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C | 💧 ${data.main.humidity}% | 🌬️ ${data.wind.speed} m/s</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
  `;

  getForecast(data.coord.lat, data.coord.lon);
}

function getLocationWeather() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await res.json();
    cityInput.value = data.name;
    getWeather(data.name);
  }, () => alert("Location access denied"));
}

cityInput.addEventListener("input", () => {
  const value = cityInput.value;
  if (value.length < 3) {
    document.getElementById("suggestions").innerHTML = "";
    return;
  }
  fetch(`https://api.teleport.org/api/cities/?search=${value}`)
    .then(res => res.json())
    .then(data => {
      const suggestions = data._embedded["city:search-results"].slice(0, 5);
      document.getElementById("suggestions").innerHTML = suggestions.map(c =>
        `<div onclick="selectCity('${c.matching_full_name}')">${c.matching_full_name}</div>`).join('');
    });
});

function selectCity(name) {
  cityInput.value = name.split(',')[0];
  document.getElementById("suggestions").innerHTML = "";
}

