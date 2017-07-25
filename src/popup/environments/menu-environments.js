// Change active env on click

// Save from localStorage

// Load from localStorage

// Add new env to localStorage and menu
function newEnvironment(name) {
  // build the section header
  var listItem = $('<li />');
  listItem.addClass('pure-menu-item');
  $('#env-list').append(listItem);
  var link = $('<a>' + name + '</a>');
  link.addClass('pure-menu-link');
  listItem.append(link);

  // build the table
  var table = $('<table></table>').addClass('pure-table pure-table-horizontal active');
  var tHead = $('<thead><tr><th>From</th><th>To</th></tr></thead>');
  table.append(tHead);
  var tBody = $('<tbody><tr><td>test</td><td>test2</td></tr></tbody>');
  table.append(tBody);
  $('#env-list').append(table);
}

newEnvironment("Test Environment");

// Add new item to localStorage and menu

// Delete env (and items) from localStorage and menu

// Delete item from localStorage and menu

// Stretch: Import as JSON

// Stretch: Export as JSON
