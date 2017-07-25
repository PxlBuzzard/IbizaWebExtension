saveUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "saveUserSession"}, function(response) {
      // Check the existing list of user sessions
      chrome.storage.local.get("userSessions", function(e) {
        users = new Map(JSON.parse(e.userSessions));
        console.log(users);
        if (typeof users !== 'Map') {
          users = new Map();
        }

        // Add the session to the list (or overwrite it if it already exists)
        // NOTE: the key is the username (i.e. UPN/email address)
        users.set(response.username, response);

        // Put the list back in storage
        chrome.storage.local.set({"userSessions": JSON.stringify(Array.from(users.entries()))}, function() {
          console.log("Saved user");

          chrome.storage.local.get("userSessions", function(e) {
            console.log(new Map(JSON.parse(e.userSessions)));
          });
        });
      });
    });
  });
};

loadUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
    chrome.tabs.sendMessage(currentTab.id, {eventName: "loadUserSession", userStorage: window.localStorage.getItem('userStorage')}, function(response) {
      console.log(reponse);
    });
  });
  //window.close();
};

clearActiveUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "clearActiveUserSession"}, function(response) {
      console.log(response);
    });
  });
  //window.close();
};

deleteUserSession = function() { //TODO
}

deleteAllUserSessions = function() {
  chrome.storage.local.clear(function(e) {console.log(e)});
}

clickHandler = function(click) {
  var button = click.target;
  switch (button.id) {
    case "saveUserSessionButton": saveUserSession(); break;
    case "loadUserSessionButton": loadUserSession(); break;
    case "clearActiveUserSessionButton": clearActiveUserSession(); break;
    case "deleteAllUserSessions": deleteAllUserSessions(); break;
    default: console.error(`Unknown button name "${button.id}"`); break;
  }
};

document.addEventListener("click", clickHandler);
