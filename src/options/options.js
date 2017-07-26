document.addEventListener("DOMContentLoaded", function() {
  getDefaults(function(params) {
    buildTable($("#params-table"), params);
  }, true);
});

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  storeDefaults(getParams($("#params-table")));
});