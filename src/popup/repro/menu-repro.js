function startSession() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.runtime.sendMessage({ name: "reproStart", tabId: tabs[0].id });
        document.getElementById('repro-start').disabled = true;
        document.getElementById('repro-screen').disabled = false;
        document.getElementById('repro-end').disabled = false;
    });
}
  
function addScreenshot() {
    chrome.tabs.captureVisibleTab(chrome.windows.WINDOW_ID_CURRENT, {"format": "jpeg"}, function (image) {
        chrome.runtime.sendMessage({ name: "reproScreen", screenshot: image });
    });
}

function endSession() {
    document.getElementById('repro-start').disabled = false;
    document.getElementById('repro-screen').disabled = true;
    document.getElementById('repro-end').disabled = true;
    chrome.runtime.sendMessage({ name: "reproEnd" }, function(result) {
        // TODO - use the calls to generate the bug report.
        // network requests, responses (graph calls) available via result.calls
        console.log(result.calls);
        // screenshots available via result.screenshots
        console.log(result.screenshots);
    });
}

window.onload = function() {
    chrome.runtime.sendMessage({ name: "reproStatus" }, function(inProgress) {
        document.getElementById('repro-start').addEventListener("click", startSession);
        document.getElementById('repro-screen').addEventListener("click", addScreenshot);
        document.getElementById('repro-end').addEventListener("click", endSession);
        document.getElementById('repro-start').disabled = inProgress;
        document.getElementById('repro-screen').disabled = !inProgress;
        document.getElementById('repro-end').disabled = !inProgress;
    });
};