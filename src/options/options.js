document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get("defaultParams", function(result) {
    var params = result.defaultParams ? JSON.parse(result.defaultParams) : {
      clientOptimizations: "true",
      nocdn: "false"
    };
    for (var param in params) {
        params[param] = new Param(param, allParams[param] && allParams[param].description || "", params[param], true);
    }
    buildTable($("#params-table"), params, true);      
  });
});

document.querySelector("form").addEventListener("submit", function(e) {
  e.preventDefault();
  chrome.storage.local.set({
    defaultParams: JSON.stringify(getParams($("#params-table")))
  });
});