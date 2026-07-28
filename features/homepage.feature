@authenticated
Feature: Homepage Functionality

  Background:
    Given user is on the homepage

  Scenario: User can search, download, and change program
    When user clicks change program
    And user clicks Unduh program lainnya
    And user searches for program "Program fix geotagging v1 sukawarna"
    And user selects the program "Program fix geotagging v1 sukawarna"
    And user clicks the confirm download button
    Then user should see progress download
    When user click button complete
    And user clicks back button once
    And user searches for program "Program fix geotagging v1 sukawarna"
    And user selects the program "Program fix geotagging v1 sukawarna"
    Then user is on the homepage

  Scenario: User verify homepage elements
    And user should see homepage indicator "Program aktif"
    And user should see homepage indicator "Geotagging"
    # And user should see homepage indicator "Monitoring"
    And user should see homepage indicator "Sensor"
    And user should see homepage indicator "Flora"
    When user scrolls down to "Fauna"
    Then user should see homepage indicator "Fauna"

  Scenario: User can refresh data
    When user clicks Perbarui Data button
    Then user should see progress download
    When user click button complete
    Then user is on the homepage

  Scenario: User can download other programs
    When user clicks change program
    And user clicks Unduh program lainnya
    Then user should see homepage indicator "Unduh program lainnya"
    And user should see homepage indicator "Anda bisa pilih lebih dari satu."
    When user selects the first program
    And user clicks the confirm download button
    Then user should see progress download
    When user click button complete
    And user navigates back to homepage
    Then user is on the homepage
