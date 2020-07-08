$(document).ready(function () {
  $("#search-btn").on("click", function () {
    var search = $("#search-query").val();
    // clear search box
    $("#search-query").val("");

    makeRow(search);
  });

  $("#list-tab").on("click", "a", function () {
    console.log($(this).text())
  });

  function makeRow(search) {
    var aTag = $("<a>").addClass("list-group-item list-group-item-action").attr({ "id": search, "role": "list", "aria-controls": search, "data-toggle": "list" }).text(search);
    $("#list-tab").append(aTag);
  }

});
