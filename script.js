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
        getFullCurrentData(response);
        fiveForecast(city);
        addCity(city);
    });
});



function getFullCurrentData(response) {
    console.log(response);
    let cityName = response.name;
    let todayDate = moment(new Date()).format("MM/DD/YYYY");
    let weatherIcon = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
    let temp = response.main.temp;
    let humidity = response.main.humidity;
    let windSpeed = response.wind.speed;
    let lon = response.coord.lon;
    let lat = response.coord.lat;

    $("#currCity").text(cityName);
    console.log(cityName);
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

function fiveForecast(city) {

    $("#fivedays").empty();

    var forcastURL = `${proxy}api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&APPID=${APIkey}`

    $.ajax({
        url: forcastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        let forecastData = response.list;
        for (var i = 0; i < forecastData.length; i += 8) {
            console.log(forecastData[i])
            let colDiv = $("<div class='col-sm' </div>");
            let cardDiv = $("<div class='card' </div>");
            let cardBodyDiv = $("<div class='card-body' </div>");
            cardDiv.append(cardBodyDiv);
            colDiv.append(cardDiv);
            $("#fivedays").append(colDiv);

            let futureDate = response.list[i].dt_txt.split(" ")[0];
            let dateDiv = $("<div class='forcast-date' </div>");
            let date = moment(futureDate).format("MM/DD/YYYY");
            dateDiv.text(date);
            cardBodyDiv.append(dateDiv)
            console.log(date)

            let imgEl = $("<img>");
            let weatherIcon = `http://openweathermap.org/img/w/${forecastData[i].weather[0].icon}.png`
            imgEl.attr("src", weatherIcon)
            cardBodyDiv.append(imgEl)
            console.log(weatherIcon)

            let temp = forecastData[i].main.temp;
            let tempDiv = $("<div> class='temp-dev' </div>");
            tempDiv.text("Temp: " + temp + " °F");
            cardBodyDiv.append(tempDiv)
            console.log(temp)

            let humidity = forecastData[i].main.humidity;
            let humidDiv = $("<div> class='humid-dev' </div>");
            humidDiv.text("Humidity: " + humidity + "%");
            cardBodyDiv.append(humidDiv);

        }
    })
}

function addCity(city) {
    let cityListEl = $("<li class='list-group-item active'>" + city + "</li>")
    cityListEl.on("click", function (event) {
        event.preventDefault();
        var queryURL = `${proxy}api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${APIkey}`;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            getFullCurrentData(response);
            fiveForecast(city);
            
        });
    })
    $("#cityList").append(cityListEl)
}

