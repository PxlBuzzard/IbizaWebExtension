/// Consts
const envPrefix = "env_";

/// Startup code
var activeEnv = "";
var urltInputs =
  '<tr><td><input class="from-field left-field" type="url" placeholder="From" maxlength="500"></td>' +
  '<td><input class="to-field right-field" type="url" placeholder="To" maxlength="500"></td></tr>';

var usertInputs =
  '<tr><td><button class="pure-button go-button" disabled=true>Go</button></td>' +
  '<td><input class="name-field left-field" type="email" maxlength="500"></td>' +
  '<td><input class="password-field right-field" type="password" size="10" maxlength="500"></td></tr>';

$('form').on('submit', function(event) {
  newEnvironment($('#newEnvironment').val());
  $('#newEnvironment').val('');
  event.preventDefault();
});

// Hide table change button
$('#saveAllChanges').hide();

$(document).ready(function() {
  // Load data into UI
  getEnvironments(function(environments) {
      for (var env of environments) {
        // create env in the UI
        newEnvironment(env.name);

        // populate the default URL
        $('#envUrl' + env.name).val(env.defaultUrl);

        // add rows
        for (var urlKey in env.url) {
          addTableRow($('#url' + env.name), urlKey, env.url[urlKey]);
        }
        for (var userKey in env.user) {
          addTableRow($('#user' + env.name), userKey, env.user[userKey]);
        }
        addTableRow($('#url' + env.name));
        addTableRow($('#user' + env.name));
        $('#saveAllChanges').hide();
      }
  });
});

/// Functions
// Click handler
var clickHandler = function(click) {
  var target = click.target;
  if (target.className === "pure-menu-link env-header") {
    changeActiveEnvironment(target);
    checkSeleniumServerStatus();
  }
  else if (target.id === "saveAllChanges") {
    saveAllChanges();
    checkSeleniumServerStatus();
  }
  else if (target.className === "pure-button close-button") {
    deleteEnvironment(target);
    saveAllChanges();
  }
  else if (target.className === "pure-button go-button") {
    var neighbors = target.parentElement.parentElement.getElementsByTagName("td");
    var email = neighbors[1].children[0].value;
    var password = neighbors[2].children[0].value;
    var envUrl = target.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("envUrl-field")[0].value;
    launchUserSession(email, password, envUrl);
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
    $(activeEnv).removeClass('selected');
  }

  // set new active
  activeEnv = target;
  $(target).addClass('selected');
}

// Save from localStorage chrome.storage.sync

// Load from localStorage

// Add new env to localStorage and menu
function newEnvironment(name) {
  // build the section header
  var $listItem = $('<li />').addClass('pure-menu-item');
  var $link = $('<a>' + name + '</a>').addClass('pure-menu-link env-header');
  var $close = $('<button>X</button>').addClass('pure-button close-button');
  $listItem.append($link);
  $listItem.append($close);

  // add the environment URL
  var $envUrl = $('<input class="envUrl-field" type="url" placeholder="Default URL" maxlength="500">').attr('id', 'envUrl' + name);
  $listItem.append($envUrl);

  // build the URL redirection table
  var $urlHeader = $('<span>URL Redirects</span>').addClass('pure-menu-link');
  $listItem.append($urlHeader);
  var $urlTable = $('<table></table>').attr('id', 'url' + name).addClass('pure-table pure-table-bordered url-table');
  var $urltHead = $('<thead><tr><th>From</th><th>To</th></tr></thead>');
  $urlTable.append($urltHead);
  var $urltBody = $('<tbody></tbody>');
  $urltBody.append($(urltInputs));
  $urlTable.append($urltBody);
  $listItem.append($urlTable);

  // build the User table
  var $userHeader = $('<span>Users</span>').addClass('pure-menu-link');
  $listItem.append($userHeader);
  var $userTable = $('<table></table>').attr('id', 'user' + name).addClass('pure-table pure-table-bordered user-table');
  var $usertHead = $('<thead><tr><th>Launch</th><th>Email</th><th>Password</th></tr></thead>');
  $userTable.append($usertHead);
  var $usertBody = $('<tbody></tbody>');
  $usertBody.append($(usertInputs));
  $userTable.append($usertBody);
  $listItem.append($userTable);

  $('#envList').append($listItem);

  // show save when default URL changes
  $('.envUrl-field').on('change', function() {
    $('#saveAllChanges').show();
  });
  // Add a new row on change
  $('input', $urlTable).on('change', function() {
    addTableRow($urlTable);
  });
  $('input', $userTable).on('change', function() {
    addTableRow($userTable);
  });
}

