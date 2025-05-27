# @customprompat
# Feature: 30 prompts search
#   As a logged-in user
#     I want to access and view my dashboard and the Deep Agent search and overview
#     So that I can explore available search prompts and understand the Deep Agent's capabilities

#   Background:
#     Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
#     Then I should be logged in successfully
#     When I click the deep Agent option
#   @DeepAgentSearchPrompt @smoke
#   Scenario Outline: Search DeepAgent prompt
#     Given I click the check out from the welcome window
#     When I search the prompt "<promat_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should download the generated summary
#     And I should fetch the search results

#     Examples:
#       | promat_user_search                                                          | follow_up_query                       |
#       | search Elon Musk and create pdf file                                        | Elon Musk's life or career in the PDf |
#       | Connect To Gmail And Automate Work                                          | Find sent emails with no replies      |
#       | Slack to improve productivity                                               | Your call with limited functionality. |
#       | How does media coverage influence public opinion during election campaigns? | Your call with limited functionality. |
#       | write detailed PDF report on India Pakistan conflicts after 2000            | Your call with limited functionality. |

