/// Startup code
var activeEnv = "";
var urltInputs =
  '<tr><td><input class="from-field" type="url" placeholder="From" maxlength="500"></td>' +
  '<td><input class="to-field" type="url" placeholder="To" maxlength="500"></td></tr>';

var usertInputs =
  '<tr><td><button class="pure-button go-button" disabled=true>Go</button></td>' +
  '<td><input class="name-field" type="email" maxlength="500"></td>' +
  '<td><input class="password-field" type="password" size="10" maxlength="500"></td></tr>';

$('form').on('submit', function(event) {
  newEnvironment($('#newEnvironment').val());
  $('#newEnvironment').val('');
  event.preventDefault();
});

// Hide table change button
$('#saveAllChanges').hide();

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
  var $envUrl = $('<input class="envUrl-field" type="url" placeholder="Default URL" maxlength="500">');
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

  // Add a new row on change
  $('input', $urlTable).on('change', function() {
    addTableRow($urlTable);
  });
  $('input', $userTable).on('change', function() {
    addTableRow($userTable);
  });
}

// Add a new row to the active table
function addTableRow($table) {
  // only add new row if the bottom row is changed
  if ($('tr:last input', $table).val() !== '') {
    $('tbody', $table).append($($table).hasClass('url-table') ? $(urltInputs): $(usertInputs));
  }

  // add the change event to the new row
  $('input', $table).on('change', function() {
    addTableRow($table);
  });

  $('#saveAllChanges').show();
}

// Add new item to localStorage and menu
function saveAllChanges() {
  // iterate over the input fields
  $('#envList li').each(function() {
    var envObject = {};
    var env_name = $(this).find('a').text();
    console.log(env_name);

    envObject['name'] = env_name;
    envObject['url'] = {};
    envObject['user'] = {}

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

    console.log(envObject);
  });

  $('#saveAllChanges').hide();
}

// Delete env (and items) from localStorage and menu
function deleteEnvironment(target) {
  // delete from localStorage

  // delete from menu
  $(target.parentElement).remove();
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
