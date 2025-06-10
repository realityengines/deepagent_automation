# Feature: Deep Agent Default Prompt Functionality Test
#     As a logged-in user
#     I want to access and view my dashboard and the Deep Agent search and overview
#     So that I can explore available search prompts and understand the Deep Agent's capabilities

#   Background:
#     Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
#     Then I should be logged in successfully
#     When I click the deep Agent option

#   @DeepAgentHomePage @smoke
#   Scenario: Check default prompt from the Deep Agent popup window and verify "Cancel" and "Try" buttons
#     Given I click the check out from the welcome window
#     When I open the Deep Agent default sample task
#     Then I should see the Deep Agent popup window
#     And I should see the Cancel and Try it buttons

#   @DeepAgentDefaultSingleSampleTaskPPT @smoke
#   Scenario Outline: Search a single default sample task from deep Agent
#     Given I click the check out from the welcome window
#     When I search for a default sample task and enter "Generate a downloadable PowerPoint pptx file that provides a general overview of all major benchmarks used to evaluate LLMs, across 10 slides"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should download the generated summary
#     Then I should see the search results for the default sample task
# #   @DeepAgentSearchPrompt @smoke
# #   Scenario Outline: Search DeepAgent prompt
# #     Given I click the check out from the welcome window
# #     When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
# #     And I should see the status "Completed" for the task
# #     And the compute points should not exceed 150k
# #     And I should download the generated summary
# #     And I should fetch the search results
# #     Examples:
# #       | promat_user_search                                                          | follow_up_query                       |
# #       | search Elon Musk and create pdf file                                        | Elon Musk's life or career in the PDf |
# #       | Connect To Gmail And Automate Work                                          | Find sent emails with no replies      |
# #       | Slack to improve productivity                                               | Your call with limited functionality. |
# #       | How does media coverage influence public opinion during election campaigns? | Your call with limited functionality. |
# #       | write detailed PDF report on India Pakistan conflicts after 2000            | Your call with limited functionality. |

#   @DeepAgentDefaultAllSampleTask @regression
#   Scenario Outline: Search  default sample task from deep Agent
#     Given I click the check out from the welcome window
#     When I search for all default sample task "<sampleTaskName>" and enter "<Specify_the_prompat>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should download the generated summary
#     Then I should see the search results for the default sample task

#     Examples:
#       | sampleTaskName                  | Specify_the_prompat                                                                                              |
#       | Website for a summer camp       | Make sure it has a nice, cool pastel color palette and focuses on classic romance                                |
#       | Build A Game                    | Your call with limited functionality.                                                                            |
#       | Luxury Trip To Bali             | Luxury mid-range budget relaxation for next month                                                                |
#       | Dinner Reservations             | Looking to book a table for 5 for Sunday lunch—do you have any availability around 12:30–1:30 PM?  create a file |
#       | Hot or Not - hollywood edition  | Your call with limited functionality.                                                                            |
#       | In-depth EV battery research    | include  major and medium scale ones \n lithium ion                                                              |
#     #   | On-The-Fly Salesforce Reporting | yes, configure the server and analyze the past 4 weeks                                                           |
#     #   | Technical Report About MCP            | Model Context Protocol technical professional, 15 pages with detailed structure                                     |
#     #   | On-The-Fly Interactive Jira Dashboard | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon |

#   @DeepAgentMCPTask @regression
#   Scenario Outline: Search  default  mcp task from deep Agent
#     Given I click the check out from the welcome window
#     When I search for all default sample task "<sampleTaskName>" and enter "<Specify_the_prompat>"
#     And I should see the status "Completed" for the task
#     Then the compute points should not exceed 150k

#     Examples:
#       | sampleTaskName      | Specify_the_prompat                          |
#       | MCP meets DeepAgent | create two Google Tasks for market research. |

#   @DeepAgentChatBot @smoke
#   Scenario Outline: create Ai chat Bot DeepAgent prompt
#     Given I click the check out from the welcome window
#     When I search the chat bot prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
#     And the compute points should not exceed 150k
#     Then Then I can see the custom chat and perform some action

#     Examples:
#       | promat_user_search    | follow_up_query                                                                                                                |
#       | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively |
