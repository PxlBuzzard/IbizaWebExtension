var baseUrl, params, anchor;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  // get current base url, params, and anchor
  var parts1 = tabs[0].url.split("#");
  anchor = parts1.length > 1 ? parts1[1] : "";
  var parts2 = parts1[0].split("?");
  baseUrl = parts2[0];
  var query = parts2.length > 1 ? parts2[1] : "";
  params = parseQueryString(query);

  // add suggested params if not present
  getDefaults(function(defaults) {
    for (var param in defaults) {
      params[param] = params[param] || defaults[param];
    }
    buildTable($("#params-table"), params);
  });
});

// apply button listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("apply").addEventListener("click", function() {
    var params = getParams($("#params-table"));
    var query = "";

    for (var param in params) {
      query += "&" + param + "=" + params[param];
    }

    chrome.tabs.update({ url: baseUrl +
      (query ? "?" + query.substring(1) : "") +
      (anchor ? "#" + anchor : "") });
  });
});

function parseQueryString(query) {
  var result = {};
  if (query) {
    query.split("&").forEach((keyValuePair) => {
      var parts = keyValuePair.split("="),
          param = decodeURIComponent(parts[0]),
          value = decodeURIComponent(parts[1]);
      result[param] = new Param(param, allParams[param] && allParams[param].description || "", value, true);
    });
  }

  return result;
}
