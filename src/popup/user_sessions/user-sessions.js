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
      console.log("Communication with content script succeeded for loadUserSession.");
    });
  });
  //window.close();
};

clearUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
  });
  //window.close();
};

clickHandler = function(click) {
  var button = click.target;
  if (button.id === "saveUserSessionButton") {
    saveUserSession();
  } else if (button.id === "loadUserSessionButton") {
    loadUserSession();
  } else if (button.id === "clearUserSessionButton") {
    clearUserSession();
  }
};

document.addEventListener("click", clickHandler);
