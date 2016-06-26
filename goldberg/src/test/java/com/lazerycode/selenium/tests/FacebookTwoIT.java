package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import com.lazerycode.selenium.User;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class FacebookTwoIT extends DriverBase {

    @Test
    public void facebookTwoRun() throws Exception {
        WebDriver driver = getDriver();
        driver.get("http://www.facebook.com");

        WebElement email = driver.findElement(By.name("email"));
        email.clear();
        email.sendKeys(User.FACEBOOK.getUsername());

        WebElement password = driver.findElement(By.name("pass"));
        password.clear();
        password.sendKeys(User.SPOTIFY.getPassword());
        password.submit();


        Thread.sleep(5 * 1000);
        driver.navigate().to("https://www.facebook.com/adriana419?fref=ts");
        Thread.sleep(6 * 1000);
    }
}