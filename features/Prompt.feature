@regression
Feature: Deep Agent Search and Task Execution
  As a logged-in user
    I want to access and view my dashboard and the Deep Agent search and overview
    So that I can explore available search prompts and understand the Deep Agent's capabilities

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
     Then I click on skip button
    And I select the default LLM "RouteLLM"
    When I click the deep Agent option

  @DeepAgentSearchPrompt
  Scenario Outline: Execute Deep Agent search prompt and validate results
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                                                                                                               | follow_up_query                                                                                                                                                          |
      | Fetch my emails from Gmail and summarise the activity in the past day. Give an overview                                                                                                          | your call                                                                                                                                                                |
      | search Elon Musk and create pdf file                                                                                                                                                             | Elon Musk's life or career in the PDf                                                                                                                                    |
      | Connect To Gmail And Automate Work                                                                                                                                                               | Find sent emails with no replies                                                                                                                                         |
      | Create a daily report of unresolved tickets from Slack messages                                                                                                                                  | Daily reporting                                                                                                                                                          |
      | How does media coverage influence public opinion during election campaigns?                                                                                                                      | Your call with limited functionality.                                                                                                                                    |
      | write detailed PDF report on India Pakistan conflicts after 2000                                                                                                                                 | Your call with limited functionality.                                                                                                                                    |
      | Create a literature review document about model context protocol, make sure to include all the top rated literature and content from Anthropic. Deliver a docx/pdf file. Keep it under 15 pages. | Model Context Protocol technical professional, 15 pages with detailed structure                                                                                          |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage:                                                                                                              | Make sure it has a nice, cool pastel color palette and focuses on classic romance                                                                                        |
      | Build A Game                                                                                                                                                                                     | Your call with limited functionality.                                                                                                                                    |
      | On-The-Fly Interactive Jira Dashboard                                                                                                                                                            | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon                                                      |
      | Luxury Trip To Bali                                                                                                                                                                              | Luxury mid-range budget relaxation for next month                                                                                                                        |
      | Find reservations at an upscale indian dinner restaurant in San Francisco.                                                                                                                       | Book a table for 5 this Sunday at 1:00 PM for lunch at any Italian restaurant near Connaught Place, Delhi — no special preferences. Create a pdf of the restaurant list. |
      | Hot or Not - hollywood edition                                                                                                                                                                   | Your call with limited functionality.                                                                                                                                    |
      | In-depth EV battery research                                                                                                                                                                     | include  major and medium scale ones \n lithium ion                                                                                                                      |
      # | Summarize key updates from the last 4 hours in #prod-releases on abacusai.slack.com, and email the PDF summary to udaysingh@abacus.ai.                                                           | Your Call                                                                                                                                                                |

  @DeepAgentSearchPromptForEmailSend
  Scenario Outline: Trigger email summary via Deep Agent
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task

    Examples:
      | prompt_user_search                                                                                      | follow_up_query |
      | Fetch all the high priority Jira tickets with label next-week and mail a summary to udaysingh@abacus.ai | your call       |

  @DeepAgentChatBot
  Scenario Outline: Generate AI chatbot
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                            |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively , and create a chatbot link |

  @APPLLMImgGen
  Scenario Outline: Generate website with AI content using Deep Agent
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results
    And I should deploy the website

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | follow_up_query                                                                                                                  |
      | Create a website called AI art gallery. the website should have 10 different artworks generated by AI. It should talk about different aspects and philosophy of art and how it will evolve with AI                                                                                                                                                                                                                                                                                   | Your call with limited functionality                                                                                             |
      | Create a website about Louvre Museum, Paris. The website should have a brief general overview about the history of the museum. The website should have another page that has a list of all the art pieces in the museum with images. Clicking on the image opens up a dedicated description page of that particular piece. Make sure to add accurate information and pictures                                                                                                        | add the top 25 arts, add a nice historic artsy touch to the website color theme and font that complements the Louvre's aesthetic |
      | Create a simple landing page website for this consulting firm that helps corporates find out the gen AI usecases in their workflows. THe website should have a contact us form that takes inputs from user and saves it in DB. Add all the necessary relevant content                                                                                                                                                                                                                | Your call with limited functionality                                                                                             |
      | Create a simple fitness tracker website with a form page where users can log exercises by selecting the type, weight, and reps or log cardio with time and calories burnt, and also record their daily food intake by entering food items and corresponding calories; a progress page that displays a date-wise table of all food and exercise entries; and a dashboard page that visualizes daily calorie intake, calories burnt, and net calorie intake through interactive graphs | no auth, yes store the data betweeen sessions, color scheme sage green, add weight tracking too                                  |

  @DeepAgentPowerpoint @pptx
  Scenario Outline: Generate PowerPoint presentations from prompt
    Given I click the check out from the welcome window
    When I search a prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                                                                                                    | follow_up_query       |
      | fetch data about formula one drivers for 2025 season. Create a powerpoint presentation that talks about each team, the drivers, team principle etc. Give some fun facts. Add pictures | proceed               |
      | create a presentation on climate change. 10 slides                                                                                                                                    | make the best choices |
      | Internet safety tips for teenagers for class 8th PPT                                                                                                                                  | Your choice           |

  @DeepAgentMCPTask
  Scenario Outline: Search default MCP task from Deep Agent
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    Then the compute points should not exceed 150k

    Examples:
      | prompt_user_search                                                                                                                 | follow_up_query                              |
      | Create a comprehensive project management system for launching a new product using google tasks. Include tasks for market research | create two Google Tasks for market research. |

  @PromptForWebSiteCreation
  Scenario Outline: Validate website generation with UI elements
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results
    And I should deploy the website
    And the website should display correct tabs, graphs, and navigation bar

    Examples:
      | prompt_user_search                                                                                                                                                                                                                       | follow_up_query                                                                                                                            |
      | Build a responsive data dashboard website with sample graphs, left nav tabs for Dashboard, Analytics, Calculator, Calendar, and Settings; include a basic arithmetic calculator, an interactive calendar, and demo data for all visuals. | Use general demo data with a modern color scheme, include line, bar, and pie charts; the calendar should support viewing and adding events |

  @DeepAgentVideoGeneration @VideoGeneration
  Scenario Outline: Validate video generation through Deep Agent
    Given I click the check out from the welcome window
    When I search for the prompt for video generation "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
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
      | prompt_user_search                                                                                                                                                                                                                                                                                                         | follow_up_query                                                                                                                                                              | Prompt_for_custom_chatBot                   |
      | Create a chatbot with deep knowledge of ATP tennis tournaments, player stats, and official rules. The chatbot should be able to help users create a website showing the ATP tournament schedule. Please give me the chatbot link along with a live preview window or deployed site where I can test the chatbot in action. | Focus the chatbot on ATP tournament info, player stats, and rules, keep it ATP-only for now; show just the schedule on the site, embed the chatbot as a floating chat widget | Create a website for booking tennis courts. |

  @PromptForDatabaseValidation
  Scenario Outline: Validate the database after website creation and deployment
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I validate that the login functionality works correctly
    Then the user completes the registration process successfully and verify the database


    Examples:
      | prompt_user_search                                                                                                                                                           | follow_up_query                                                                                                                                                                                      |
      | create a website for women in product community, make the website content rich, it should have 6 pages, add a login and signup flow for users and also add a contact us form | For the Join Us page, add a form with fields: First Name, Last Name, Email, Password, and Confirm Password. For the Contact Us page, add a form with fields: Full Name, Email, Subject, and Message. |

 
  @AIAppsContractor 
  Scenario Outline: Validate database after uploading a file
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I upload the file and validate the database integrity
    Examples:
      | prompt_user_search                                                                                                                                                                                 | follow_up_query                                                                                                                                                    |
      | build a contract terms extractor. Upload your contract and it will extract key contract terms Ensure the home page displays a drag-and-drop section for uploading contract files (PDF, DOCX, TXT). | The extractor should support PDF, Word, and text files, extract key terms, and display them in a categorized table with optional highlights and confidence scores. |

  @AIAppsResumeAnalysis
  Scenario Outline: Validate the resume analysis functionality
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I enter the resume details and analysis the resume
    Examples:
      | prompt_user_search                                                                                                                                                               | follow_up_query                                                                |
      | Build a resume evaluator - users can cut and paste a resume and we should evaluate it after click on submit button and give them insights on how well their resume is structured | general content quality, don't need score system, give improvement suggestions |
      
  @AIAppsRecipeCreator 
  Scenario Outline: Validate the response after generating a recipe
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I enter the ingredients and validate the generated response
    Examples:
      | prompt_user_search                                                                                                                                                                                                                              | follow_up_query                                                     |
      | Generate an app with a form where users enter 3 ingredients. When they submit, the app uses an LLM to generate 4–5 unique recipes using those ingredients. Each recipe should have a title, list of ingredients, and step-by-step instructions. | Yes, ask the user and process it locally. Also, provide the status. |