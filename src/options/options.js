document.addEventListener("DOMContentLoaded", () => {
  getDefaults((params) => {
    buildTable($("#params-table"), params);
  }, true);
  getTestExtensions((extensions) => {
    $("#test-extensions").val(extensions);
  });
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  storeDefaults(getParams($("#params-table")));
  storeTestExtensions($("#test-extensions").val());
});
