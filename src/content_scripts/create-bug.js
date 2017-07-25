function createNewBug(request, sender, sendResponse)
{
  sendResponse(createNewBugInternal(request, sender))
}

function createNewBugInternal(request, sender)
{
  console.log("Begin new bug creation session.");
  if ($("#bug-dialog").length === 0)
  {
    console.log("Element does not exist");
    $("body").append(`
      <div 
        id="bug-dialog" 
        style="
          position:absolute;
          top:50px;
          left:50px; 
          right:50px; 
          bottom:50px;
          margin:auto;
          border-radius:30px; 
          z-index:9999; 
          background-color:white;">
          <img style="float:right;" id="bug-dialog-close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ7SURBVDhPnVPfT5JRGMafiz8gt5qrvKitQueFc/PKG9e1dUN10Zhr5QXxq6u0ljpZtMHEzcVaUZAzTXI0cpgJTDECLRNRQQwvmoK6uUZNxLx5et8vEXDd1Nmefec753mf877PeY9IdGioVKoLapXaoFFp/PRNMvbnBt47zD/4VyqVp4io12ofpCzWPoyMehCYCgrgOa/xHnOYmye0H9xrMj2B1+nCYv9rLGl1CN9oxpysCTPq25g29sDjGAFzSKQ3T4RVeSNos2NNfgs/DAZETp7ASl0dIrW1+Hz8GL4qFYhekyHQN5gR0QtZcF2c2gSdnGhpRXplBTzWOzrwUSzGpPgIwhoNErS2Fo1i8WYz3G+cQjmCJ2wY1xeyvkRCocCmxSII8IjJ5ZiRybCaSiNJ/8GuLjysqYFPpxc84VgRO8wmzbfcw9TRMswRYd1sxi8KSO7uIrYWR3xvD7N6Pe4WFKCnsBDj0quCsRzLGSTZ6S/Sy5iursYokZwlJVg2GvFtexsbOztY6O5Gq0gEM8FBAq6qKuF2OPZAYLrxIoaLijBIJE9DA+YpiwRlEE+lEBsYgKmsDK9ob4gE3JWVWYFMCf6m67DxZkUFFmw2bFIJc243ZgnL6TRWnU48LS/He+J4Gy/llSCY6OvUwVtfjzAFb1FwxO/HHTrxESEWCuEnrX0nEV1pKfzt2qyJmWvkq3FIryDY1oaNsTEh+DnhLcFaXIytSASftFpYT5+B2z6cvUbuhUwjeZ69wNA5CWxkJBtmJ7wjTBAeU+r9Z89jhjj73finkXjktrKL1D/c78Qk1TkukcBL8NE80N4pnPzXVs4R+b/HlPuy/vU5/wbHeDaBDv0pHgAAAABJRU5ErkJggg==" />
          <div id="bug-details" style="margin:50px;">
              <div id="
              <span style="display:block;">Screenshot:</span>
              <img style="float:left; max-width: 400px; max-height:400px; width:auto; height:auto;" id="page-screenshot" />
          </div>
      </div>`);
    $("#bug-dialog-close").click(closeCreateBugDialog);

    setScreenshot(request.screenshot);
  }
  else
  {
    return {status: "success", message: "Bug creation dialog already opened."};
  }

  function setScreenshot(imageString)
  {
    $("#page-screenshot").attr('src', imageString);
  }
  
  function closeCreateBugDialog() {
    console.log("Closing bug creation dialog.");
    $("#bug-dialog").remove();
  }

  return {status: "success", message: "Bug creation dialog displayed."};
}
