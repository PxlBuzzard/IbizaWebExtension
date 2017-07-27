

function clickHandler(click) {
  var button = click.target;
  switch (button.id) {
    case "createUserSessionButton": launchUserSession(); break;
    default: break;
  }
}

document.addEventListener("click", clickHandler);
setInterval(checkSeleniumServerStatus, 3000);
