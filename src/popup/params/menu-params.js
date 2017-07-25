var url;
var params = {};

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  url = new Url(tabs[0].url);

  // start with existing params
  for (param in url.params) {
    params[param] = new Param(param, allParams[param] && allParams[param].description || "", url.params[param], true); // todo get description from allParams if exists
  }

  // add suggested params if not present
  params.clientOptimizations = params.clientOptimizations || new Param("clientOptimizations", "The parameter that determines whether optimizations should be enabled.", "true");
  params.nocdn = params.nocdn || new Param("nocdn", "The parameter to set the value of the cookie that determines whether CDN is enabled for the application.", "false");

  // build table
  var tbody = document.getElementById("params-table").getElementsByTagName("tbody")[0];

  for (param in params) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = params[param].set;
      var tdCheckbox = document.createElement("td");
      tdCheckbox.appendChild(checkbox);

      var name = document.createElement("input");
      name.type = "text";
      name.value = params[param].name;
      var tdName = document.createElement("td");
      tdName.appendChild(name);

      var value = document.createElement("input");
      value.type = "text";
      value.value = params[param].value;
      var tdValue = document.createElement("td");
      tdValue.appendChild(value);

      var tr = document.createElement("tr");
      tr.appendChild(tdCheckbox);
      tr.appendChild(tdName);
      tr.appendChild(tdValue);

      tbody.appendChild(tr);
  }
});

// apply button listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("apply").addEventListener("click", function() {
    var rows = document.getElementById("params-table")
                       .getElementsByTagName("tbody")[0]
                       .getElementsByTagName("tr");
    for (var i = 0; i < rows.length; ++i) {
        var cells = rows[i].getElementsByTagName("td");
        var name = cells[1].getElementsByTagName("input")[0].value;
        var value = cells[2].getElementsByTagName("input")[0].value;
        url.setParam(name, value);
    }

    chrome.tabs.update({ url: url.url });
  });
});

function Url(url) {
  this.url = url;
  var parts1 = url.split("#");
  this.anchor = parts1.length > 1 ? parts1[1] : "";
  var parts2 = parts1[0].split("?");
  this.base = parts2[0];
  this.query = parts2.length > 1 ? parts2[1] : "";
  this.params = parseQueryString(this.query);

  this.setParam = function(paramToSet, value) {
    this.params[paramToSet] = value;
    var query = "";
    for (param in this.params) {
      query += "&" + param + "=" + this.params[param];
    }
    this.query = query.substring(1);
    this.url = this.base + "?" + this.query + "#" + this.anchor;
  }
}

function parseQueryString(query) {
    var result = {};
    (query || "").split("&").forEach((keyValuePair) => {
        var parts = keyValuePair.split("=");
        result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
    });
    return result;
}