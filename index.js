const main_icon = document.querySelector("#main_icon");
const city_name = document.querySelector(".city_name");
const elevation = document.querySelector(".elevation");
const temp = document.querySelector(".temp");
const desc = document.querySelector(".desc");
const wind = document.querySelector(".wind");
const rain_chance = document.querySelector(".rain_chance");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const water = document.querySelector(".water");
const snow = document.querySelector(".snow");
const span_date = document.querySelector(".date");
document.querySelector("input").value = "";

window.x = 50.87;
window.y = 20.62;
window.selected_card = 2;
window.cities = [];

function get_weather(coords){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            window.weather = JSON.parse(this.response);
            use_time();
            let date = new Date();
            let seconds_to_next_minute = 61-date.getSeconds();
            setTimeout(function(){
              count_time();
            }, 1000*seconds_to_next_minute)
            let weather_code;
            if(window.selected_card == 2){
                temp.innerText = window.weather.current_weather.temperature+"\u00B0C";
                wind.innerHTML += window.weather.current_weather.windspeed+" km/h";
                weather_code = window.weather.current_weather.weathercode;
            }else{
                temp.innerText = window.weather.hourly.temperature_2m[(window.selected_card*24)+current_hour]+"\u00B0C";
                wind.innerHTML += window.weather.hourly.windspeed_10m[(window.selected_card*24)+current_hour]+" km/h";
                weather_code = window.weather.hourly.weathercode[(window.selected_card*24)+current_hour];
            }
            elevation.innerText = window.weather.elevation+"m a.s.l";
            rain_chance.innerHTML += window.weather.hourly.precipitation_probability[(window.selected_card*24)+current_hour]+"%";
            pressure.innerHTML += window.weather.hourly.surface_pressure[(window.selected_card*24)+current_hour]+" hPa";
            humidity.innerHTML += window.weather.hourly.relativehumidity_2m[(window.selected_card*24)+current_hour]+"%";
            water.innerHTML += window.weather.hourly.rain[(window.selected_card*24)+current_hour]+"mm";
            snow.innerHTML += window.weather.hourly.snowfall[(window.selected_card*24)+current_hour]+"mm";window.sunrise = window.weather.daily.sunrise[window.selected_card];
            window.sunset = window.weather.daily.sunset[window.selected_card];
            let weather_code_response = use_weather_code(weather_code);
            main_icon.className = weather_code_response[0]
            desc.innerText = weather_code_response[1]
        }
    }
    xmlhttp.open("GET", `https://api.open-meteo.com/v1/forecast?latitude=${coords.x}&longitude=${coords.y}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,rain,showers,snowfall,snow_depth,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m&current_weather=true&past_days=2&timezone=auto&daily=sunrise,sunset`, true);
    xmlhttp.send();
}

document.querySelector(".left_arrow").addEventListener("click", function(){
    if(window.selected_card > 0){
        document.querySelector(".right_arrow").style = "";
        document.querySelector(".left_arrow").style = "";
        window.selected_card--;
        if(window.selected_card == 0){
            document.querySelector(".left_arrow").style = 'filter: contrast(0)';
        }
        clear_spans();
        change_city(window.city);
        if(document.querySelector(".hourly_weather").style.display != 'none'){
          clear_hourly();
          hourly_weather();
          document.querySelector(".hourly_weather").scrollTo(0,0);
        }
    }
})

document.querySelector(".right_arrow").addEventListener("click", function(){
    if(window.selected_card < 8){
        document.querySelector(".right_arrow").style = "";
        document.querySelector(".left_arrow").style = "";
        window.selected_card++;
        if(window.selected_card == 8){
            document.querySelector(".right_arrow").style = 'filter: contrast(0)';
        }
        clear_spans();
        change_city(window.city);
        if(document.querySelector(".hourly_weather").style.display != 'none'){
          clear_hourly();
          hourly_weather();
          document.querySelector(".hourly_weather").scrollTo(0,0);
        }
    }
})

document.querySelector("input").addEventListener("input", function(e){
    if(e.target.value){
        var xmlhttp_ac = new XMLHttpRequest();
        xmlhttp_ac.onreadystatechange = function () {
            if (xmlhttp_ac.readyState == 4 && xmlhttp_ac.status == 200) {
                window.cities = [];
                JSON.parse(this.response).results.forEach(el => {
                    if(!window.cities.includes(el.city) && el.city){
                       window.cities.push(el.city); 
                    }
                })
                autocomplete(document.querySelector("input"),window.cities);
            }
        }
        xmlhttp_ac.open("GET", `https://api.geoapify.com/v1/geocode/autocomplete?text=${e.target.value}&type=city&format=json&apiKey=fc46623c65e3426d9994c9714769f536`, true);
        xmlhttp_ac.send(null);
    }
})

function change_city(city){
    var xmlhttp_city_coords = new XMLHttpRequest();
    xmlhttp_city_coords.onreadystatechange = function () {
        if (xmlhttp_city_coords.readyState == 4 && xmlhttp_city_coords.status == 200) {
            window.x = JSON.parse(this.response)[0].lat;
            window.y = JSON.parse(this.response)[0].lon;
            clear_spans();
            window.city = capitalize(city);
            save_city();
            get_weather({x:window.x,y:window.y});
        }
    }
    xmlhttp_city_coords.open("GET", `https://geocode.maps.co/search?q=${city}`, true);
    xmlhttp_city_coords.send(null);
}

document.querySelector("input").addEventListener("keyup", function(e){
    if(e.key == "Enter" && e.target.value != window.city){
        change_city(e.target.value)
    }
})

const successCallback = (position) => {
    document.querySelector('input').value = ''
    var xmlhttp_user_coords = new XMLHttpRequest();
    xmlhttp_user_coords.onreadystatechange = function () {
        if (xmlhttp_user_coords.readyState == 4 && xmlhttp_user_coords.status == 200) {
            let city = JSON.parse(this.response).address.City;
            change_city(city);
        }
    }
   xmlhttp_user_coords.open("GET", `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=pjson&featureTypes=&location=${position.coords.longitude}%2C${position.coords.latitude}`, true);
    xmlhttp_user_coords.send(null);
};

document.querySelector("button").addEventListener("click", function(){
  navigator.geolocation.getCurrentPosition(successCallback);  
})

if(localStorage.getItem("wether_city")){
    change_city(localStorage.getItem("wether_city"));
}else{
 change_city("Warsaw");   
}