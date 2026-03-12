@authenticated
Feature: Program Functionality

  Background:
    Given user is on the select program page

  Scenario: User can search and clear search program
    When user searches for program "North Rosalinda"
    Then user should see the program "Program Geotagging - North Rosalinda" in the list
    And user should not see the program "Program Geotagging Monitoring 2 fix"
    When user clears the search field
    Then user should see the searchfield placeholder is "Cari Program"

  Scenario: User can refresh the program
    When user clicks the refresh program button
    Then user should see message "Data program berhasil diperbarui."

  Scenario: User can download program
    When user selects programs to download
    And user clicks the download button
    Then user should see download information "Sedang Mengunduh..."
    And user should see progress download
    And user should see download information "Unduhan Selesai"
    When user click button complete
    Then user redirected to privacy page
