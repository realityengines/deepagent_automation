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
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task
    And I should deploy the website

    Examples:
      | prompt_user_search                                                                                                                                       | follow_up_query                                                                   |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage: Add title banner stating 15 days Summer camp for kids of age 4 to 18 | Make sure it has a nice, cool pastel color palette and focuses on classic romance |

  @deepAgentIntergation
  Scenario Outline: integration the app based on the task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                          | follow_up_query |
      | Connect To Gmail And Automate Work. Summarise the last 5 days emails and create a pdf file. | All your call   |
      | How to manage notifications in Slack to avoid distractions and stay focused                 | Daily reporting |

  @DeepAgentResearch
  Scenario Outline: Research functionality base on task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | prompt_user_search  | follow_up_query                                   |
      | Luxury Trip To Bali | Luxury mid-range budget relaxation for next month |

  @DeepAgentBrowserUse
  Scenario Outline: browseruse functionality
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

    Examples:
      | prompt_user_search                                                         | follow_up_query                                                                                                  |
      | Find reservations at an upscale indian dinner restaurant in San Francisco. | Looking to book a table for 5 for Sunday lunch—do you have any availability around 12:30–1:30 PM?  create a file |

  @DeepAgentChatBot
  Scenario Outline: Generate AI chatbot
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                            |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively , and create a chatbot link |

  @DeepAgentPowerpoint @pptx
  Scenario Outline: generate pptx base  on task prompt
    Given I click the check out from the welcome window
    When I search a prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                  | follow_up_query                                                                       |
      | Create a 5-slide pitch on entering the U.S. skincare market with an affordable, clean beauty brand. | Can you add recent data (2024/2025) on affordable skincare market growth in the U.S.? |

  @DeepAgentVideoGeneration @VideoGeneration
  Scenario Outline: generation of video base on task prompt
    Given I click the check out from the welcome window
    When I search for the prompt for video generation "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    And I should see the generated video

    Examples:
      | prompt_user_search                                       | follow_up_query |
      | Can you create a video on the top 5 most expensive cars? | your call       |

  @DeepAgentChatCustomBot
  Scenario Outline: AI chatbot for custom interactions
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    Then I can see the custom chat and perform some action and search the prompt "<Prompt_for_custom_chatBot>"

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                  | follow_up_query | Prompt_for_custom_chatBot                                                |
      | Create a chatbot with deep knowledge of ATP tennis tournaments. The chatbot should be able to help users create a website showing the ATP tournament schedule. Please give me the chatbot link along with a live preview window or deployed site where I can test the chatbot in action.  and create a chatbot link | Your call       | What are the key matchups to watch in the upcoming Wimbledon tournament? |

  @DeepAgentDataBase
  Scenario Outline: creates an app based on task prompt
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task
    And I should deploy the website
    Then the user completes the registration process successfully and verify the database

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                            | follow_up_query                                                                                                                                                         |
      | Create a website with a home page, login page, and sign-up page with header connected to a database. The sign-up page must always show four fixed fields: full name, email, password, and confirm password, and store user data upon successful registration. | Build me a portfolio website with user authentication, where sign-up stores user data in the database, and login redirects to the home page with a clean, modern design |

  @DeepAgentUrl
  Scenario Outline: creates an app and verify the urls
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                    | follow_up_query |
      | Create a clean, simple multi-page website for a small store with three pages: Home, Items, and Contact. Each page should have the store name at the top, a navigation menu with links to all pages in the header, footer, and also inside the main content. Use only internal links between the pages | Your Call       |

  @AIRecipeCreator
  Scenario Outline: Validate the database after website creation and deployment
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I enter the ingredients and validate the generated response

    Examples:
      | prompt_user_search                                                                                                                                                                                                                              | follow_up_query                                                     |
      | Generate an app with a form where users enter 3 ingredients. When they submit, the app uses an LLM to generate 4–5 unique recipes using those ingredients. Each recipe should have a title, list of ingredients, and step-by-step instructions. | Yes, ask the user and process it locally. Also, provide the status. |

  @DaemonsPromptReservationTask
  Scenario Outline: Validate daemons prompt execution with browser-based query
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the deep agent browser created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                          | follow_up_query                                                                          |
      | send me dinner reservations to a fancy restaurant in new york every thursday at 6 pm and send it over email | city - new York, time 6 pm, table for 2, udaysingh@abacus.ai , fine dining, starting now |

  @DaemonsPromptInfluencer
  Scenario Outline: Validate daily trending topic suggestions for an influencer
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should download the generated summary
    Then I click on the test task
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                                                                                                                      | follow_up_query                                             |
      | I am an influencer who posts about entertainment, pop culture, fashion etc. Help me with grabbing the trending topics on social media. Everyday at night provide me a list of 5 ideas that can go viral | 1. 10pm 2. instagram, tiktok and youtube 3. save it to file |

  @DaemonsPromptSMD 
  Scenario Outline: Validate AI-generated Twitter post scheduling for trending tech content
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the Twitter MCP has been created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                  | follow_up_query                          |
      | Write a  witty and well thought through pun around AI and tech and post it one tweet every 3 hours. | run it for next 24 hours rest you decide |
