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

/// Functions
// Click handler
var clickHandler = function(click) {
  var target = click.target;
  if (target.className === "pure-menu-link") {
    changeActiveEnvironment(target);
  }
  else if (target.id === "saveAllChanges") {
    saveAllChanges();
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
    $(activeEnv.nextSibling.nextSibling).removeClass('active');
  }

  // set new active
  activeEnv = target;
  $(target).addClass('selected');
  $(target.nextSibling.nextSibling).addClass('active');
}

// Save from localStorage chrome.storage.sync

// Load from localStorage

// Add new env to localStorage and menu
function newEnvironment(name) {
  // build the section header
  var $listItem = $('<li />').addClass('pure-menu-item');
  var $link = $('<a>' + name + '</a>').addClass('pure-menu-link');
  var $close = $('<button>X</button>').addClass('pure-button close-button');
  $listItem.append($link);
  $listItem.append($close);

  // build the tables
  var $table = $('<table></table>').attr('id', name).addClass('pure-table pure-table-bordered');
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

// Add a new row to the active table
function addTableRow($table) {
  // only add new row if the bottom row is changed
  if ($('tr:last input', $table).val() !== '') {
    $('tbody', $table).append($(tInputs));
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
    envObject['urls'] = {};

    var table = document.getElementById(env_name);

    for (var r = 0; r < table.rows.length; r++) {
      var from = table.rows[r].cell[0].innerHTML;
      var to = table.rows[r].cell[1].innerHTML;

      // Add to list only if from is not null, skip the pair otherwise
      if (from !== null) {
        envObject['urls'][from] = to;
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

// Delete item from localStorage and menu

// Stretch: Import as JSON

// Stretch: Export as JSON
