var baseUrl, params, anchor, testExtension;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  // get current base url, params, and anchor
  var halves = tabs[0].url.split("#");
  var quarters1 = halves[0].split("?");
  var quarters2 = halves.length > 1 ? halves[1].split("?") : [""];
  baseUrl = quarters1[0];
  params = parseQueryString(quarters1.length > 1 ? quarters1[1] : "");
  anchor = quarters2[0];
  testExtension = parseTestExtension(quarters2.length > 1 ? quarters2[1] : "");

  // add suggested params if not present
  getDefaults(function(defaults) {
    for (var param in defaults) {
      params[param] = params[param] || defaults[param];
    }
    buildTable($("#paramsTable"), params);
  });

  function addTestExtension(extension) {
    $("#test-extensions").append($(`<label for="${extension}" class="pure-radio"><input id="${extension}" type="radio" name="test-extension" value="${extension}" />${extension}</label>`));
  }

  if (testExtension) {
    addTestExtension(testExtension);
  }
  getTestExtensions(function(extensions) {
    if (extensions) {
      extensions = extensions.split(",");
      for (var extension of extensions) {
        extension = extension.trim();
        if ($(`input[name=test-extension][value="${extension}"]`).length < 1) {
          addTestExtension(extension);
        }
      }
    }
    $(`input[name=test-extension][value="${testExtension}"]`).prop("checked", true);
  });
});

// apply button listener
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("Apply").addEventListener("click", function() {
    var params = getParams($("#paramsTable"));
    var testEx = $("input[name=test-extension]:checked").val();

    // make sure we can modify extensions if we're sideloading
    if (testEx && !params["feature.canmodifyextensions"]) {
      params["feature.canmodifyextensions"] = "true";
    }

    // rebuild query string
    var query = "";
    for (var param in params) {
      query += "&" + param + "=" + params[param];
    }

    chrome.tabs.update({ url: baseUrl +
      (query ? "?" + query.substring(1) : "") +
      (anchor ? "#" + anchor : "") +
      (testEx ? `?testExtensions={"${testEx}":"https://localhost:44300/"}` : "") });

    // close the popup window
    window.close();
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

function parseTestExtension(testExtensions) {
  if (!testExtensions) { return ""; }

  var parts = testExtensions.split("=");
  if (parts.length < 2 || parts[0].toLowerCase() != "testextensions") { return ""; }
  var obj = JSON.parse(decodeURIComponent(parts[1]));

  return Object.keys(obj)[0] || "";
}

$("#options").click(function() {
  chrome.runtime.openOptionsPage();
})
