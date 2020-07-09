$(document).ready(function () {

  var key = "3e86ecd706ea3fa8f9a5cdead4a1ffb2";

  $("#search-btn").on("click", function () {
    var search = $("#search-query").val();
    // clear search box
    $("#search-query").val("");

    findWeather(search);
  });

  $("#list-tab").on("click", "a", function () {
    findWeather($(this).text())
  });

  function makeHistory(search) {
    var aTag = $("<a>").addClass("list-group-item list-group-item-action").attr({ "id": search, "role": "list", "aria-controls": search, "data-toggle": "list" }).text(search);
    $("#list-tab").append(aTag);
  }

  function findWeather(search) {
    $.ajax({
      type: "GET",
      url: `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${key}&units=imperial`,
      dataType: "JSON",
      success: function (weather) {

        makeHistory(search);
        // clear old data
        $("#city-header").empty();
        $("#weather-icons").empty();
        $("#weather-info").empty();
        // Add new search data
        $("#city-header").text(`${weather.name} ( ${new Date().toLocaleDateString()} )`);
        var img = $("<img>").attr("src", `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`);
        var windSpeed = $("<p>").addClass("list").text(`Wind Speed: ${weather.wind.speed} MPH`);
        var humidity = $("<p>").addClass("list").text(`Humidity: ${weather.main.humidity} %`);
        var temp = $("<p>").addClass("list").text(`Temperature: ${weather.main.temp} °F`);

        $("#weather-info").append(windSpeed, humidity, temp);
        $("#weather-icons").append(img);

        indexUV(weather.coord.lat, weather.coord.lon);
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
});
