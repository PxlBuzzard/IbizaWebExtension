var redirects = {};

function redirectListener(details) {
    var newUrl = details.url;
    for (var url in redirects) {
        from = url.slice(0, -2); // remove the /*
        if (details.url.includes(from)) {
            var to = redirects[url].slice(0, -2);
            newUrl = details.url.replace(from, to);
        }
    }

    return { redirectUrl: newUrl };
}

function setRedirects(redirectsToSet) {
    chrome.webRequest.onBeforeRequest.removeListener(redirectListener);

    if (redirectsToSet) {
        redirects = {};
        for (var src in redirectsToSet) {
            var dst = redirectsToSet[src];
            if (!src.startsWith("https://")) {
                redirects[normalize(src, "http://")] = normalize(dst, "http://");
            }
            if (!src.startsWith("http://")) {
                redirects[normalize(src, "https://")] = normalize(dst, "https://");
            }
        }

        chrome.webRequest.onBeforeRequest.addListener(
            redirectListener,
            { urls: Object.keys(redirects) },
            ["blocking"]);
    }
}

function normalize(url, protocol) {
    if (protocol && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = protocol + url;
    }
    if (url.endsWith("/*")) { return url; }
    if (url.endsWith("/")) { return url + "*"; }
    return url + "/*";
}

function getRedirectsForEnvironment(environment) {
    const key = 'env_' + environment.currentActiveEnvironment;
    chrome.storage.sync.get(key, function(env) {
        setRedirects(JSON.parse(env[key] || "{}").url);
    });
}

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request === "update-redirects")
      chrome.storage.sync.get("currentActiveEnvironment", getRedirectsForEnvironment);
  });

/// Startup code
chrome.storage.sync.get("currentActiveEnvironment", getRedirectsForEnvironment);
