function get_day_name(day) {
  switch (day) {
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    case 6:
      return "Saturday";
      break;
  }
}

function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", function (e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
    document.querySelector("#autocomplete-list").addEventListener("click", function (e) {
      change_city(e.target.outerText);
    })
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function clear_spans() {
  main_icon.className = "fa fa-cloud";
  temp.innerHTML = "&nbsp;";
  desc.innerHTML = "&nbsp;";
  wind.innerHTML = '<i class="fa-solid fa-wind"></i>&nbsp;';
  rain_chance.innerHTML = '<i class="fa fa-cloud-rain"></i>&nbsp;';
  pressure.innerText = "";
  humidity.innerHTML = '<i class="fa fa-droplet"></i>&nbsp;&nbsp;';
  water.innerHTML = '<i class="fa fa-water"></i>&nbsp;';
  snow.innerHTML = '<i class="fa fa-snowflake"></i>&nbsp;';
}

function capitalize(str) {
  str = str.toLowerCase();
  var pieces = str.split(" ");
  for (var i = 0; i < pieces.length; i++) {
    var j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1);
  }
  return pieces.join(" ");
}

function save_city() {
  localStorage.setItem("wether_city", window.city);
}

function use_time() {
  let date = new Date();
  date.setDate(date.getUTCDate() + (window.selected_card - 2));
  window.current_hour = date.getUTCHours() + (window.weather.utc_offset_seconds / 3600);
  window.current_min = date.getUTCMinutes();
  if(window.current_hour === +window.current_hour && window.current_hour !== (window.current_hour|0)){
    window.current_hour = Math.floor(window.current_hour);
    window.current_min += 30;
    if(window.current_min >= 60){
      window.current_min -= 60;
      window.current_hour++;
    }
  }
  let min = window.current_min;
  let month, day;
  month = date.getUTCMonth() + 1;
  day = date.getUTCDate();
  let week_day = get_day_name(date.getUTCDay());
  if (window.current_hour >= 24) {
    window.current_hour -= 24;
    day++;
    week_day = get_day_name(date.getUTCDay() + 1);
    if (day == 32 && [1, 3, 5, 7, 8, 10, 12].includes(month)) {
      month++;
      day = 1;
    }
    if (day == 31 && [4, 6, 9, 11].includes(month)) {
      month++;
      day = 1;
    }
    if (day == 29 && month == 2 && date.getFullYear() % 4 != 0) {
      month++;
      day = 1;
    }
    if (day == 30 && month == 2 && date.getFullYear() % 4 == 0) {
      month++;
      day = 1;
    }
    if (month == 13) {
      month = 1;
    }
  }
  if (window.current_hour < 0) {
    window.current_hour += 24;
    day--;
    week_day = get_day_name(date.getUTCDay() - 1);
  }
  let hour = window.current_hour;
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  if (min < 10) {
    min = "0" + min;
  }
  city_name.innerText = window.city + " - " + hour + ":" + min;
  span_date.innerText = day + "-" + month + "-" + date.getFullYear() + " - " + week_day;
}

function count_time() {
   use_time();
  if(window.interval){
    clearInterval(window.interval);
  }
  window.interval = setInterval(function () {
    clear_spans();
    use_time();
    change_city(window.city)
  }, 60000)
}

document.querySelector(".fa-clock").addEventListener("click", function(){
  document.querySelector(".hourly_weather").style = '';
  hourly_weather();
})
document.querySelector(".fa-close").addEventListener("click", function(){
  document.querySelector(".hourly_weather").style = 'display:none;';
  clear_hourly();
})

