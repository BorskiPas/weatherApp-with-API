const s = selektor => document.getElementById(selektor);

const searchBox = s("search");
const locationName = s("location-name");
const datum = s("date");
const weatherSummary = s("weather-descr");
const weatherIcon = s("wd-right");
const currentTemp = s("temperature");
const minTemp = s("min-temp");
const maxTemp = s("max-temp");
const humidity = s("humid");
const wind = s("wind-speed");
const weekInfo = s("week-info");
const today = s("today");
const weekly = s("weekly");

const proxy = "https://proxy-requests.herokuapp.com/";

/* using what: MetaWeather's API 
Method: using Location Search; 
Info provided in response: Location information */
let upit;
let woeid;

function locationSearch() {
   s("weather-form").addEventListener("submit", function (e) {
      e.preventDefault();
      upit = searchBox.value;
      fetch(`${proxy}https://www.metaweather.com/api/location/search/?query=${upit}`)
         .then(response => response.json())
         .then(response => {
            if (response[0] == undefined) {
               locationName.innerText = "No locations found";
               datum.innerText = "";
               weatherSummary.innerText = "";
               weatherIcon.innerHTML = ``;
               currentTemp.innerText = "";
            }
            else {
               woeid = response[0].woeid;
               getWeather(woeid);
            }
         });
   });
}
locationSearch();

/* using what: MetaWeather's API 
Method: using Location;
Info provided in response: Location information, and a 5 day forecast
URL: /api/location/(woeid)/
argument (callback) F-je: woeid = Where On Earth ID 
deo odgovora (response, u formi JSON objekta) koji nam treba: consolidated_weather */
let apiUrl = "https://www.metaweather.com/api/location/";
let weatherObject;
let weeklyString = "";
const Budapest = "804365";

function getWeather(woeid) {
   fetch(`${proxy}${apiUrl}${woeid}/`)
      .then(response => response.json())
      .then(function (response) {
         weatherObject = response.consolidated_weather;
         // console.log(weatherObject);
         locationName.innerHTML = response.title;
         datum.innerHTML = weatherObject[0].applicable_date;
         weatherSummary.innerHTML = weatherObject[0].weather_state_name;
         let iconUrl = `https://www.metaweather.com/static/img/weather/${weatherObject[0].weather_state_abbr}.svg`;
         weatherIcon.innerHTML = `<img src="${iconUrl}" alt="${weatherObject[0].weather_state_name}_picture" width="auto" height="auto">`;
         currentTemp.innerHTML = weatherObject[0].the_temp.toFixed(0) + '&#8451';
         minTemp.innerHTML = weatherObject[0].min_temp.toFixed(0) + '&#8451';
         maxTemp.innerHTML = weatherObject[0].max_temp.toFixed(0) + '&#8451';
         humidity.innerHTML = weatherObject[0].humidity.toFixed(0) + '&#37';
         wind.innerHTML = ((weatherObject[0].wind_speed) * 1.609344).toFixed(0) + ' km/h';
         for (let i = 1; i < weatherObject.length; i++) {
            weeklyString += `
                <div class="fiveDaysForecast">
                  <div>${weatherObject[i].applicable_date}</div>
                  <div><img src="https://www.metaweather.com/static/img/weather/${weatherObject[i].weather_state_abbr}.svg" width="50%" height="auto"></div>
                  <div>${weatherObject[i].weather_state_name}</div>
                  <div id="weekly-temp">${weatherObject[i].min_temp.toFixed(0) + '&#8451'}\/${weatherObject[i].max_temp.toFixed(0) + '&#8451'}</div>
                </div>
                `
         }
         weekInfo.innerHTML = "";
         weekInfo.innerHTML += weeklyString;
      })
}
// getWeather(Budapest);

// prikaz vremena za današnji dan
function showToday() {
   today.addEventListener("click", function () {
      s("info-today").classList.remove("invisible");
      s("week-info").classList.add("invisible");
      s("today").classList.add("active-nav");
      s("weekly").classList.remove("active-nav");
   });
}
showToday();
// prikaz vremena za 5 dana
function show5days() {
   weekly.addEventListener("click", function () {
      s("info-today").classList.add("invisible");
      s("week-info").classList.remove("invisible");
      s("today").classList.remove("active-nav");
      s("weekly").classList.add("active-nav");
   });
}
show5days();




