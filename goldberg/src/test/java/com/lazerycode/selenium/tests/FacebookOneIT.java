package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import com.lazerycode.selenium.User;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class FacebookOneIT extends DriverBase {

    @Test
    public void facebookRun() throws Exception {
        WebDriver driver = getDriver();
        driver.get("http://www.facebook.com");

        WebElement email = driver.findElement(By.name("email"));
        email.clear();
        email.sendKeys(User.FACEBOOK.getUsername());

        WebElement password = driver.findElement(By.name("pass"));
        password.clear();
        password.sendKeys(User.FACEBOOK.getPassword());
        password.submit();

        Thread.sleep(5 * 1000);
        driver.navigate().to("http://www.facebook.com/events/birthdays/?acontext=%7B%22ref%22%3A2%2C%22ref_dashboard_filter%22%3A%22upcoming%22%2C%22action_history%22%3A%22null%22%7D");

        Thread.sleep(8 * 1000);
    }
}