@regression
Feature: 30 prompts search
  As a logged-in user
    I want to access and view my dashboard and the Deep Agent search and overview
    So that I can explore available search prompts and understand the Deep Agent's capabilities

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    When I click the deep Agent option

  @DeepAgentSearchPrompt
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | promat_user_search                                                                                                                                                                               | follow_up_query                                                                                                                                                          |
      | Summarize key updates from the last 4 hours in #prod-releases on abacusai.slack.com, and email the PDF summary to udaysingh@abacus.ai.                                                           | Your Call                                                                                                                                                                |
      | Fetch my emails from Gmail and summarise the activity in the past day. Give an overview                                                                                                          | your call                                                                                                                                                                |
      | search Elon Musk and create pdf file                                                                                                                                                             | Elon Musk's life or career in the PDf                                                                                                                                    |
      | Connect To Gmail And Automate Work                                                                                                                                                               | Find sent emails with no replies                                                                                                                                         |
      | Slack to improve productivity                                                                                                                                                                    | Your call with limited functionality.                                                                                                                                    |
      | How does media coverage influence public opinion during election campaigns?                                                                                                                      | Your call with limited functionality.                                                                                                                                    |
      | write detailed PDF report on India Pakistan conflicts after 2000                                                                                                                                 | Your call with limited functionality.                                                                                                                                    |
      | Create a literature review document about model context protocol, make sure to include all the top rated literature and content from Anthropic. Deliver a docx/pdf file. Keep it under 15 pages. | Model Context Protocol technical professional, 15 pages with detailed structure                                                                                          |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage:                                                                                                              | Make sure it has a nice, cool pastel color palette and focuses on classic romance                                                                                        |
      | Build A Game                                                                                                                                                                                     | Your call with limited functionality.                                                                                                                                    |
      | On-The-Fly Interactive Jira Dashboard                                                                                                                                                            | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon                                                      |
      | Luxury Trip To Bali                                                                                                                                                                              | Luxury mid-range budget relaxation for next month                                                                                                                        |
      | Dinner Reservations                                                                                                                                                                              | Book a table for 5 this Sunday at 1:00 PM for lunch at any Italian restaurant near Connaught Place, Delhi — no special preferences. Create a pdf of the restaurant list. |
      | Hot or Not - hollywood edition                                                                                                                                                                   | Your call with limited functionality.                                                                                                                                    |

  @DeepAgentSearchPromptForEmailSend
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    Examples:
      | promat_user_search                                                                                      | follow_up_query |
      | Fetch all the high priority Jira tickets with label next-week and mail a summary to udaysingh@abacus.ai | your call       |

  @DeepAgentChatBot
  Scenario Outline: create Ai chat Bot DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | promat_user_search    | follow_up_query                                                                                                                |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively |

  @APPLLMImgGen
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results
    And I should deploy the website

    Examples:
      | promat_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | follow_up_query                                                                                                                  |
      | Create a website called AI art gallery. the website should have 10 different artworks generated by AI. It should talk about different aspects and philosophy of art and how it will evolve with AI                                                                                                                                                                                                                                                                                   | Your call with limited functionality                                                                                             |
      | Create a website about Louvre Museum, Paris. The website should have a brief general overview about the history of the museum. The website should have another page that has a list of all the art pieces in the museum with images. Clicking on the image opens up a dedicated description page of that particular piece. Make sure to add accurate information and pictures                                                                                                        | add the top 25 arts, add a nice historic artsy touch to the website color theme and font that complements the Louvre's aesthetic |
      | Create a simple landing page website for this consulting firm that helps corporates find out the gen AI usecases in their workflows. THe website should have a contact us form that takes inputs from user and saves it in DB. Add all the necessary relevant content                                                                                                                                                                                                                | Your call with limited functionality                                                                                             |
      | Create a simple fitness tracker website with a form page where users can log exercises by selecting the type, weight, and reps or log cardio with time and calories burnt, and also record their daily food intake by entering food items and corresponding calories; a progress page that displays a date-wise table of all food and exercise entries; and a dashboard page that visualizes daily calorie intake, calories burnt, and net calorie intake through interactive graphs | no auth, yes store the data betweeen sessions, color scheme sage green, add weight tracking too                                  |

  @DeepAgentDefaultSingleSampleTaskPPT
  Scenario Outline: Search a single default sample task from deep Agent
    Given I click the check out from the welcome window
    When I search for a default sample task and enter "Generate a downloadable PowerPoint pptx file that provides a general overview of all major benchmarks used to evaluate LLMs, across 10 slides"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    Then I should see the search results for the default sample task

  @DeepAgentPowerpoint @test
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search a prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | promat_user_search                                                                                                                                                                    | follow_up_query       |
      | fetch data about formula one drivers for 2025 season. Create a powerpoint presentation that talks about each team, the drivers, team principle etc. Give some fun facts. Add pictures | proceed               |
      | create a presentation on climate change. 10 slides                                                                                                                                    | make the best choices |

  @DeepAgentMCPTask
  Scenario Outline: Search  default  mcp task from deep Agent
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    Then the compute points should not exceed 150k

    Examples:
      | promat_user_search                                                                                                                 | follow_up_query                              |
      | Create a comprehensive project management system for launching a new product using google tasks. Include tasks for market research | create two Google Tasks for market research. |

  @PromptForWebSiteCreation
  Scenario Outline: Search DeepAgent prompt
    Given I click the check out from the welcome window
    When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results
    And I should deploy the website
    And the website should display correct tabs, graphs, and navigation bar

    Examples:
      | promat_user_search                                                                                                                                                                                                                       | follow_up_query                                                                                                                            |
      | Build a responsive data dashboard website with sample graphs, left nav tabs for Dashboard, Analytics, Calculator, Calendar, and Settings; include a basic arithmetic calculator, an interactive calendar, and demo data for all visuals. | Use general demo data with a modern color scheme, include line, bar, and pie charts; the calendar should support viewing and adding events |
