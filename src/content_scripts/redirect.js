var redirects = {};

function redirectListener(details) {
    var newUrl = details.url;
    for (url in redirects) {
        from = url.slice(0, -2); // remove the /*
        if (details.url.includes(from)) {
            var to = redirects[url].slice(0, -2);
            newUrl = details.url.replace(from, to);
        }
    }

    return { redirectUrl: newUrl };
}

function setRedirects(redirectsToSet) {
    redirects = {};
    for (url in redirectsToSet) {
        redirects[normalize(url)] = normalize(redirectsToSet[url]);
    }
console.log(Object.keys(redirects));
    chrome.webRequest.onBeforeRequest.removeListener(redirectListener);
    chrome.webRequest.onBeforeRequest.addListener(
        redirectListener,
        { urls: Object.keys(redirects) },
        ["blocking"]);
}

function normalize(url) {
    if (url.endsWith("/*")) { return url; }
    if (url.endsWith("/")) { return url + "*"; }
    return url + "/*";
}

// TODO get from localstorage
setRedirects({ "https://graph.microsoft-ppe.com/test_Intune_OneDF": "https://graph.microsoft.com/beta" });