const clientSecret = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiI2YmNkMmQxMC1mMDQxLTQzMmYtYjJjOS1lMmYxZjNhYzE2YzIiLCJjc2kiOiI1NTEyOTBmYy1jNjY1LTQ1OGMtYTA5Yy0yY2ZmNjU1MGY2OTYiLCJuYW1laWQiOiI0YjY3OTE1Zi1kMjM3LTQ1YmUtYjZmZS1iMTM3MmNlMWVlMWUiLCJpc3MiOiJhcHAudnNzcHMudmlzdWFsc3R1ZGlvLmNvbSIsImF1ZCI6ImFwcC52c3Nwcy52aXN1YWxzdHVkaW8uY29tIiwibmJmIjoxNTA3MDc5Mzc4LCJleHAiOjE2NjQ4NDU3Nzh9.HXRI6mKKNG0AmxciwPRnZ_fk5m7yVkevYZpprKpvLxTPLXOB4Faf12GnUQV04O2pPqq6PvJivyzmGFHvoszba2ggmlT5bavdJgSHMI29iIt-yUXK6qz-ma3g9Hm66VAmEpPXOo8Qzh7Wtks7wvPG-O6DRFasDe-bVL-SYyJ_BTHqE45oEWrCtix3YToHCj_yj_LWFW7k_EInkNsHst8UoCrcWeOMcj6H08xXORgXVzYV4hiPeJ6k1a5ERqlL3YitDNXEveZYidB57xvgueunfBb4GerCJPez1wPG6QqWpCMiqvFTwDsM-MiIBDPSUaA8y9dA6vtsVfR0o6F_K1T2IA";
const clientId = "6BCD2D10-F041-432F-B2C9-E2F1F3AC16C2";
const scope = "vso.identity vso.work_write";
const tokenUrl = "https://app.vssps.visualstudio.com/oauth2/token";
const clientAssertionType = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
const redirectUri = chrome.identity.getRedirectURL("oauth2");
const vstsApi = "https://msazure.visualstudio.com/One/_apis/wit/";
const vstsApiWorkItems = vstsApi + "workitems/";
const vstsApiAttachments = vstsApi + "attachments/";

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
        // network requests, responses (graph calls) available via result.calls
        console.log(result.calls);

        // screenshots available via result.screenshots
        console.log(result.screenshots);

        console.log("Sending information to VSTS...");
        sendBugReport({
            title: "Test bug",
            description: "Test bug description\n" + JSON.stringify(result.responses, null, 4),
            assignedTo: "roramu@microsoft.com",
            tags: "testTag1; test tag 2;"
        },
        function(createdBug) { // on success
            //TODO
            console.log("Created bug ID: " + createdBug.id)
        },
        function(jqXHR) { // on failure
            //TODO
            console.log("Failed to create bug: " + jqXHR.status + "\n" + jqXHR.responseText);
        });
    });
}

/**
 * Sends a bug report
 * 
 * @param {*} bugInfo Information about the bug.
 * @param {*} dontAutoRefreshToken True if this method should not attempt to renew the authentication token and retry the call if a 403 error was returned.
 * @param {*} onSuccess Handles the result by taking 1 parameter - the details of the bug that was just created.
 * @param {*} onFailure Handles the failure result by taking 1 parameter - the jqXHR response object.
 */
