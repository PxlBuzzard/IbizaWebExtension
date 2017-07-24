document.addEventListener("click", (e) => {
  if (e.target.classList.contains("action")) {

    // browser.tabs.executeScript(null, {
    //   code:"document.body.style.border = '5px solid red'"
    // });
    chrome.tabs.executeScript(null,
      { code:"document.body.style.border = '5px solid red'" }
    );
  window.close();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});

