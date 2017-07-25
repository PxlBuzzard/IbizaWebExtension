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
  params.clientOptimizations = params.clientOptimizations || allParams.clientOptimizations;
  params.nocdn = params.nocdn || allParams.nocdn;

  // build table
  var $tbody = $("#params-table > tbody");
  function addRow(set, name, value) {
    $tbody.append($("<tr />")
      .append($("<td />").append($("<input type=\"checkbox\" />").attr("checked", set)))
      .append($("<td />").append($("<input type=\"text\" />").val(name)))
      .append($("<td />").append($("<input type=\"text\" />").val(value))));
  }

  // row for adding new parameters
  var $addName = $("<select />");
  var $addValue = $("<input type=\"text\" />");
  $tbody.append($("<tr />")
    .append($("<td />").append($("<button class=\"button-xsmall pure-button\">+</button>").click(function() {
      if ($addName.scombobox("val")) {
        addRow(true, $addName.scombobox("val"), $addValue.val());
        $addName.scombobox("val", "");
        $addValue.val("");
      }
    })))
    .append($("<td />").append($addName))
    .append($("<td />").append($addValue)));
  $addName.scombobox({
    data: Object.keys(allParams).map(function (param) {
      return { value: param, text: param }
    }),
    invalidAsValue: true,
    empty: true
  });
  $addName = $(".scombobox"); // scombobox init messed with the jquery object so reset it

  // rows for existing params
  for (var param in params) {
    addRow(params[param].set, params[param].name, params[param].value);
  }
});

// apply button listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("apply").addEventListener("click", function() {
    var rows = document.getElementById("params-table")
                       .getElementsByTagName("tbody")[0]
                       .getElementsByTagName("tr");
    var query = "";
    for (var i = 1; i < rows.length; ++i) {
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