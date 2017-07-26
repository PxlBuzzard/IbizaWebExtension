function Param(name, description, value, set = false) {
    this.name = name;
    this.description = description;
    this.value = value;
    this.set = set;
}

const allParams = {
  l: new Param("l", "The parameter to set the value of the locale of the request.", ""),
  mkt: new Param("mkt", "The parameter to set the value of the display language of the request.", ""),
  nocdn: new Param("nocdn", "The parameter to set the value of the cookie that determines whether CDN is enabled for the application.", ""),
  cdnIndex: new Param("cdnIndex", "The parameter to set whether or not to use the alternate CDN.", ""),
  c1: new Param("c1", "The parameter that determines the ui culture of the requested content.", ""),
  c2: new Param("c2", "The parameter that determines the culture of the requested content.", ""),
  clientOptimizations: new Param("clientOptimizations", "The parameter that determines whether optimizations should be enabled.", ""),
  sessionId: new Param("sessionId", "The parameter in HttpRequest that is uniquely generated when an extension is first-entered or refreshed.", ""),
  trustedAuthority: new Param("trustedAuthority", "The parameter that indicates the trusted authority of the parent browsing context.", ""),
  signoutError: new Param("signoutError", "The parameter that has error page to redirect to after signout.", ""),
  lastError: new Param("lastError", "The parameter that has the last error if application is running in development mode.", ""),
  root: new Param("root", "The parameter that identifies the requested bundle id of the AMD bundle.", ""),
  id: new Param("id", "The parameter that identifies the requested bundle id of the AMD bundle.", ""),
  bundlingKind: new Param("bundlingKind", "The parameter that identifies which BundlingKind to use.", ""),
  emitMap: new Param("emitMap", "The parameter that identifies whether the bundle map should be emitted.", ""),
  emitPartitioning: new Param("emitPartitioning", "The parameter that identifies whether the bundle paritioning info should be emitted.", ""),
  pageVersion: new Param("pageVersion", "The parameter that identifies the version of the page.", ""),
  shellVersion: new Param("shellVersion", "The parameter that identifies the version of the shell.", ""),
  defaultCloudName: new Param("defaultCloudName", "The parameter that identifies the default cloud name.", ""),
  traceStr: new Param("traceStr", "The parameter that identifies the serialized trace strings.", ""),
  trace: new Param("trace", "The parameter that identifies the traces that are enabled in the portal.", ""),
  clientDevelopmentMode: new Param("clientDevelopmentMode", "The parameter that determines whether development mode should be enabled in client-side code.", ""),
  extensionName: new Param("extensionName", "The parameter that identifies the name of the extension.", ""),
  enableAnimations: new Param("enableAnimations", "The parameter that identifies if to enable animations.", ""),
  retryAttempt: new Param("retryAttempt", "The parameter that determines if this is a retry attempt.", ""),
  healthCheck: new Param("healthCheck", "A parameter that signifies that this request is being used to perform a health check of the portal.", ""),
  defaultCacheEvictionDelay: new Param("defaultCacheEvictionDelay", "A value in milliseconds, specifying the eviction delay for client-side caches configured with extendEntryLifetimes: true", ""),
  redirectTo: new Param("redirectTo", "A value indicating which page version the request was redirected to.", ""),
  redirectTs: new Param("redirectTs", "A value indicating the timestamp of when the page redirect was issued.", ""),
  cacheability: new Param("cacheability", "A value indicating the cacheability of the extension home page.", ""),
  flight: new Param("flight", "A value indicating the flight of the extensions in the portal.", ""),
  enableExtensionFlights: new Param("enableExtensionFlights", "A value indicating whether extension flights are enabled.", ""),
  Referrer: new Param("Referrer", "A value indicating the referrer URI.", ""),
  region: new Param("region", "A value indicating the portal region.", ""),
  cacheVersion: new Param("cacheVersion", "A value that can be changed to cache bust extensions.", ""),
  webFonts: new Param("webFonts", "A value to bypass using local system fonts and jump directly to downloaded fonts.", ""),
  storagepolyfill: new Param("storagepolyfill", "A value indicating if polyfilling web storage is needed.", ""),
  sdkVersion: new Param("sdkVersion", "A value indicating the SDK version. This value is passed to extensions.", "")
};

function buildTable($table, initParams) {
  $table.append($("<thead><tr><th>&#10003;</th><th>Parameter</th><th>Value</th></tr></thead>"));
  var $tbody = $("<tbody />");
  $table.append($tbody);

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
    .append($("<td />").append($("<button id=\"addButton\" class=\"button-xsmall pure-button\">+</button>").click(function() {
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
  for (var param in initParams) {
    addRow(initParams[param].set, initParams[param].name, initParams[param].value);
  }
}

function getParams($table) {
  var params = {};
  $table.find("tbody").find("tr").each(function () {
    var $cells = $(this).children();
    var $checkbox = $cells.eq(0).find("input");
    if ($checkbox.length > 0 && $checkbox[0].checked) {
      params[$cells.eq(1).find("input").val()] = $cells.eq(2).find("input").val();
    }
  });

  return params;
}

function storeDefaults(params) {
  chrome.storage.local.set({
    defaultParams: JSON.stringify(params)
  });
}

function getDefaults(callback, active = false) {
  chrome.storage.local.get("defaultParams", function(result) {
    var params;
    if (result.defaultParams) {
      params = JSON.parse(result.defaultParams);
    } else {
      params = { clientOptimizations: "true", nocdn: "false" }; // default defaults
      storeDefaults(params);
    }
    for (var param in params) {
        params[param] = new Param(param, allParams[param] && allParams[param].description || "", params[param], active);
    }

    callback(params);
  });
}

function storeTestExtensions(extensions) {
  chrome.storage.local.set({
    testExtensions: extensions
  });
}

function getTestExtensions(callback) {
  chrome.storage.local.get("testExtensions", function(result) {
    callback(result.testExtensions);
  });
}