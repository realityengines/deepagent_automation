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

  @AppsCreation
  Scenario Outline: Verify application creation
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task
    And I should deploy the website

    Examples:
      | prompt_user_search                                                                                                                                       | follow_up_query                                                                   |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage: Add title banner stating 15 days Summer camp for kids of age 4 to 18 | Make sure it has a nice, cool pastel color palette and focuses on classic romance |

  @Intergation
  Scenario Outline: Verify Deep Agent integrate
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                          | follow_up_query |
      | Connect To Gmail And Automate Work. Summarise the last 5 days emails and create a pdf file. | All your call   |
      # | On-The-Fly Interactive Jira Dashboard                                                       | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon |
      # | How to manage notifications in Slack to avoid distractions and stay focused                 | Daily reporting   |

  @Research
  Scenario Outline: Verify Deep Agent's  research
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | prompt_user_search  | follow_up_query                                   |
      | Luxury Trip To Bali | Luxury mid-range budget relaxation for next month |

  @BrowserUse
  Scenario Outline: Verify browser task execution
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | prompt_user_search                                                         | follow_up_query                                                                                                  |
      | Find reservations at an upscale indian dinner restaurant in San Francisco. | Looking to book a table for 5 for Sunday lunch—do you have any availability around 12:30–1:30 PM?  create a file |

  @ChatBot
  Scenario Outline: Verify chatbot creation
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                            |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively , and create a chatbot link |

  @Powerpoint
  Scenario Outline: Verify PowerPoint presentation generation
    Given I click the check out from the welcome window
    When I search a prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                  | follow_up_query                                                                       |
      | Create a 5-slide pitch on entering the U.S. skincare market with an affordable, clean beauty brand. | Can you add recent data (2024/2025) on affordable skincare market growth in the U.S.? |

  @VideoGeneration
  Scenario Outline: Verify video generation
    Given I click the check out from the welcome window
    When I search for the prompt for video generation "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    And I should see the generated video

    Examples:
      | prompt_user_search                                       | follow_up_query |
      | Can you create a video on the top 5 most expensive cars? | your call       |

  @ChatCustomBot
  Scenario Outline: Verify custom AI chatbot generation and interactions
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    Then I can see the custom chat and perform some action and search the prompt "<Prompt_for_custom_chatBot>"

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                  | follow_up_query | Prompt_for_custom_chatBot                                                |
      | Create a chatbot with deep knowledge of ATP tennis tournaments. The chatbot should be able to help users create a website showing the ATP tournament schedule. Please give me the chatbot link along with a live preview window or deployed site where I can test the chatbot in action.  and create a chatbot link | Your call       | What are the key matchups to watch in the upcoming Wimbledon tournament? |

  @DataBaseValidation
  Scenario Outline: Verify user registration and database integration
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    Then I should see the search results for the default sample task
    And I should deploy the website
    Then the user completes the registration process successfully and verify the database

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                            | follow_up_query                                                                                                                                                         |
      | Create a website with a home page, login page, and sign-up page with header connected to a database. The sign-up page must always show four fixed fields: full name, email, password, and confirm password, and store user data upon successful registration. | Build me a portfolio website with user authentication, where sign-up stores user data in the database, and login redirects to the home page with a clean, modern design |

  @VerifyAllTheURL
  Scenario Outline: Verify all internal page URLs return HTTP 200 after website deployment
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                    | follow_up_query |
      | Create a clean, simple multi-page website for a small store with three pages: Home, Items, and Contact. Each page should have the store name at the top, a navigation menu with links to all pages in the header, footer, and also inside the main content. Use only internal links between the pages | Your Call       |

  @AIAppsRecipeCreator
  Scenario Outline: Verify AI application functionality
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I enter the ingredients and validate the generated response

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                      | follow_up_query                                                     |
      | Create an app with a form where users can enter three ingredients. The form should have three input fields, each with the placeholder text Ingredient. When the user submits the form, the app should use a large language model (LLM) to generate 4–5 unique recipes that use the provided ingredients | Yes, ask the user and process it locally. Also, provide the status. |

  @DaemonsPromptReservationTask @Daemons
  Scenario Outline: Verify reservation task
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the deep agent browser created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                          | follow_up_query                                                                          |
      | send me dinner reservations to a fancy restaurant in new york every thursday at 6 pm and send it over email | city - new York, time 6 pm, table for 2, udaysingh@abacus.ai , fine dining, starting now |
