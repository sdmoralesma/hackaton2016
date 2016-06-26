package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class GoogleMapsIT extends DriverBase {

    @Test
    public void googleRun() throws Exception {
        WebDriver driver = getDriver();

        driver.get("https://www.google.nl/maps?source=tldsi&hl=en");
        WebElement element = driver.findElement(By.id("searchboxinput"));

        element.clear();
        element.sendKeys("Backbase B.V.");

        WebElement button = driver.findElement(By.className("searchbox-searchbutton-container"));
        button.click();

        Thread.sleep(10 * 1000);
    }

}