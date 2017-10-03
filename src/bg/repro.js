const exclude = /(portal\.azure\.com)|(df\.onecloud\.azure-test\.net)/;
let inProgress = false;

// Call is a dictionary of type: (requestId) -> {request: {}, response: {}}
let calls = {};
let screenshots = [];

function getHeaderValue(headers, name) {
    const header = headers.find(function(h) { return h.name === name; });
    return header && header.value;
}

function beforeRequestListener(details) {
    if (!exclude.test(details.url)) {
        const request = {
            method: details.method,
            timeStamp: details.timeStamp,
            url: details.url,
            requestBody: JSON.stringify(details.requestBody)
        };

        calls[details.requestId] = {request: request, response: null};
    }
}

function onRequestListener(details) {
    if (!exclude.test(details.url)) {
        calls[details.requestId].request.requestHeaders = details.requestHeaders;
    }
}

function successListener(details) {
    console.log(details.url, details);
    if (!exclude.test(details.url)) {
        const response = {
            method: details.method,
            statusCode: details.statusCode,
            statusLine: details.statusLine,
            timeStamp: details.timeStamp,
            url: details.url,
            requestId: getHeaderValue(details.responseHeaders, "request-id"),
            clientRequestId: getHeaderValue(details.responseHeaders, "client-request-id"),
            date: getHeaderValue(details.responseHeaders, "Date")
        };

        calls[details.requestId].response = response;
    }
}

function start(tabId) {
    inProgress = true;
    calls = {};
    screenshots = [];

    chrome.webRequest.onBeforeRequest.addListener(
        beforeRequestListener,
        {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId },
        ["requestBody"]);

    chrome.webRequest.onBeforeSendHeaders.addListener(
        onRequestListener,
        {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId },
        ["requestHeaders"]);   

    chrome.webRequest.onCompleted.addListener(
        successListener,
        {urls: ["<all_urls>"], types: ["xmlhttprequest"], tabId: tabId },
        ["responseHeaders"]); 
};

function addScreenshot(screenshot) {
    screenshots.push(screenshot);
}

function end(sendResponse) {
    inProgress = false;
    chrome.webRequest.onCompleted.removeListener(onRequestListener);
    chrome.webRequest.onCompleted.removeListener(beforeRequestListener);
    chrome.webRequest.onCompleted.removeListener(successListener);

    let sessionCalls = Object.keys(calls).map(function(key){
        return calls[key];
    });

    sendResponse({ calls: sessionCalls, screenshots: screenshots });
};

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.name) {
        case "reproStart": start(message.tabId); break;
        case "reproScreen": addScreenshot(message.screenshot); break;
        case "reproEnd":
            end(sendResponse);
            break;
        case "reproStatus": sendResponse(inProgress); break;
    }
});