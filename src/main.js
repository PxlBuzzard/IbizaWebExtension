chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.toggleDebug)
    {
	  var keyEvent = new KeyboardEvent("keydown", {key : "d", char : "D", ctrlKey: true, altKey: true, keyCode: 68});
	  document.dispatchEvent(keyEvent);
	  sendResponse({message: "Toggled Debug mode"});
	}
  }
);
