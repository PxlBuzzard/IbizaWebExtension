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
  params.clientOptimizations = params.clientOptimizations || new Param("clientOptimizations", "The parameter that determines whether optimizations should be enabled.", "true");
  params.nocdn = params.nocdn || new Param("nocdn", "The parameter to set the value of the cookie that determines whether CDN is enabled for the application.", "false");

  // build table
  for (var param in params) {
    var $tr = $("<tr />");
    $tr.append($("<td />").append($("<input type=\"checkbox\" />").attr("checked", params[param].set)));
    $tr.append($("<td />").append($("<input type=\"text\" />").attr("value", params[param].name)));
    $tr.append($("<td />").append($("<input type=\"text\" />").attr("value", params[param].value)));
    $("#params-table > tbody").append($tr);
  }
});

// apply button listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("apply").addEventListener("click", function() {
    var rows = document.getElementById("params-table")
                       .getElementsByTagName("tbody")[0]
                       .getElementsByTagName("tr");
    var query = "";
    for (var i = 0; i < rows.length; ++i) {
        var cells = rows[i].getElementsByTagName("td");
        var active = cells[0].getElementsByTagName("input")[0].checked;
        var name = cells[1].getElementsByTagName("input")[0].value;
        var value = cells[2].getElementsByTagName("input")[0].value;
        if (active) {
          query += "&" + name + "=" + value;
        }
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