$(document).ready(function() {
  $("#search-btn").on("click", function() {
    var searchValue = $("#search-query").val();
    // clear input box
    $("#search-query").val("");

    console.log(searchValue);
  });
});
