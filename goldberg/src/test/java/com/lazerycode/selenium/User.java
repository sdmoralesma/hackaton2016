package com.lazerycode.selenium;

public enum User {

    FACEBOOK("myusername", "mypassword"),
    SPOTIFY("myusername", "mypassword");

    private final String username;
    private final String password;

    User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
