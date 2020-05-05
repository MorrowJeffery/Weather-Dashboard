//globals
let history = [];
let firstTimeStarted = true;

//functions
function getWeather(city) {
    var apiKey = "fc859225f76daa869e5269c0e70f1e5e";
    var weatherurl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${apiKey}`
    $.ajax({
        url: weatherurl,
        method: "GET"
      }).then(function(response) {
            generateWeather(response);
            generateForecast(response, firstTimeStarted);
})
}

function genHistory(city) {
    history.push(city);
    showHistory(history);
}

function showHistory(historyData) {
    $("#history-container").empty();
    historyData.forEach(historyItem => {
        var btn = $("<button>").addClass("historyBtn").text(historyItem);
        var br = $("<br>");
        btn.attr("value", historyItem);
        $("#history-container").append(btn, br);    
    })
}

function generateWeather(data) {
    $("#currentWeather").empty();
    console.log(data);
    var temp = data.list[0].main.temp;
    var humid = data.list[0].main.humidity
    var city = data.city.name
    var cityH1 = $("<h2>").text(city + ": " + moment().format('MMM Do YY') + " " );
    var humidity = $("<p>").text("Humidity: " + humid + "%");
    var temperature = $("<p>").text("Temperature: " + convertToF(temp) + "F");
    var windSpeed = $("<p>").text("Wind Speed: " + data.list[0].wind.speed);
    var icon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);
    $("#currentWeather").append(cityH1, icon, temperature, humidity, windSpeed);
}


function generateForecast(data, firstTime) {
    var today = moment();
    var time = today.format('HH');
    var numOfElementsToday = (time / 3);
    var dayPointer = 5;
    for (var i = 0; i < 5; i++) {
        var weather = convertToF(data.list[dayPointer].main.temp);
        var humidity = data.list[dayPointer].main.humidity;
        var date = moment().add((i + 1), 'day').format('l').slice(0,7);
        var icon = data.list[i].weather[0].icon;
        //format('MMM Do YY')
        dayPointer+= 7;
        generateCards(weather, humidity, date, (i + 1), icon);
    }
    //if this is first time this function has run, change the visibility (starts as hidden)
    if (firstTime) {
        changeVisibility();
        firstTimeStarted = false;
    }
}

//generate cards
function generateCards(temp, humidity, date, card, iconCode) {
    $(`.weathercard${card}`).empty();
    var tp = $("<p>").text("Temp: " + temp + "F").addClass("card-text");
    var hc = $("<p>").text("humidity: " + humidity + "%").addClass("card-text");
    var dc = $("<h5>").text(date).addClass("card-title");
    var br = $("<br>");
    var icon = $("<img>").attr("src", `http://openweathermap.org/img/wn/${iconCode}@2x.png`)
    $(`.weathercard${card}`).append(dc,icon,tp,hc);
}

//changes the visibility of forecast cards
function changeVisibility() {
    document.getElementById("forecast1").style.visibility = "visible";
    document.getElementById("forecast2").style.visibility = "visible";
    document.getElementById("forecast3").style.visibility = "visible";
    document.getElementById("forecast4").style.visibility = "visible";
    document.getElementById("forecast5").style.visibility = "visible";

    document.getElementById("innerDiv1").style.visibility = "visible";
    document.getElementById("innerDiv2").style.visibility = "visible";
    document.getElementById("innerDiv3").style.visibility = "visible";
    document.getElementById("innerDiv4").style.visibility = "visible";
    document.getElementById("innerDiv5").style.visibility = "visible";

    document.getElementById("fivedayforecast").style.visibility = "visible";
}

//converts to degress f
function convertToF(kelvin) {
    return ((kelvin * (1.8) - 459.67).toFixed(2));
}

//events
$(document).on("click", function(event) {
    if ($(event.target).attr("id") == "subBTN") {
        var city = $("#citySearch").val();
        getWeather(city);
        genHistory(city);
    }
    else if ($(event.target).attr("class") == "historyBtn") {
        getWeather($(event.target).attr("value"));
    }
})

//list.weather.icon for the icon