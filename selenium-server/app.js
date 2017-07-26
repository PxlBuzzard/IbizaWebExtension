const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

function createBrowser(username, password) {
	var webdriver = require('selenium-webdriver'),
	    By = webdriver.By,
	    until = webdriver.until;

	var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .build();
	driver.manage().window().maximize();
	driver.get('https://portal.azure.com');
	var query = driver.wait(until.elementLocated(By.name('login')));
	query.sendKeys(username);

	var query = driver.wait(until.elementLocated(By.name('passwd')));
	query.sendKeys(password);
	var query = driver.wait(driver.findElement(By.id('cred_sign_in_button')));

	driver.sleep(1000);
	driver.findElement(By.id('cred_sign_in_button')).click();
};

app.get('/createBrowser', function (req, res) {
  var username = 'admin@abbytestvppa06.onmicrosoft.com';
  var password = 'Hello$World';
  createBrowser(username, password);
  res.send('Created a browser successfully!');
});

app.get('/createBrowser/:username/:password', function(req, res) {
  createBrowser(req.params.username, req.params.password);
  res.send('Created a browser with ' + req.params.username + ' password ' + req.params.password);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
