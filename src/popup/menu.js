function createBug()
{
  var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
  gettingActiveTab.then((tabs) => {
    console.log("Sending message to create bug");
    browser.tabs.sendMessage(tabs[0].id, {eventName: "createNewBug"}, function(response) {
      console.log(`Response (create bug): ${response.status} - ${response.message}`);
    });
  });
}

window.onload = function() {
  document.getElementById('create-bug').addEventListener("click", createBug);
};
