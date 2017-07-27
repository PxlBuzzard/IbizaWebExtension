const express = require('express');
const app = express();
const errorhandler = require('errorhandler')

app.get('/', function (req, res) {
  res.send('Hello World!');
});

function createBrowser(username, password, url) {
	var webdriver = require('selenium-webdriver'),
	    By = webdriver.By,
	    until = webdriver.until;

	var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .build();
	driver.manage().window().maximize();
	driver.get(url);
	var query = driver.wait(until.elementLocated(By.name('login')));
	query.sendKeys(username);

	var query = driver.wait(until.elementLocated(By.name('passwd')));
	query.sendKeys(password);
	var query = driver.wait(driver.findElement(By.id('cred_sign_in_button')));

	driver.sleep(1000);
	driver.findElement(By.id('cred_sign_in_button')).click();
};

app.get('/createBrowser', function (req, res) {
  createBrowser('', '', 'https://portal.azure.com');
  res.send('Created a browser successfully!');
});

app.get('/createBrowser/:username/:password', function(req, res) {
	var username = decodeURIComponent(req.params.username);
	var password = decodeURIComponent(req.params.password);
	var url = decodeURIComponent('https://portal.azure.com');
  createBrowser(username, password, url);
  res.send('Created a browser with ' + username + ' password ' + password);
  console.log('Created a browser with ' + username);
});

app.get('/createBrowser/:username/:password/:url', function(req, res) {
	var username = decodeURIComponent(req.params.username);
	var password = decodeURIComponent(req.params.password);
	var url = decodeURIComponent(req.params.url);
	if(url.indexOf("http") === -1) {
		url = "https://" + url;
	}

	res.send('Created a browser with ' + username + ' password ' + password + ' url ' + url);
	console.log('Created a browser with ' + username + ' url ' + url);
	createBrowser(username, password, url);
});

app.use(errorhandler())

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
