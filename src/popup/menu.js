import utils from "utils";

saveLocalStorage = function() {
  utils.getBrowserContext(function(t, w) {
    console.log(t);
    console.log(w);
  });
  window.close();
};

loadLocalStorage = function() {
  
  window.close();
};

clearLocalStorage = function() {
  
  window.close();
};

