/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ibizadev.chromedrivercontroller;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.safari.SafariDriver;

/**
 *
 * @author Rohit
 */
public class Main {
    // Firefox: "C:\\Users\\Rohit\\Downloads\\geckodriver.exe"
    // Opera:   "C:\\Users\\Rohit\\Downloads\\operadriver_win64\\operadriver.exe"
    // IE:      "C:\\Users\\Rohit\\Downloads\\IEDriverServer.exe"
    // Edge:    "C:\\Users\\Rohit\\Downloads\\MicrosoftWebDriver.exe"
    
    static final String DEFAULT_BROWSER = "chrome";
    
    static final Map<String, Function<String, WebDriver>> webDrivers = new HashMap<String, Function<String, WebDriver>>() {{
        put("chrome", (location) -> newBrowser(ChromeDriver.class, location));
        put("firefox", (location) -> newBrowser(FirefoxDriver.class, location));
        put("opera", (location) -> newBrowser(OperaDriver.class, location));
        put("safari", (location) -> newBrowser(SafariDriver.class, location));
        put("edge", (location) -> newBrowser(EdgeDriver.class, location));
        put("ie", (location) -> newBrowser(InternetExplorerDriver.class, location));
    }};
    
    static final Map<Class<? extends WebDriver>, String> systemProperties = new HashMap<Class<? extends WebDriver>, String>() {{
        put(ChromeDriver.class, "webdriver.chrome.driver");
        put(FirefoxDriver.class, "webdriver.gecko.driver");
        put(OperaDriver.class, "webdriver.opera.driver");
        put(SafariDriver.class, "webdriver.safari.driver");
        put(EdgeDriver.class, "webdriver.edge.driver");
        put(InternetExplorerDriver.class, "webdriver.ie.driver");
    }};
    
    public static void main(String[] args) {
        String browserName = DEFAULT_BROWSER;
        String driverLocation = null; 
        if (args.length > 0) {
            browserName = args[0];
            if (!webDrivers.keySet().contains(browserName)) {
                throw new IllegalArgumentException("Invalid browser name.  Please select one from this list:" + String.join("\n - ", webDrivers.keySet()));
            }
            
            if (args.length > 1) {
                driverLocation = args[1];
            }
        }
        
        WebDriver browser = webDrivers.get(browserName).apply(driverLocation);
        try {
            browser.get("https://www.google.com");
        } catch (Exception e) {
            System.err.println("Error while launching " + browserName + " window:\n" + e);
        }
        System.out.println();
    }
    
    private static WebDriver newBrowser(Class<? extends WebDriver> driverType, String location) {
        WebDriver result = null;
        try {
            // Set driver location if provided
            if (location != null) {
                System.setProperty(systemProperties.get(driverType), location);
            }
            
            // Create browser instance
            result = driverType.newInstance();
        } catch (Exception e) {
            System.err.println("Error while creating new browser driver object:\n" + e);
        }
        
        return result;
    }
}