// Add a new row to the active table
function addTableRow($table, leftItem = null, rightItem = null) {
  if (!leftItem && !rightItem) {
    // only add new row if the bottom row is changed
    if ($('tr:last input', $table).val() !== '') {
      $('tbody', $table).append($($table).hasClass('url-table') ? $(urltInputs) : $(usertInputs));
    }

    // add the change event to the new row
    $('input', $table).on('change', function() {
      addTableRow($table);
    });

    $('#saveAllChanges').show();
  }
  else {
    // remove the first empty row when inserting a new row
    if ($('tbody tr', $table).length === 1 && $('.left-field', $table).val() == "") {
      $('tbody tr', $table).remove();
    }
    var $row = $($table).hasClass('url-table') ? $(urltInputs) : $(usertInputs);
    $('.left-field', $row).val(leftItem);
    $('.right-field', $row).val(rightItem);
    $('tbody', $table).append($row);
  }
}

// Add new item to localStorage and menu
function saveAllChanges() {
  var envObjects = [];
  // iterate over the input fields
  $('#envList li').each(function() {
    var envObject = {};
    var env_name = $(this).find('a').text();

    envObject['name'] = env_name;
    envObject['defaultUrl'] = $('#envUrl' + env_name).val();
    envObject['url'] = {};
    envObject['user'] = {};

    var urlTable = document.getElementById('url' + env_name);
    var userTable = document.getElementById('user' + env_name);

    for (var r = 0; r < (urlTable.rows.length - 1); r++) {
      var from = $('#url' + env_name + ' .from-field')[r].value;
      var to = $('#url' + env_name + ' .to-field')[r].value;

      // Add to list only if from is not null, skip the pair otherwise
      if (from) {
        envObject['url'][from] = to;
      }
    }

    for (r = 0; r < (userTable.rows.length - 1); r++) {
      var username = $('#user' + env_name + ' .name-field')[r].value;
      var password = $('#user' + env_name + ' .password-field')[r].value;

      if (username && password) {
        envObject['user'][username] = password;
      }
    }
    envObjects.push(envObject);
    chrome.storage.sync.set({"currentActiveEnvironment": $('.env-header.selected').text()});
  });

  // Store environments only after everything has been parsed in case there's an error
  envObjects.forEach(function(envObject) {
    storeEnvironment(envObject);
  });

  $('#saveAllChanges').hide();
}

// Delete env (and items) from localStorage and menu
function deleteEnvironment(target) {
// delete from menu
  $(target.parentElement).remove();

  // delete from storage
  saveAllChanges();
}

// Check Selenium status
function checkSeleniumServerStatus() {
  $.get("http://localhost:3000/", function() {})
    .done(function() {
      $('.go-button').prop('disabled', false);
    })
    .fail(function() {
      $('.go-button').prop('disabled', true);
    });
}

// Delete item from localStorage and menu

// Stretch: Import as JSON

// Stretch: Export as JSON

// Returns the environments object from the store
//TODO: get all environments (prefixed with "env_")
function getEnvironments(callback) {
  chrome.storage.sync.get(null, function(storageEntries) {
    var environments = [];
    for (var key in storageEntries) {
      if (key.startsWith(envPrefix)) {
        environments.push(JSON.parse(storageEntries[key]));
      }
    }

    callback(environments);
  });
}

// Puts the environments object in the store
function storeEnvironment(environment, callback = undefined) {
  var obj = {};
  obj[envPrefix + environment.name] = JSON.stringify(environment);
  chrome.storage.sync.set(obj, callback);
}

// Gets the currently logged in user's information from the active tab
function getCurrentUser(callback) {
  Utils.getBrowserContext(function(currentTab, currentWindow) {
    chrome.tabs.sendMessage(currentTab.id, {eventName: "getCurrentUser"}, callback);
  });
}

function launchUserSession(username, password, targetUrl) {
    console.log(username);
    console.log(password);
    console.log(targetUrl);
    var url = "http://localhost:3000/createBrowser/";

    if (username && password) {
      url = url + encodeURIComponent(username) + "/" + encodeURIComponent(password);
      if (targetUrl) {
        url = url + "/" + encodeURIComponent(targetUrl);
      }
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    console.log(xmlHttp.responseText);
}
