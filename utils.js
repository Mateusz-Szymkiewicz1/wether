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

function use_weather_code(weather_code) {
    const main_icon = document.querySelector("#main_icon");
    const desc = document.querySelector(".desc");
    let sunrise_time = window.sunrise.substr(window.sunrise.length - 5);
    let sunset_time = window.sunset.substr(window.sunrise.length - 5);
    let sunrise_minutes = parseInt(sunrise_time.split(":")[1]);
    let sunrise_hours = parseInt(sunrise_time.split(":")[0]);
    let sunset_minutes = parseInt(sunset_time.split(":")[1]);
    let sunset_hours = parseInt(sunset_time.split(":")[0]);
    let sun = true;
    if(window.current_hour < sunrise_hours || window.current_hour > sunset_hours){
        sun = false;
    }
    if(window.current_hour == sunrise_hours && window.current_min < sunrise_minutes){
        sun = false;
    }
    if(window.current_hour == sunset_hours && window.current_min > sunset_minutes){
        sun = false;
    }
    switch (weather_code) {
        case 0:
            if(sun){
                main_icon.className = "fa fa-sun";
            }else{
                main_icon.className = "fa fa-moon";
            }
            desc.innerText = "Clear sky";
            break;
        case 1:
        case 2:
        case 3:
            if(sun){
                main_icon.className = "fa fa-cloud";
            }else{
                main_icon.className = "fa fa-cloud-moon";
            }
            desc.innerText = "Cloudy";
            break;
        case 45:
        case 48:
            main_icon.className = "fa fa-smog";
            desc.innerText = "Fog";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            main_icon.className = "fa fa-umbrella";
            desc.innerText = "Drizzle";
            break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            if(sun){
                main_icon.className = "fa fa-cloud-rain";
            }else{
                main_icon.className = "fa fa-cloud-moon-rain";
            }
            desc.innerText = "Deszcz";
            break;
        case 85:
        case 86:
        case 71:
        case 73:
        case 75:
        case 77:
            main_icon.className = "fa fa-snowflake";
            desc.innerText = "Snow";
            break;
        case 95:
        case 96:
        case 99:
            main_icon.className = "fa fa-cloud-bolt";
            desc.innerText = "Thunderstorm";
            break;
    }
}
function capitalize(str){
    str = str.toLowerCase();
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
}
function save_city(){
    localStorage.setItem("wether_city", window.city);
}