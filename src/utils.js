getBrowserContext = function(callback) {
  chrome.tabs.getSelected(function(selectedTab) {
    chrome.windows.get(selectedTab.windowId, function(selectedWindow) {
      callback(selectedTab, selectedWindow);
    });
  });
};

export default utils;