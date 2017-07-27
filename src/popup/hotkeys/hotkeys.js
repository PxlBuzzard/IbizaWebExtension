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
		var btn1 = document.getElementById('download-perf-data');
		var btn2 = document.getElementById('download-debug-info');
		if(btn1.classList.contains('pure-button-disabled')) {
			btn1.classList.remove('pure-button-disabled');
			btn2.classList.remove('pure-button-disabled');
		} else {
			btn1.classList.add('pure-button-disabled');
			btn2.classList.add('pure-button-disabled');
		}
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
