function createBug()
{
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    console.log("Sending message to create bug dialog.");
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {"format": "jpeg"}, function (image) {
      chrome.tabs.sendMessage(tabs[0].id, {eventName: "createNewBug", screenshot: image }, function(response) {
        console.log(`Response (create bug): ${response.status} - ${response.message}`);
        window.close();
      });
    });
  })
}

function onCaptured(imageUri) {
  console.log(imageUri);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

window.onload = function() {
  document.getElementById('create-bug').addEventListener("click", createBug);  
};
