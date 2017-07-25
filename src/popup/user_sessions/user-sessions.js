saveLocalStorage = function() {
  a = new User();
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    console.log(currentTab);
    console.log(currentWindow);

    // TODO: do stuff with tab and window
  });

  sessionStorage.set()
  window.close();
};

loadLocalStorage = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    console.log(currentTab);
    console.log(currentWindow);

    // TODO: do stuff with tab and window
  });
  window.close();
};

clearLocalStorage = function() {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    console.log(currentTab);
    console.log(currentWindow);

    // TODO: do stuff with tab and window
  });
  window.close();
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

document.addEventListener('click', clickHandler);
