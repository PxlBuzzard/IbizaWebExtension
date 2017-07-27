/*
  Code for browser compatibility
*/

$(document).ready(function () {
  /*------------------------------------------------------------------------------------------*/

  toggleDebugModeEvent = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {eventName: "toggleDebug"}, function(response) {
        console.log(response);
      });
    });
  };

  toggleDebugButtons = function() {
    $('#download-perf-data').toggle();
    $('#download-debug-info').toggle();
  };

  document.getElementById('toggle-debug').addEventListener('click', toggleDebugModeEvent);
  document.getElementById('toggle-debug').addEventListener('click', toggleDebugButtons);

  downloadDebugInfo = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {eventName: "downloadDebugInfo"}, function(response) {
        console.log(response);
      });
    });
  };

  document.getElementById('download-debug-info').addEventListener('click', downloadDebugInfo);

  downloadPerfDataEvent = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {eventName: "downloadPerfData"}, function(response) {
        console.log(response);
      });
    });
  };

  document.getElementById('download-perf-data').addEventListener('click', downloadPerfDataEvent);

});
