@regression
Feature: Deep Agent Search and Task Execution
  As a logged-in user
    I want to access and view my dashboard and the Deep Agent search and overview
    So that I can explore available search prompts and understand the Deep Agent's capabilities

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    And I select the default LLM "RouteLLM"
    When I click the deep Agent option

  @IntegrationPrompts
  Scenario Outline: Verify Deep Agent integrate
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                      | follow_up_query                                                                                                     |
      | Fetch my emails from Gmail and summarise the activity in the past day. Give an overview | your call                                                                                                           |
      | Connect To Gmail And Automate Work                                                      | Find sent emails with no replies                                                                                    |
      | On-The-Fly Interactive Jira Dashboard                                                   | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon |
      | Luxury Trip To Bali                                                                     | Luxury mid-range budget relaxation for next month                                                                   |
      # | Create a daily report of unresolved tickets from Slack messages                                                                        | Daily reporting                                                                                                     |
      # | Summarize key updates from the last 4 hours in #prod-releases on abacusai.slack.com, and email the PDF summary to udaysingh@abacus.ai. | Your Call                                                                                                           |

  @ResearchPrompts
  Scenario Outline: Verify Deep Agent's research prompts
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                          | follow_up_query                                                                                                                                                          |
      | search Elon Musk and create pdf file                                        | Elon Musk's life or career in the PDf                                                                                                                                    |
      | How does media coverage influence public opinion during election campaigns? | Your call with limited functionality.                                                                                                                                    |
      | write detailed PDF report on India Pakistan conflicts after 2000            | Your call with limited functionality.                                                                                                                                    |
      | In-depth EV battery research                                                | include  major and medium scale ones \n lithium ion                                                                                                                      |
      | Find reservations at an upscale indian dinner restaurant in San Francisco.  | Book a table for 5 this Sunday at 1:00 PM for lunch at any Italian restaurant near Connaught Place, Delhi — no special preferences. Create a pdf of the restaurant list. |

  @MCPPrompts
  Scenario Outline: Verify executes research prompts for MCP
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                                                                                                               | follow_up_query                                                                 |
      | Create a literature review document about model context protocol, make sure to include all the top rated literature and content from Anthropic. Deliver a docx/pdf file. Keep it under 15 pages. | Model Context Protocol technical professional, 15 pages with detailed structure |

  @APPsCreationPrompts
  Scenario Outline: Verify Deep Agent's  application creation
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                  | follow_up_query                                                                   |
      | Create a registration website for summer classes at Bell Hotel, Sivakasi. Homepage: | Make sure it has a nice, cool pastel color palette and focuses on classic romance |
      | Build A Game                                                                        | Your call with limited functionality.                                             |
      | Hot or Not - hollywood edition                                                      | Your call with limited functionality.                                             |

  @JiraIntegrationPrompt
  Scenario Outline: Verify  Deep Agent integrates with Jira
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task

    Examples:
      | prompt_user_search                                                                                      | follow_up_query |
      | Fetch all the high priority Jira tickets with label next-week and mail a summary to udaysingh@abacus.ai | your call       |

  @ChatBotPrompt
  Scenario Outline: Verify chatbot creation with personalized AI
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    Then Then I can see the custom chat and perform some action

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                            |
      | Personal AI assistant | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively , and create a chatbot link |

  @APPLLMPrompts
  Scenario Outline: Verify AI-generated website creation
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

  @Powerpoint
  Scenario Outline: Verify PowerPoint presentation generation
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

  @MCPPromptForGoogleTask
  Scenario Outline: Verify default MCP task search
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    Then the compute points should not exceed 150k

    Examples:
      | prompt_user_search                                                                                                                 | follow_up_query                              |
      | Create a comprehensive project management system for launching a new product using google tasks. Include tasks for market research | create two Google Tasks for market research. |

  @WebsiteCreation
  Scenario Outline: Verify website generation with UI elements
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

  @VideoGenerationPrompt
  Scenario Outline: Verify video generation
    Given I click the check out from the welcome window
    When I search for the prompt for video generation "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should see the generated video

    Examples:
      | prompt_user_search                                       | follow_up_query |
      | Can you create a video on the top 5 most expensive cars? | your call       |

  @AIChatCustomBot
  Scenario Outline: Verify custom AI chatbot generation
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    Then I can see the custom chat and perform some action and search the prompt "<Prompt_for_custom_chatBot>"

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                         | follow_up_query                                                                                                                                                              | Prompt_for_custom_chatBot                   |
      | Create a chatbot with deep knowledge of ATP tennis tournaments, player stats, and official rules. The chatbot should be able to help users create a website showing the ATP tournament schedule. Please give me the chatbot link along with a live preview window or deployed site where I can test the chatbot in action. | Focus the chatbot on ATP tournament info, player stats, and rules, keep it ATP-only for now; show just the schedule on the site, embed the chatbot as a floating chat widget | Create a website for booking tennis courts. |

  @AppLLmSignAuth
  Scenario Outline: Verify database and login functionality
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I validate that the login functionality works correctly
    Then I confirm that the user data is added successfully to the database

    Examples:
      | prompt_user_search                                                                                                                                                           | follow_up_query                                                                                                                                                                                      |
      | create a website for women in product community, make the website content rich, it should have 6 pages, add a login and signup flow for users and also add a contact us form | For the Join Us page, add a form with fields: First Name, Last Name, Email, Password, and Confirm Password. For the Contact Us page, add a form with fields: Full Name, Email, Subject, and Message. |

  @AIAppsContractor
  Scenario Outline: Verify file upload and contract term extraction
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
  Scenario Outline: Verify resume analysis functionality
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
  Scenario Outline: Verify functionality for recipe generation
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I enter the ingredients and validate the generated response

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                      | follow_up_query                                                     |
      | Create an app with a form where users can enter three ingredients. The form should have three input fields, each with the placeholder text Ingredient. When the user submits the form, the app should use a large language model (LLM) to generate 4–5 unique recipes that use the provided ingredients | Yes, ask the user and process it locally. Also, provide the status. |
      # | Generate an app with a form where users enter 3 ingredients. When they submit, the app uses an LLM to generate 4–5 unique recipes using those ingredients. Each recipe should have a title, list of ingredients, and step-by-step instructions. | Yes, ask the user and process it locally. Also, provide the status. |

  @DeepAgentlongPrompt
  Scenario Outline: Verify website creation for long prompt
    Given I click the check out from the welcome window
    When I search the long prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | follow_up_query                                                    |
      | You are a professional fitness trainer AI. Create customized workout programs based on the user’s inputs: age, height, weight, gender, body type (ectomorph, mesomorph, endomorph), fitness goals (fat loss, muscle gain, performance, toning, etc.), activity level (sedentary, light, moderate, very active), and training experience (beginner, intermediate, advanced). Output a full weekly workout plan (3–6 days/week) with progressive overload. Include sets, reps, rest time, and difficulty scaling. Ensure exercises are chosen for optimal muscle symmetry, joint safety, and aesthetic goals. Include illustration links or visual instructions for each exercise (use royalty-free or license-free illustration sources). Avoid generic plans—make them feel like they were written by a top-tier strength & conditioning coach.” :brain: Sample Data Flow & Inputs: Field Example Value Height 5’9” Weight 170 lbs Age 28 Gender Male Body Type Mesomorph Goals Build lean muscle and lose belly fat Activity Level Moderately Active Training Experience Intermediate :man-lifting-weights: Output Format Example: Day 1: Upper Body Strength 1A. Barbell Bench Press – 4 sets x 6 reps (90 sec rest) Illustration: [link or embedded image] 1B. Pull-Ups – 4 sets x max reps 2. Seated Dumbbell Shoulder Press – 3 sets x 10 reps 3. Triceps Rope Pushdown – 3 sets x 12 reps 4. Hanging Leg Raises – 3 sets x 15 reps :jigsaw: Features to Add: Progress tracking and adaptive programming. "Rate workout difficulty" at the end of sessions for AI tuning. Auto-switch exercises if injury or equipment restriction is noted. Goal-specific “training blocks” (hypertrophy, strength, HIIT cycles). Include warm-up and cooldown per day.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |    1. web app 2. form based 3. like all these features 4. database |
      | SweetBite Bakery (USA) – 5-Page Product Showcase Website (No Cart / No Ordering)\nCreate a 5-page responsive product showcase website for a small-town US-based bakery named "SweetBite Bakery", located in Bend, Oregon.\nThe purpose of this site is to present baked goods visually, highlight the team, publish blog tips, and encourage in-store visits — no online ordering, checkout, or cart features.\nGlobal Site Requirements\nApply the following to every page:\nUnique background color for each page\nDifferent Google font for each page\nHeader:\nLogo ("SweetBite Bakery")\nNavigation links: Home, Menu, About, Blog, Contact\nFooter:\nAddress: 203 NW Baker Ave, Bend, OR 97701\nPhone: (541) 555-8234\nEmail: hello@sweetbitebakery.com\nSocial icons: Instagram, Facebook, Yelp\nSticky sidebar (left or right) on at least 2 pages\nBack-to-top button\nHover interactions on cards and buttons\nResponsive layout for mobile, tablet, and desktop\nSearch bar and filter sections where applicable\nForms must have:\nPlaceholder text\nField validations\nConfirmation or error messages\nSEO-friendly structure:\nProper heading levels (h1, h2…)\nSemantic tags\nAlt text for all images\nPage Details\n1. Home Page\nBackground Color: #FFF8F1 (Vanilla Cream)\nFont: Poppins\nSections:\nHero Banner:\nBackground photo: bakery storefront in Oregon\nText overlay: “Small Batch, Big Smiles.”\nButton: “Explore Our Menu” → links to Menu page\nWelcome Note: A paragraph from the founder about baking since 2005\nShowcase Grid:\n3 featured items: Sourdough Brioche, Red Velvet Slice, Pumpkin Muffins\nEach card: photo, item name, 1-line description, seasonal tag\nButton: “See Details” → links to Menu page\nTestimonial Slider:\n3 customer quotes, auto-rotate\nRight Sidebar:\nInstagram 3-post preview\nQuick links to: Menu, Blog, Visit Us\nFooter:\nContact info, open hours, subscribe to newsletter\n2. Menu Page\nBackground Color: #FFF9DB (Pale Lemon)\nFont: Inter\nSections:\nSearch & Filter Toolbar:\nSearch bar with placeholder: “Search our treats...”\nFilters: Breads, Cakes, Cookies, Vegan, Gluten-Free\nProduct Grid (3-column):\nEach product:\nHigh-res image\nName: “Oatmeal Chocolate Chip”\nShort description (40–60 chars)\nTag(s): “Dairy-Free”, “Best Seller”\nButton: “View Item” → opens modal with more info\nLeft Sidebar:\nFilters by type\n“Staff Favorites” mini-feature section\nBreadcrumbs: Home > Menu\n3. About Page\nBackground Color: #EAF6FF (Powder Blue)\nFont: Merriweather\nSections:\nOur Story:\nOrigin story of SweetBite Bakery (est. 2005)\nFull-width image of founders baking\nMeet the Team:\nCards for each team member (photo, role, fun fact)\n“Baked with love by real people” tagline\nRight Sidebar:\nAwards & features (“Best Bakery in Bend – 2023”)\nGoogle Reviews badge\nYouTube Embed:\nVideo tour of the bakery kitchen (~1min)\n4. Blog Page\nBackground Color: #F8E8FF (Lavender Frost)\nFont: Lora\nSections:\nTop Bar:\nSearch bar: “Search baking tips...”\nFilters: Recipes, Kitchen Tips, Behind the Scenes, Seasonal\nBlog Grid (2-column on desktop):\nCard layout:\nThumbnail, title, 2-line preview, tags\n“Read More” button → opens full blog page or modal\nSidebar Widgets:\nPopular posts\nCategory list\nNewsletter form (name & email with validations)\nButton: “Subscribe Now”\nBreadcrumbs: Home > Blog\n5. Contact Page\nBackground Color: #FFEDED (Rose Quartz)\nFont: Nunito\nSections:\nContact Form:\nInputs: Name, Email, Subject (dropdown), Message\nValidation:\nEmail must be valid format\nName required\nMessage must be 20+ characters\nConfirmation: “Thank you! We’ll get back within 1 business day.”\nFAQ Accordion:\n“Do you make gluten-free cakes?”\n“Do you accept large orders?”\nGoogle Map Embed:\nPin location at bakery’s address\n“Get Directions” button (links to Google Maps)\nLeft Sidebar:\nOpen hours\nClick-to-call phone number\nLink to Facebook & Yelp reviews | prefer realistic stock photos of baked goods. Remaining your call. |

  @DaemonsPromptReservationTask @Daemons
  Scenario Outline: Verify reservation task execution
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the deep agent browser created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                          | follow_up_query                                                                          |
      | send me dinner reservations to a fancy restaurant in new york every thursday at 6 pm and send it over email | city - new York, time 6 pm, table for 2, udaysingh@abacus.ai , fine dining, starting now |

  @DaemonsPromptInfluencer @Daemons
  Scenario Outline: Verify influencer task execution
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should download the generated summary
    Then I click on the test task
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                                                                                                                      | follow_up_query                                             |
      | I am an influencer who posts about entertainment, pop culture, fashion etc. Help me with grabbing the trending topics on social media. Everyday at night provide me a list of 5 ideas that can go viral | 1. 10pm 2. instagram, tiktok and youtube 3. save it to file |

  @DaemonsPromptSMD @Daemons
  Scenario Outline: Verify social media trending topics task
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the Twitter MCP has been created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                  | follow_up_query                          |
      | Write a  witty and well thought through pun around AI and tech and post it one tweet every 3 hours. | run it for next 24 hours rest you decide |
