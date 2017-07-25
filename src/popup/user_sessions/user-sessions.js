saveUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "saveUserSession"}, function(response) {
      // Check the existing list of user sessions
      chrome.storage.sync.get("users", function(users) {
        if (typeof users !== 'Map') {
          users = new Map([]);
        }

        // Add the session to the list (or overwrite it if it already exists)
        // NOTE: the key is the username (i.e. UPN/email address)
        users.set(response.username, response);
        console.log(users);

        // Put the list back in storage
        chrome.storage.sync.set(users, function() {
          console.log("Saved user");
        });
      });
    });
  });

  //window.close();
};

loadUserSession = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
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
