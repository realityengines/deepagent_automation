Feature: Login Functionality
  As a user
  I want to be able to log in to the application
  So that I can access my account

  @valid_login
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid username "testuser1744775890841@internalreai.com"
    And I enter valid password "Testuser@123"
    And I click the login button
    Then I should be logged in successfully

  @Login
  Scenario: Login to the application
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
   
