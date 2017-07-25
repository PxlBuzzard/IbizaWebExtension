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

	document.getElementById('toggle-debug').addEventListener('click', toggleDebugModeEvent);
});
