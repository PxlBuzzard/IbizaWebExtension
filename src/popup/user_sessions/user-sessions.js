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

function setUserSessions(users, callback) {
  chrome.storage.local.set({"userSessions": JSON.stringify(Array.from(users.entries()))}, function() {
    callback();
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

function loadUserSession() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
    chrome.tabs.sendMessage(currentTab.id, {eventName: "loadUserSession", userStorage: window.localStorage.getItem('userStorage')}, function(response) {
      console.log(reponse);
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

function clickHandler(click) {
  var button = click.target;
  switch (button.id) {
    case "saveUserSessionButton": saveUserSession(); break;
    case "loadUserSessionButton": loadUserSession(); break;
    case "clearActiveUserSessionButton": clearActiveUserSession(); break;
    case "deleteAllUserSessions": deleteAllUserSessions(); break;
    default: console.error(`Unknown button name "${button.id}"`); break;
  }
}

document.addEventListener("click", clickHandler);
