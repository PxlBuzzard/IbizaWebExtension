// Returns a Map of user sessions
function getUserSessions(callback) {
  chrome.storage.local.get("userSessions", function(result) {
    var users;
    try {
      users = new Map(JSON.parse(result.userSessions));
    } catch (ex) {
      users = new Map();
    }
    callback(users);
  });
}

function setUserSessions(users, callback = null) {
  chrome.storage.local.set({"userSessions": JSON.stringify(Array.from(users.entries()))}, function() {
    if (callback) { callback() }
  });
}

function saveUserSession() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "saveUserSession"}, function(response) {
      // Check the existing list of user sessions
      getUserSessions(function(users) {
        console.log(users);

        // Add the session to the list (or overwrite it if it already exists)
        // NOTE: the key is the username (i.e. UPN/email address)
        users.set(response.username, response);

        // Put the list back in storage
        setUserSessions(users, function() {
          console.log("Saved user: " + response.username);
          window.close();
        });
      });
    });
  });
}

function loadUserSession(username) {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
    getUserSessions(function(users) {
      var user = users.get(username);
      chrome.tabs.sendMessage(currentTab.id, {eventName: "loadUserSession", userStorage: user}, function(response) {
        console.log(response);
      });
    });
  });
  //window.close();
}

function clearActiveUserSession() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "clearActiveUserSession"}, function(response) {
      console.log(response);
    });
  });
  //window.close();
}

function deleteUserSession() {
}

function deleteAllUserSessions() {
  chrome.storage.local.clear(function(e) {console.log(e)});
}

function createUserSession() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log(username);
    console.log(password);
    var url = "http://localhost:3000/createBrowser/";

    if(username && password) {
      url =  url + username + "/" + password;
    }
    else {
      Utils.getBrowserContext(function(currentTab, currentWindow) {
        chrome.tabs.sendMessage(currentTab.id, {eventName: "alertEvent", message: "Didn't specify username-password! Creating a default session!"}, 
          function(response) {
            console.log(response);
          }
        );
      });
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
}

function clickHandler(click) {
  var button = click.target;
  switch (button.id) {
    case "saveUserSessionButton": saveUserSession(); break;
    case "loadUserSessionButton": loadUserSession(button.getAttribute("data")); break;
    case "clearActiveUserSessionButton": clearActiveUserSession(); break;
    case "deleteAllUserSessions": deleteAllUserSessions(); break;
    case "createUserSessionButton": createUserSession(); break;
    default: console.error(`Unknown button name "${button.id}"`); break;
  }
}

document.addEventListener("click", clickHandler);
