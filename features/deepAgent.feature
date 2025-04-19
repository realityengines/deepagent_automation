Feature: Dashboard Functionality
  As a logged in user
  I want to access and view my dashboard
  So that I can see my personalized information and overview

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    When I click the deep Agent option
# Not fully implemented due to limit reached

  @DeepAgent
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    Then I should see a prompt that tests factual recall and accuracy of the response
    And I should see the status "Completed" for the task
    And the compute points should not exceed 50k

    Examples:
      | promat_user_search                                                                     | follow_up_query               |
      | Who is the current PM and Governor General of Canada?                                  | No follow-up questions please |
      | What is photosynthesis in one sentence?                                                | your call                     |
      # | Create a technical report on MCP. It should not be more more than 15 pages in pdf file | Master Control Program        |