function use_weather_code(weather_code,hour = null) {
  let sun = true;
  let sunset = false;
  let sunrise = false;
  let main_icon,desc;
  if(hour || hour == 0){
    if(hour > 20 || hour < 7){
      sun = false;
    }
  }else{
    let sunrise_time = window.sunrise.substr(window.sunrise.length - 5);
    let sunset_time = window.sunset.substr(window.sunrise.length - 5);
    let sunrise_minutes = parseInt(sunrise_time.split(":")[1]);
    let sunrise_hours = parseInt(sunrise_time.split(":")[0]);
    let sunset_minutes = parseInt(sunset_time.split(":")[1]);
    let sunset_hours = parseInt(sunset_time.split(":")[0]);
    if (window.current_hour < sunrise_hours || window.current_hour > sunset_hours) {
      sun = false;
    }
    if (window.current_hour == sunrise_hours && window.current_min < sunrise_minutes) {
      sun = false;
    }
    if (window.current_hour == sunset_hours && window.current_min > sunset_minutes) {
      sun = false;
    }
    if(window.current_hour == sunset_hours){
      sunset = true;
    }
  if(window.current_hour == sunrise_hours){
      sunrise = true;
    }
  }
  switch (weather_code) {
    case 0:
      if (sun) {
        main_icon = "fa fa-sun";
      } else {
        main_icon = "fa fa-moon";
      }
      desc = "Clear sky";
      break;
    case 1:
    case 2:
    case 3:
      if (sun) {
        main_icon = "fa fa-cloud";
      } else {
        main_icon = "fa fa-cloud-moon";
      }
      desc = "Cloudy";
      break;
    case 45:
    case 48:
      main_icon = "fa fa-smog";
      desc = "Fog";
      break;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      main_icon = "fa fa-umbrella";
      desc = "Drizzle";
      break;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      if (sun) {
        main_icon = "fa fa-cloud-rain";
      } else {
        main_icon = "fa fa-cloud-moon-rain";
      }
      desc = "Deszcz";
      break;
    case 85:
    case 86:
    case 71:
    case 73:
    case 75:
    case 77:
      main_icon = "fa fa-snowflake";
      desc = "Snow";
      break;
    case 95:
    case 96:
    case 99:
      main_icon= "fa fa-cloud-bolt";
      desc = "Thunderstorm";
      break;
  }
  if(!hour && hour != 0){
    if (sun) {
      document.documentElement.style.setProperty("--background", "linear-gradient(to bottom, #57c1eb 0%,#246fa8 100%)");
    } else {
      document.documentElement.style.setProperty("--background", "linear-gradient(to bottom, #20202c 0%,#515175 100%)");
    }
    if(sunset){
      document.documentElement.style.setProperty("--background", "linear-gradient(to bottom, #071B26 0%,#071B26 30%,#8A3B12 80%,#240E03 100%)");
    }
    if(sunrise){
      document.documentElement.style.setProperty("--background", "linear-gradient(to bottom, #757abf 0%,#8583be 60%,#eab0d1 100%)");
    }
  }
  return [main_icon,desc];
}
function hourly_weather(){
  let date = new Date();
  date.setDate(date.getUTCDate() + (window.selected_card - 2));
  let month, day;
  month = date.getUTCMonth() + 1;
  day = date.getUTCDate();
  let week_day = get_day_name(date.getUTCDay());
  if (window.current_hour > 24) {
    window.current_hour -= 24;
    day++;
    week_day = get_day_name(date.getUTCDay() + 1);
    if (day == 32 && [1, 3, 5, 7, 8, 10, 12].includes(month)) {
      month++;
      day = 1;
    }
    if (day == 31 && [4, 6, 9, 11].includes(month)) {
      month++;
      day = 1;
    }
    if (day == 29 && month == 2 && date.getFullYear() % 4 != 0) {
      month++;
      day = 1;
    }
    if (day == 30 && month == 2 && date.getFullYear() % 4 == 0) {
      month++;
      day = 1;
    }
    if (month == 13) {
      month = 1;
    }
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  document.querySelector(".hourly_weather h2").innerText = day+"-"+month+"-"+date.getFullYear()+" - "+week_day;
  let hourly_weather = window.weather.hourly;
  let weather_codes = hourly_weather.weathercode.slice((window.selected_card*24),(window.selected_card*24)+25);
  let temps =  hourly_weather.temperature_2m.slice((window.selected_card*24),(window.selected_card*24)+25);
  for(let i = 0; i <= 24;i++){
    let li = document.createElement("li");
    let li_hour = i;
    if (li_hour < 10) {
      li_hour = "0" + li_hour;
    }
    let weather_code_response = use_weather_code(weather_codes[i],i);
    let icon = weather_code_response[0];
    let desc = weather_code_response[1];
    li.innerHTML = `${li_hour}:00<br/><i class="${icon}"></i><br/>${desc} : ${temps[i]}\u00B0C`;
    document.querySelector("ul").appendChild(li);
  }
}
function clear_hourly(){
  document.querySelector(".hourly_weather h2").innerHTML = '';
  document.querySelector(".hourly_weather h3").innerHTML = '';
  document.querySelector(".hourly_weather ul").innerHTML = '';
}