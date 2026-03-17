@authenticated
Feature: Profile Functionality

  Background:
    Given user is on the homepage
    When user clicks on "Profil" footbar menu
    Then user is on the profile page

  Scenario: User verify contact support
    When user clicks button hubungi
    Then user should see contact support options
    When user closes the bottom sheet
    Then user is on the profile page

  Scenario: User reads privacy policy
    When user clicks on "Kebijakan Privasi" menu
    Then user should see privacy policy content
    When user presses back button
    Then user is on the profile page

  Scenario: User reads terms and conditions
    When user clicks on "Syarat & Ketentuan" menu
    Then user should see terms and conditions content
    When user presses back button
    Then user is on the profile page

  Scenario: User verify language options
    When user clicks on "Bahasa" menu
    Then user should see language options
    When user closes the bottom sheet
    Then user is on the profile page

  Scenario: User signs out of the application
    When user clicks on "Keluar aplikasi" menu
    Then user is on the login page
