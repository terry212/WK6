$(document).ready(function () {
  var key = "3e86ecd706ea3fa8f9a5cdead4a1ffb2";
  var history = JSON.parse(window.localStorage.getItem("history")) || [];
  // Show weather of last item in storage
  if (history.length > 0) {
    findWeather(history[history.length-1]);
  }
  // append items in the history bar
  for (var i = 0; i < history.length; i++) {
    makeHistory(history[i]);
  }

  $("#search-btn").on("click", function () {
    var search = $("#search-query").val();
    // clear search box
    $("#search-query").val("");

    findWeather(search);
  });

  $("#list-tab").on("click", "a", function () {
    findWeather($(this).text());
  });

  function makeHistory(search) {
    var aTag = $("<a>").addClass("list-group-item list-group-item-action").attr({ "id": search, "role": "list", "aria-controls": search, "data-toggle": "list", "style": "text-transform: capitalize;" }).text(search);
    $("#list-tab").append(aTag);
  }

  function findWeather(search) {
    $.ajax({
      type: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${key}&units=imperial`,
      dataType: "JSON",
      success: function (weather) {
        // condition where the search item does not exist in the array, make the history list and store in local storage
        if (history.indexOf(search) === -1) {
          history.push(search);
          window.localStorage.setItem("history", JSON.stringify(history));
          makeHistory(search);
        }
        // clear old data
        $("#city-header").empty();
        $("#weather-icons").empty();
        $("#weather-info").empty();
        $("#forecast-cards").empty();
        // Add new search data
        $("#city-header").text(`${weather.name} ( ${new Date().toLocaleDateString()} )`);
        var img = $("<img>").attr("src", `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
        var windSpeed = $("<p>").addClass("list").text(`Wind Speed: ${weather.wind.speed} MPH`);
        var humidity = $("<p>").addClass("list").text(`Humidity: ${weather.main.humidity} %`);
        var temp = $("<p>").addClass("list").text(`Temperature: ${weather.main.temp} °F`);

        $("#weather-info").append(windSpeed, humidity, temp);
        $("#weather-icons").append(img);

        indexUV(weather.coord.lat, weather.coord.lon);
        forecast(search);
      }
    })
  }

  function indexUV(latitude, longitude) {
    $.ajax({
      type: "GET",
      url: `http://api.openweathermap.org/data/2.5/uvi?appid=${key}&lat=${latitude}&lon=${longitude}`,
      dataType: "JSON",
      success: function (UVData) {
        var pTag = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(UVData.value);
        // change button color via bootsrap class
        if (UVData.value <= 3) { btn.addClass("btn-success"); }
        else if (UVData.value <= 7) { btn.addClass("btn-warning"); }
        else { btn.addClass("btn-danger"); }
        // append UV data
        $("#weather-info").append(pTag.append(btn));
      }
    });
  }

  function forecast(search) {
    $.ajax({
      type: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${search}&appid=${key}&units=imperial`,
      dataType: "JSON",
      success: function (forecastData) {
        for (let i = 0; i < forecastData.list.length; i++) {
          // grab data of only the list that has 12 PM in the dt_txt field
          if (forecastData.list[i].dt_txt.indexOf("12:00:00") !== -1) {
            // create and append a card with forecast info
            var cardTitle = $("<h5>").addClass("card-title d-inline-block").text(new Date(forecastData.list[i].dt_txt).toLocaleDateString());
            var img = $("<img>").attr("src", `http://openweathermap.org/img/w/${forecastData.list[i].weather[0].icon}.png`);
            var windSpeed = $("<p>").addClass("card-text").text(`Wind: ${forecastData.list[i].wind.speed} MPH`);
            var humidity = $("<p>").addClass("card-text").text(`Humidity: ${forecastData.list[i].main.humidity} %`);
            var temp = $("<p>").addClass("card-text").text(`Temperature: ${forecastData.list[i].main.temp} °F`);
            var divTag = $("<div>").addClass("card col-md-9").attr({ "style": "margin-right: 5px; margin-left: 5px;" });
            var divBody = $("<div>").addClass("card-body col-md-12").attr({ "style": "padding: .25rem !important;" }).append(cardTitle.append(img), windSpeed, humidity, temp);
            $("#forecast-cards").append(divTag.append(divBody));
          }
        }
      }
    });
  }
});
