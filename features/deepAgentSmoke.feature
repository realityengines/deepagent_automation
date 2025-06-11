@smoke
Feature: Deep Agent Functionality Test
    As a logged-in user
    I want to access and view my dashboard and the Deep Agent search and overview
    So that I can explore available search prompts and understand the Deep Agent's capabilities

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    And I select the default LLM "RouteLLM"
    When I click the deep Agent option

  Scenario: check  and verify "Cancel" and "Try" buttons on default prompt
    Given I click the check out from the welcome window
    When I open the Deep Agent default sample task
    Then I should see the Deep Agent popup window
    And I should see the Cancel and Try it buttons

  @DeepAgentApp
  Scenario Outline: creates an app based on task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task
    And I should deploy the website

    Examples:
      | promat_user_search                                                                                                                                       | follow_up_query                                                                   |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage: Add title banner stating 15 days Summer camp for kids of age 4 to 18 | Make sure it has a nice, cool pastel color palette and focuses on classic romance |

  @deepAgentIntergation
  Scenario Outline: integration the app based on the task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | promat_user_search                 | follow_up_query                       |
      | Connect To Gmail And Automate Work | Find sent emails with no replies      |
      | Slack to improve productivity      | Your call with limited functionality. |

  @DeepAgentResearch
  Scenario Outline: Research functionality base on task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | promat_user_search  | follow_up_query                                   |
      | Luxury Trip To Bali | Luxury mid-range budget relaxation for next month |

  @DeepAgentBrowserUse
  Scenario Outline: browseruse functionality
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | promat_user_search                                                         | follow_up_query                                                                                                  |
      | Find reservations at an upscale indian dinner restaurant in San Francisco. | Looking to book a table for 5 for Sunday lunch—do you have any availability around 12:30–1:30 PM?  create a file |

  @DeepAgentChatBot
  Scenario Outline: Generate AI chatbot
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | promat_user_search    | follow_up_query                                                                                                                |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively |

  @DeepAgentPowerpoint @pptx
  Scenario Outline: generate pptx base  on task prompt
    Given I click the check out from the welcome window
    When I search a prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | promat_user_search                                                                                  | follow_up_query                                                                       |
      | Create a 5-slide pitch on entering the U.S. skincare market with an affordable, clean beauty brand. | Can you add recent data (2024/2025) on affordable skincare market growth in the U.S.? |

  @DeepAgentVideoGeneration @VideoGeneration
  Scenario Outline: generation of video base on task prompt
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should see the generated video

    Examples:
      | promat_user_search                                       | follow_up_query |
      | Can you create a video on the top 5 most expensive cars? | your call       |

  @DeepAgentChatCustomBot
  Scenario Outline: AI chatbot for custom interactions
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results
    Then I can see the custom chat and perform some action and search the prompt "<Prompt_for_custom_chatBot>"

    Examples:
      | promat_user_search                                                                                                                                                                                                                                                                       | follow_up_query | Prompt_for_custom_chatBot                                                |
      | Create a chatbot with deep knowledge of ATP tennis tournaments. The chatbot should be able to help users create a website showing the ATP tournament schedule. Please give me the chatbot link along with a live preview window or deployed site where I can test the chatbot in action. | Your call       | What are the key matchups to watch in the upcoming Wimbledon tournament? |

  @DeepAgentDataBase
  Scenario Outline: creates an app based on task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task
    And I should deploy the website
    Then the user completes the registration process successfully and verify the database

    Examples:
      | promat_user_search                                                                                                                                                                                                                                | follow_up_query                                                                                                                                                         |
      | Create a website with a home page, login page, and sign-up page connected to a database. The sign-up page must always show four fixed fields: full name, email, password, and confirm password, and store user data upon successful registration. | Build me a portfolio website with user authentication, where sign-up stores user data in the database, and login redirects to the home page with a clean, modern design |
