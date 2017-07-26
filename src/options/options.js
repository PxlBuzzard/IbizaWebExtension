document.addEventListener("DOMContentLoaded", function() {
  getDefaults(function(params) {
    buildTable($("#params-table"), params);
  }, true);
  getTestExtensions(function(extensions) {
    $("#test-extensions").val(extensions);
  });
});

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  storeDefaults(getParams($("#params-table")));
  storeTestExtensions($("#test-extensions").val());
});