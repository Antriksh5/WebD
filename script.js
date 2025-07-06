const API_KEY = "1b25782cd4ab4a848c328e42592171d8"
let currentUnit = 'metric'
const searchIp = document.getElementById('search-ip')
const searchBtn = document.getElementById('search-btn')

searchBtn.addEventListener('click',() => {
    const city = searchIp.value.trim() 
    if(city){
        getWeather(city)
    }
})

function getWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${API_KEY}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
    console.log(data)
      updateWeather(data);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
    });
}
const temp = document.getElementById('temp')
const day = document.getElementById('day')
const weatherIcon = document.getElementById('weather-icon')
const weatherDes = document.getElementById('weather-description')
const windStatus = document.getElementById('wind')
const humidity = document.getElementById('humidity')
// const visibility = document.getElementById('visibility')

function updateWeather(data){
    const unit = currentUnit === 'metric' ? '°C' : '°F';
    temp.textContent = `${data.list[0].main.temp}${unit}`

    day.textContent = new Date(data.list[0].dt_txt).toDateString()
    weatherDes.textContent = `${data.list[0].weather[0].main} | ${data.list[0].weather[0].description}`
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`

    const windUnit = currentUnit === 'metric' ? 'm/s' : 'mph';
    windStatus.innerHTML = `${data.list[0].wind.speed}${windUnit}`
    humidity.innerHTML = `${data.list[0].main.humidity}%`

    const visibilityInMeters = data.list[0].visibility;
    const visibilityInKm = (visibilityInMeters / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visibilityInKm} Km`
    renderForecastData(data.list)
}


function renderForecastData(list){
  const forecast = document.getElementById('forecast')
  forecast.innerHTML = ''

  const daily = {}
  
  list.forEach(element => {
    const date = new Date(element.dt_txt)
    const day = date.toLocaleDateString('en-US', { weekday: "short"})


    // check if we have already visited on the day and also to check the time is 12 pm
    if(!daily[day] && date.getHours() === 12){
      daily[day] = {
        temp: Math.round(element.main.temp),
        icon: element.weather[0].icon,
        des: element.weather[0].main,
      }
    }
  });

  Object.entries(daily).forEach(([day, {temp, icon}]) => {
    const card  = document.createElement('div')
    card.className = 'forecast-card'

    unit = currentUnit === 'metric' ? '°C' : '°F';
    card.innerHTML = `
      <div class="forecast-day">${day}</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="forecast-icon">
      <div class="forecast-temp">${temp}${unit}</div>
    `
    

    forecast.appendChild(card)
  })
}

const unitButtons = document.querySelectorAll('.unit-btn')

unitButtons.forEach(btn => {
  
  btn.addEventListener('click',() => {
  const selectedBtn = btn.getAttribute('data-unit')
  if(selectedBtn !== currentUnit){
    currentUnit = selectedBtn

    unitButtons.forEach(btns => btns.classList.remove('active-mode'))
    btn.classList.add('active-mode')

    const city = searchIp.value.trim()
    if(city)
      getWeather(city)
  }}
)
});