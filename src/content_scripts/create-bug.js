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
          <img style="float:right; width:30px; height:30px;" id="bug-dialog-close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJ7SURBVDhPnVPfT5JRGMafiz8gt5qrvKitQueFc/PKG9e1dUN10Zhr5QXxq6u0ljpZtMHEzcVaUZAzTXI0cpgJTDECLRNRQQwvmoK6uUZNxLx5et8vEXDd1Nmefec753mf877PeY9IdGioVKoLapXaoFFp/PRNMvbnBt47zD/4VyqVp4io12ofpCzWPoyMehCYCgrgOa/xHnOYmye0H9xrMj2B1+nCYv9rLGl1CN9oxpysCTPq25g29sDjGAFzSKQ3T4RVeSNos2NNfgs/DAZETp7ASl0dIrW1+Hz8GL4qFYhekyHQN5gR0QtZcF2c2gSdnGhpRXplBTzWOzrwUSzGpPgIwhoNErS2Fo1i8WYz3G+cQjmCJ2wY1xeyvkRCocCmxSII8IjJ5ZiRybCaSiNJ/8GuLjysqYFPpxc84VgRO8wmzbfcw9TRMswRYd1sxi8KSO7uIrYWR3xvD7N6Pe4WFKCnsBDj0quCsRzLGSTZ6S/Sy5iursYokZwlJVg2GvFtexsbOztY6O5Gq0gEM8FBAq6qKuF2OPZAYLrxIoaLijBIJE9DA+YpiwRlEE+lEBsYgKmsDK9ob4gE3JWVWYFMCf6m67DxZkUFFmw2bFIJc243ZgnL6TRWnU48LS/He+J4Gy/llSCY6OvUwVtfjzAFb1FwxO/HHTrxESEWCuEnrX0nEV1pKfzt2qyJmWvkq3FIryDY1oaNsTEh+DnhLcFaXIytSASftFpYT5+B2z6cvUbuhUwjeZ69wNA5CWxkJBtmJ7wjTBAeU+r9Z89jhjj73finkXjktrKL1D/c78Qk1TkukcBL8NE80N4pnPzXVs4R+b/HlPuy/vU5/wbHeDaBDv0pHgAAAABJRU5ErkJggg==" />
          <div id="bug-dialog-inner" style="margin:50px; height: calc(100% - 100px);">
              <div id="bug-summary" style="float:left; width:30%; height: 100%;">
                  <span style="font-size:32px;">Captured information</span>
                  <span style="display:block; width:30%;">Screenshot:</span>
                  <img style="width:100%; height:auto;" id="page-screenshot" />
                  <span>(TODO: Show details of Ibiza log dump here)</span>
              </div>
              <div id="bug-details" style="width:calc(70%-50px); margin-left:35%; height:100%;">
                  <span style="font-size:32px;">Enter bug information</span>
                  <span>
                      <form action="#">
                          <table style="width:90%;">
                              <tr><td><span>Bug title:</span></td><td><input style="width:100%;" /></td></tr>
                              <tr><td><span>Bug details:</span></td><td> <textarea style="width:100%;" /><br/></td></tr>
                          </table>
                          <div style="height: calc(100% - 50px); width: 0px; float: right;"></div>
                          <input id="bug-dialog-submit-button" type="submit" value="Submit" style="height: 50px; float: right; clear: right;" />
                      </form>
                  </span>
              </div>
              <div style="clear:both;"></div>
          </div>
      </div>`);

    $("#bug-dialog-close").click(closeCreateBugDialog);
    $("#bug-dialog-submit-button").click(handleFormSubmit);
    setScreenshot(request.screenshot);
  }
  else
  {
    return {status: "success", message: "Bug creation dialog already opened."};
  }

  function handleFormSubmit()
  {
    console.log("Submit button pressed.");
    $("#bug-dialog-inner").html(`
        <div style="height:600px;line-height:600px;width:100%;">
            <span style="width:100%;display:inline-block;text-align:center;line-height:32px;font-size:48px;vertical-align:middle;">
                <img style="vertical-align:middle;" src="data:image/png;base64,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" />
                <br />
                <br />
                Submitting...
            </span>
        </div>`);

    console.log("(TODO) Sending information to VSTS.")
    setTimeout(showSubmitted, 2000);
  }

  function showSubmitted()
  {
    console.log("Show submit success.")
    $("#bug-dialog-inner").html(`
        <div style="height:600px;line-height:600px;width:100%;">
            <span style="width:100%;display:inline-block;text-align:center;line-height:32px;font-size:48px;vertical-align:middle;">Bug #12345 submitted!</span>
        </div>`);
    //setTimeout(closeCreateBugDialog, 5000);
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
