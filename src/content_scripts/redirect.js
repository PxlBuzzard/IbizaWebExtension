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
    redirects = {};
    for (var url in redirectsToSet) {
        redirects[normalize(url)] = normalize(redirectsToSet[url]);
    }

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

function getRedirectsForEnvironment(environment) {
  chrome.storage.sync.get('env_' + environment, function(env) {
    setRedirects(env.url);
  });
}

/// Startup code
getRedirectsForEnvironment(chrome.storage.sync.get("currentActiveEnvironment"));
