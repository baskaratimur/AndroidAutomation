@authenticated
Feature: Privacy and Policy Functionality

  Background:
    Given user is on privacy page

  Scenario: User can accept privacy and policy and redirect to homepage
    When user accept privacy and policy
    And user click button lanjut
    Then user redirected to homepage