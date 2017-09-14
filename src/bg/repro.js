const exclude = /(portal\.azure\.com)|(df\.onecloud\.azure-test\.net)/;
let inProgress = false;
let responses = [];
let screenshots = [];

function getHeaderValue(headers, name) {
    const header = headers.find(function(h) { return h.name === name; });
    return header && header.value;
}

function listener(details) {
    console.log(details.url, details);
    if (!exclude.test(details.url)) {
        responses.push({
            method: details.method,
            statusCode: details.statusCode,
            statusLine: details.statusLine,
            timeStamp: details.timeStamp,
            url: details.url,
            requestId: getHeaderValue(details.responseHeaders, "request-id"),
            clientRequestId: getHeaderValue(details.responseHeaders, "client-request-id"),
            date: getHeaderValue(details.responseHeaders, "Date")
        });
    }
}

function start(tabId) {
    inProgress = true;
    responses = [];
    screenshots = [];
    chrome.webRequest.onCompleted.addListener(
        listener,
        {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId },
        ["responseHeaders"]);
};

function addScreenshot(screenshot) {
    screenshots.push(screenshot);
}

function end(sendResponse) {
    inProgress = false;
    chrome.webRequest.onCompleted.removeListener(listener);
    sendResponse({ responses: responses, screenshots: screenshots });
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.name) {
        case "reproStart": start(message.tabId); break;
        case "reproScreen": addScreenshot(message.screenshot); break;
        case "reproEnd": end(sendResponse); break;
        case "reproStatus": sendResponse(inProgress); break;
    }
});