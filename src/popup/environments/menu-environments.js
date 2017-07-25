/// Startup code
var activeEnv = "";

$('form').on('submit', function(event) {
  newEnvironment($('#newEnvironment').val());
  $('#newEnvironment').val('');
  event.preventDefault();
});

newEnvironment("Test Environment");
newEnvironment("Test 2");

/// Functions
// Click handler
var clickHandler = function(click) {
  var target = click.target;
  if (target.className === "pure-menu-link") {
    changeActiveEnvironment(target);
  }
};
document.addEventListener("click", clickHandler);

// Change active environment
function changeActiveEnvironment(target) {
  // If target is current, take no action
  if (target === activeEnv) {
    return;
  }
  // disable last active
  else if (activeEnv) {
    $(activeEnv.nextSibling).removeClass('active');
  }

  // set new active
  activeEnv = target;
  $(target.nextSibling).addClass('active');
}

// Save from localStorage chrome.storage.sync

// Load from localStorage

// Add new env to localStorage and menu
function newEnvironment(name) {
  // build the section header
  var listItem = $('<li />').addClass('pure-menu-item');
  var link = $('<a>' + name + '</a>').addClass('pure-menu-link');
  listItem.append(link);

  // build the table
  var table = $('<table></table>').addClass('pure-table pure-table-horizontal');
  var tHead = $('<thead><tr><th>From</th><th>To</th></tr></thead>');
  table.append(tHead);
  var tBody = $('<tbody><tr><td>test</td><td>test2</td></tr></tbody>');
  table.append(tBody);
  listItem.append(table);
  $('#envList').append(listItem);
}

// Add new item to localStorage and menu

// Delete env (and items) from localStorage and menu

// Delete item from localStorage and menu

// Stretch: Import as JSON

// Stretch: Export as JSON
