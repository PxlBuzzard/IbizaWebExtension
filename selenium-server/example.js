var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

driver.get('https://portal.azure.com');
var query = driver.wait(until.elementLocated(By.name('login')));
query.sendKeys('admin@abbytestvppa06.onmicrosoft.com');

var query = driver.wait(until.elementLocated(By.name('passwd')));
query.sendKeys('Hello$World');
var query = driver.wait(driver.findElement(By.id('cred_sign_in_button')));

driver.sleep(1000);
driver.findElement(By.id('cred_sign_in_button')).click();

// Run browser 2 using selenium

var driver2 = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


driver2.get('https://portal.azure.com');
var query = driver2.wait(until.elementLocated(By.name('login')));
query.sendKeys('iwuser0@abbytestvppa06.onmicrosoft.com');

var query = driver2.wait(until.elementLocated(By.name('passwd')));
query.sendKeys('Hello$World');
var query = driver2.wait(driver2.findElement(By.id('cred_sign_in_button')));

driver2.sleep(1000);
driver2.findElement(By.id('cred_sign_in_button')).click();

// driver.quit();
