@authenticated
Feature: Geotagging Functionality

  Background:
    Given user is on the homepage
    And user ensures geotagging button is visible

  Scenario: User performs geotagging and submits data until success
    When user clicks on Geotagging menu
    And user selects block "Land regy 1"
    Then user should see Informasi tab with block "Land regy 1" and owner "Owner regy 1"
    And user should see Lokasi tab with text "Lokasi Blok"
    And user should see GPS tab with valid coordinates
    And user clicks Kunci Lokasi button
    And user fills geotagging form with species "Jambu Mutiara", condition "Baik", diameter "5" and height "8"
    And user takes a photo of the tree
    And user clicks Simpan button
    And user opens the Tinjau tab
    And user verifies Tinjau card contains block "Land regy 1", species "Jambu Mutiara", diameter "5" and height "8"
    And user confirms checkboxes and submits all data
    Then user should see success notification and click Selesai

  Scenario: User tries to save photo without mandatory data
    When user clicks on Geotagging menu
    And user selects block "Land regy 1"
    And user clicks Kunci Lokasi button
    And user just fills geotagging form with species "Jambu Mutiara"
    And user takes a photo of the tree
    And user clicks Simpan button
    Then user should see message "Lengkapi data mandatory."

  # Scenario: User performs geotagging multiple times with loop
  #   And user performs looping geotagging 10 times with species "Jambu Mutiara", condition "Baik", diameter "5" and height "8"
  #   And user opens the Tinjau tab
  #   And user confirms checkboxes and submits all data
  #   Then user should see success notification and click Selesai
  #   And user should return to the dashboard
