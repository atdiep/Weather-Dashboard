const APIkey = "7355be66530e4602bd067e7287df0297";
const proxy = "https://cors-anywhere.herokuapp.com/"

$("#find-city").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim();
    var queryURL = `${proxy}api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${APIkey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        getFullCurrentData();
    });
});



function getFullCurrentData(response) {
    let cityName = response.name;
    let todayDate = moment(new Date()).format("MM/DD/YYYY");
    let weatherIcon = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    let temp = response.main.temp;
    let humidity = response.main.humidity;
    let windSpeed = response.wind.speed;
    let lon = response.coord.lon;
    let lat = response.coord.lat;

    $("#currCity").text(cityName);
    $("#today").text(todayDate);
    $("#currWeatherIcon").attr('src', weatherIcon);
    $("#currWeatherIcon").attr('alt', 'Current Weather Icon');
    $("#currTemp").text(temp);
    $("#currHumid").text(humidity);
    $("#currWind").text(windSpeed);

    getUVIndex(lon, lat);

}

function getUVIndex(lon, lat) {
    var UVIURL = `${proxy}api.openweathermap.org/data/2.5/uvi?appid=${APIkey}&lat=${lat}&lon=${lon}`

    $.ajax({
        url: UVIURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let UVIndex = response.value;
        $("#currUVI").text(UVIndex);
        if (UVIndex < 3) {
            $("#currUVI").addClass("uv-low");
        } else if (UVIndex < 6) {
            $("#currUVI").addClass("uv-mod");
        } else if (UVIndex < 8) {
            $("#currUVI").addClass("uv-high");
        } else if (UVIndex < 11) {
            $("#currUVI").addClass("uv-vhigh");
        } else {
            $("#currUVI").addClass("uv-extreme")
        }
    });
};

function fiveForecast() {
    var forcastURL = `${proxy}api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${APIkey}`

    $.ajax({
        url: forcastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    })
}
