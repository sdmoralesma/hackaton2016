package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class FBIIT extends DriverBase {

    private static String NAME = "Willie Scholtz";// hahaha sorry buddy :)

    @Test
    public void fbiRun() throws Exception {
        WebDriver driver = getDriver();
        driver.get("https://www.fbi.gov/wanted");

        WebElement name = driver.findElement(By.name("CustomSearchableText"));
        name.clear();
        name.sendKeys(NAME);

        driver.findElement(By.cssSelector("input[value='Male']")).click();
        driver.findElement(By.cssSelector("input[value='terrorism']")).click();
        driver.findElement(By.cssSelector("input[value='cyber-crime']")).click();
        driver.findElement(By.cssSelector("input[value='murder-violent-crime']")).click();
        driver.findElement(By.cssSelector("input[value='bank-robbery']")).click();
        driver.findElement(By.cssSelector("input[value='kidnapping-missing-persons']")).click();
        driver.findElement(By.cssSelector("input[value='crimes-against-children']")).click();
        driver.findElement(By.cssSelector("input[value='parental-kidnappings']")).click();
        driver.findElement(By.cssSelector("input[value='fraud-white-color']")).click();
        driver.findElement(By.cssSelector("input[value='criminal-enterprises-drugs']")).click();

        Thread.sleep(5 * 1000);

        driver.findElement(By.id("search-submit")).click();

        Thread.sleep(3 * 1000);
    }

}