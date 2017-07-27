// Returns the environments object from the store
function getEnvironments(callback) {
  chrome.storage.sync.get("environments", function(result) {
    var environments;
    try {
      environments = JSON.parse(result.userSessions);
    } catch (ex) {
      environments = undefined;
    }
    callback(environments);
  });
}

// Puts the environments object in the store
function storeEnvironments(environments, callback = undefined) {
  chrome.storage.sync.set({"environments": JSON.stringify(environments)}, callback);
}

// Gets the currently logged in user's information from the active tab
function getCurrentUser(callback) {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "getCurrentUser"}, callback);
  });
}

function launchUserSession(username, password, targetUrl) {
    console.log(username);
    console.log(password);
    console.log(targetUrl);
    var url = "http://localhost:3000/createBrowser/";

    if (username && password && targetUrl) {
      url =  url + encodeURIComponent(username) + "/" + encodeURIComponent(password) + "/" + encodeURIComponent(targetUrl);

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", url, false );
      xmlHttp.send( null );
      console.log(xmlHttp.responseText);
    } else {
      alert("Invalid inputs");
    }
}

function clickHandler(click) {
  var button = click.target;
  switch (button.id) {
    case "createUserSessionButton": launchUserSession(); break;
    default: break;
  }
}

document.addEventListener("click", clickHandler);
