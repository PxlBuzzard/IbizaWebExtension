saveLocalStorage = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
    chrome.tabs.sendMessage(currentTab.id, {eventName: "saveUserSession"}, function(response) {
      console.log(response);

      var user = new User();
      user.setLocalStorage(response.localStorage);
      user.setSessionStorage(response.sessionStorage);
      user.setCookieStorage(response.cookie);

      var userStorage = window.localStorage.getItem('userStorage');
      if (userStorage == null){
        window.localStorage.setItem('userStorage', [user]);
      } else {
        window.localStorage.setItem('userStorage', userStorage.push(user));
      }
    });
  });
};

loadLocalStorage = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
    chrome.tabs.sendMessage(currentTab.id, {eventName: "loadUserSession", userStorage: window.localStorage.getItem('userStorage')}, function(response) {
      console.log("Communication with content script succeeded for loadUserSession.");
    });
  });
  //window.close();
};

clearLocalStorage = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    // TODO: do stuff with tab and window
  });
  //window.close();
};

clickHandler = function(click) {
  var button = click.target;
  if (button.id === "saveLocalStorageButton") {
    saveLocalStorage();
  } else if (button.id === "loadLocalStorageButton") {
    loadLocalStorage();
  } else if (button.id === "clearLocalStorageButton") {
    clearLocalStorage();
  }
};

document.addEventListener("click", clickHandler);
