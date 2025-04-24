Feature: Dashboard Functionality
  As a logged in user
  I want to access and view my dashboard
  So that I can see my personalized information and overview

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    When I click the deep Agent option

  @DeepAgentHomePage @smoke
  Scenario: Check default prompt from the Deep Agent popup window and verify "Cancel" and "Try" buttons
    Given I click the check out from the welcome window
    When I open the Deep Agent default sample task
    Then I should see the Deep Agent popup window
    And I should see the Cancel and Try it buttons

  @DeepAgentDefaultSingleSampleTask @smoke
  Scenario Outline: Search a single default sample task from deep Agent
    Given I click the check out from the welcome window
    When I search for a default sample task and enter "your call"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 290000lakh
    And I should download the generated summary
    Then I should see the search results for the default sample task

  @DeepAgentSearchPrompt @smoke
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 290000lakh
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | promat_user_search                   | follow_up_query                       |
      | search Elon Musk and create pdf file | Elon Musk's life or career in the PDf |

  @DeepAgentDefaultAllSampleTask @regression
  Scenario Outline: Search a single default sample task from deep Agent
    Given I click the check out from the welcome window
    When I search for all default sample task "<sampleTaskName>" and enter "<Specify_the_prompat>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 290000lakh
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | sampleTaskName                        | Specify_the_prompat                                                                                                 |
      | Technical Report About MCP            | Model Context Protocol technical professional, 15 pages with detailed structure                                     |
      | Presentation On LLM Benchmarks        | General audience                                                                                                    |
      | Bookclub Website                      | Make sure it has a nice, cool pastel color palette and focuses on classic romance                                   |
      | Build A Game                          | your call                                                                                                           |
      | On-The-Fly Interactive Jira Dashboard | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon |
      | Luxury Trip To Bali                   | Luxury mid-range budget relaxation for next month                                                                   |
      | Dinner Reservations                   | Sunday lunch for 5                                                                                                  |
      | Connect To Gmail And Automate Work    | Any                                                                                                                 |
