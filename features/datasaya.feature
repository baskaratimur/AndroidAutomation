@authenticated
Feature: Data Saya Analytics
  Background:
    Given user is on the homepage
  
  Scenario: User searches for stored tree code in Data Saya
    When user navigates to Data Saya page
    And user clicks Detail button in Data Saya page
    And user searches for stored tree code
    Then user verifies tree code details with species "Jambu Mutiara", diameter "5.0", height "8.0"

  Scenario: User updates data and validates historical items
    When user navigates to Data Saya page
    And user clicks Perbarui Data button in Data Saya page
    Then user should see progress download
    And user should see download information "Selesai"
    And user clicks Selesai button in Data Saya
    Then user validates Geotagging data stats