@resetSession
Feature: Login Functionality

  Scenario: User failed to login with wrong password
    Given user is on the login page
    When user enters username "baskaratesting1" and password "WrongPassword123"
    And user checks the "Remember Me" checkbox
    And user clicks login button
    Then user should see the error message "Gagal, kata sandi tidak sesuai"

  Scenario: User failed to login with wrong username
    Given user is on the login page
    When user enters username "baskarainvalid1" and password "WrongPassword123"
    And user checks the "Remember Me" checkbox
    And user clicks login button
    Then user should see the error message "Gagal, username tidak ditemukan"

  Scenario: User successfully login with valid data
    Given user is on the login page
    When user enters username "baskaratesting4" and password "Jejakin2023!"
    And user checks the "Remember Me" checkbox
    And user clicks login button
    Then user should be redirected to the select program page