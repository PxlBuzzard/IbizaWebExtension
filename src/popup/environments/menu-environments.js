/// Startup code
var activeEnv = "";
var tInputs =
  '<tr><td><input type="text" placeholder="From"></td>' +
  '<td><input type="text" placeholder="To"></td></tr>';

$('form').on('submit', function(event) {
  newEnvironment($('#newEnvironment').val());
  $('#newEnvironment').val('');
  event.preventDefault();
});

// Hide table change button
$('#saveAllChanges').hide();

newEnvironment("Test Environment");
newEnvironment("Test 2");

/// Functions
// Click handler
var clickHandler = function(click) {
  var target = click.target;
  if (target.className === "pure-menu-link") {
    changeActiveEnvironment(target);
  }
  else if (target.id === "saveAllChanges") {
    $('#saveAllChanges').hide();
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
  var $listItem = $('<li />').addClass('pure-menu-item');
  var $link = $('<a>' + name + '</a>').addClass('pure-menu-link');
  $listItem.append($link);

  // build the table
  var $table = $('<table></table>').addClass('pure-table pure-table-bordered');
  var $tHead = $('<thead><tr><th>From</th><th>To</th></tr></thead>');
  $table.append($tHead);
  var $tBody = $('<tbody></tbody>');
  $tBody.append($(tInputs));
  $table.append($tBody);
  $listItem.append($table);
  $('#envList').append($listItem);

  // Show save button if a change is made
  $('input', $table).on('change', function() {
    addTableRow($table);
  });
}

function addTableRow($table) {
  if ($('tr:last input', $table).val() !== '') {
    $('tbody', $table).append($(tInputs));
    console.log("appended");
  }

  $('input', $table).on('change', function() {
    addTableRow($table);
  });

  $('#saveAllChanges').show();
}

// Add new item to localStorage and menu
function saveAllChanges() {

}

// Delete env (and items) from localStorage and menu

// Delete item from localStorage and menu

// Stretch: Import as JSON

// Stretch: Export as JSON
