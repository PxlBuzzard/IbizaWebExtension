// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {	
//     switch (request.eventName) {
//       case "createNewBug": createNewBug(request, sender, sendResponse); break;
//       default: break;
//     }
//   }
// );

function createNewBug(request, sender, sendResponse)
{
  console.log("Begin new bug creation session.");

  sendResponse({status: "success", message: "Bug created"});
}
