$(document).ready(function () {

  var apiKey = "3e86ecd706ea3fa8f9a5cdead4a1ffb2";

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
      url: `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${apiKey}&units=imperial`,
      dataType: "JSON",
      success: function (weather) {

        makeHistory(search);
        // clear old data
        $("#city-header").empty();
        // Add new search data
        $("#city-header").text(`${weather.name} (${new Date().toLocaleDateString()})`);

      }
    })
  }

});
