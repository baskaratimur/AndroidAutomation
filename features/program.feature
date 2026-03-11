@authenticated
Feature: Program Functionality

  Background:
    Given user is on the select program page

  Scenario: User can search program
    When user searches for program "Program Geotagging - North Rosalinda" and expect to be true
    And user clears the search field

  Scenario: User can refresh the program
    When user clicks the refresh program button
    Then user should see message "Data program berhasil diperbarui."

  Scenario: User can download program
    When user selects programs to download
    And user clicks the download button
    And user should see download information "Sedang Mengunduh..."
    And user should see progress download
    Then user should see download information "Unduhan Selesai"