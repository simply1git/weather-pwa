async function getForecast(lat, lon) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  const data = await res.json();

  let forecastHTML = `<h3>5-Day Forecast</h3>`;
  const daily = data.list.filter(f => f.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    forecastHTML += `
      <div>
        <strong>${date}</strong> - ${day.weather[0].main}, ${day.main.temp}°C
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="40"/>
      </div>
    `;
  });

  document.getElementById("forecast").innerHTML = forecastHTML;
}