function sendBugReport(bugInfo, onSuccess, onFailure, dontAutoRefreshToken) {
    var url = vstsApiWorkItems + "$Bug/";
    var vstsApiVersion = "3.0";

    getAuthToken(function(authToken) {
        $.ajax({
            type: "PATCH",
            url: url,
            dataType: "json",
            contentType: "application/json-patch+json",
            
            headers: {
                "Authorization": "Bearer " + authToken,
                "Accept": "application/json; api-version=" + vstsApiVersion
            },
            
            data: JSON.stringify(
                [
                    { "op": "add", "path": "/fields/System.Title",          "value": bugInfo.title },
                    { "op": "add", "path": "/fields/System.Description",    "value": bugInfo.description },
                    { "op": "add", "path": "/fields/System.AssignedTo",     "value": bugInfo.assignedTo },
                    { "op": "add", "path": "/fields/System.State",          "value": "New" },
                    { "op": "add", "path": "/fields/System.Tags",           "value": bugInfo.tags }
                ]
            ),
            
            success: function(data, textStatus, jqXHR) {
                var createdBug = jqXHR.responseJSON;
                console.log("Success: " + jqXHR.status);
                console.dir(createdBug);
                onSuccess(createdBug);
            },
            
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Failure: " + jqXHR.status + "\n" + jqXHR.responseText);
                if (jqXHR.status === 403) {
                    // Probably an expired token, so try to get a new one
                    if (!dontAutoRefreshToken) {
                        console.log("Attempting to get a new token...");
                        getAuthToken(function() {
                            console.log("Trying again to create the bug with the refreshed token.");
                            sendBugReport(bugInfo, onSuccess, onFailure, true);
                        }, true);
                    } else {
                        onFailure(jqXHR);
                    }
                }
            }
        });
    });
}

/**
 * Returns an auth token if auth was successful, otherwise returns undefined.
 */
function getAuthToken(callback, forceRefresh) {
    getCachedToken(function(token) {
        if (token) {
            // Token is cached, so check if we should refresh it
            if (forceRefresh) {
                // Use the refresh token to get a new access token
                var refreshToken = token.refresh_token;
                var postBody = 
                    "client_assertion_type="    + clientAssertionType
                    + "&client_assertion="      + encodeURIComponent(clientSecret)
                    + "&grant_type="            + "refresh_token"
                    + "&assertion="             + refreshToken
                    + "&redirect_uri="          + redirectUri
                ;
                
                $.ajax({
                    type: "POST",
                    url: tokenUrl,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",

                    data: postBody,

                    success: function(data, textStatus, jqXHR) {
                        setCachedToken(jqXHR.responseJSON, function() {
                            getAuthToken(callback);
                        });
                    },

                    failure: function(jqXHR, textStatus, errorThrown) {
                        callback();
                    }
                });
            } else {
                // Don't need to refresh the access token, so return it as-is
                callback(token.access_token);
            }
        } else {
            // Token is not cached, so we need to get a new one
            var responseType = "Assertion";
            var authUrl =
                "https://app.vssps.visualstudio.com/oauth2/authorize"
                + "?client_id="     + clientId
                + "&redirect_uri="  + redirectUri
                + "&response_type=" + responseType
                + "&scope="         + encodeURIComponent(scope)
            ;

            // Get authorization from the user
            chrome.identity.launchWebAuthFlow({ interactive: true, url: authUrl }, function(responseUri) {
                // Extract the auth code out of the response URI
                var parsed = new URL(responseUri);
                var authCode = parsed.searchParams.get('code');

                // Get access and refresh tokens with this auth code
                var postBody = 
                    "client_assertion_type="    + clientAssertionType
                    + "&client_assertion="      + encodeURIComponent(clientSecret)
                    + "&grant_type="            + "urn:ietf:params:oauth:grant-type:jwt-bearer"
                    + "&assertion="             + encodeURIComponent(authCode)
                    + "&redirect_uri="          + redirectUri
                ;

                $.ajax({
                    type: "POST",
                    url: tokenUrl,
                    dataType: "json",
                    contentType: "application/x-www-form-urlencoded",

                    data: postBody,

                    success: function(data, textStatus, jqXHR) {
                        setCachedToken(jqXHR.responseJSON, function() {
                            getAuthToken(callback);
                        });
                    },

                    failure: function(jqXHR, textStatus, errorThrown) {
                        callback();
                    }
                });
            });
        }
    });
}

function getCachedToken(callback) {
    chrome.storage.local.get("token", function(item) {
        var result = item.token;
        if (result) {
            result = JSON.parse(result);
        }
        callback(result);
    });
}

function setCachedToken(token, callback) {
    chrome.storage.local.set({"token": JSON.stringify(token)}, callback);
}

function clearCachedToken() {
    chrome.storage.local.remove("token");
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