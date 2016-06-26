package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class GoogleNewsIT extends DriverBase {

    @Test
    public void googleRun() throws Exception {
        WebDriver driver = getDriver();

        driver.get("http://www.google.com");
        WebElement element = driver.findElement(By.name("q"));

        element.clear();
        element.sendKeys("Did Brexit happen?");
        element.submit();

        Thread.sleep(10 * 1000);
        driver.get("http://www.theguardian.com/politics/gallery/2016/jun/24/newspapers-brexit-front-pages-eu");

        Thread.sleep(10 * 1000);
    }

}