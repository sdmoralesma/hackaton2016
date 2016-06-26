package com.lazerycode.selenium.tests;

import com.lazerycode.selenium.DriverBase;
import com.lazerycode.selenium.User;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.Test;

public class SpotifyIT extends DriverBase {

    @Test
    public void spotifyRun() throws Exception {
        WebDriver driver = getDriver();
        driver.get("https://play.spotify.com/follow/find-friends");

        WebElement hasAccount = driver.findElement(By.id("has-account"));
        hasAccount.click();


        WebElement email = driver.findElement(By.id("login-usr"));
        email.clear();
        email.sendKeys(User.SPOTIFY.getUsername());

        WebElement password = driver.findElement(By.id("login-pass"));
        password.clear();
        password.sendKeys(User.SPOTIFY.getPassword());

        password.submit();

        Thread.sleep(8000);
        driver.get("https://play.spotify.com/artist/12Chz98pHFMPJEknJQMWvI");

        Thread.sleep(6000);
    }

}