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
      | prompt_user_search                                                                                                                                                                                     | follow_up_query                                                                                                     |
      | Fetch my emails from Gmail and summarise the activity in the past day. Give an overview                                                                                                                | your call                                                                                                           |
      | Make me a dashboard of summary of all the open Jira issues reported by me in the last 3 sprints. \n Highlight blockers and suggest which ones I should prioritize this week based on effort vs impact. | https://abacusai.atlassian.net/ — summarize all project high-priority tasks; dark grey theme with chat graph & icon |
      # | Connect To Gmail And Automate Work                                                      | Find sent emails with no replies                                                                                    |
      # | Create a daily report of unresolved tickets from Slack messages                                                                        | Daily reporting                                                                                                     |
      # | Summarize key updates from the last 4 hours in #prod-releases on abacusai.slack.com, and email the PDF summary to udaysingh@abacus.ai. | Your Call                                                                                                           |

  @AppLLMDataAnalysis
  Scenario Outline: Verify AppLLM Data Analysis
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k

    Examples:
      | prompt_user_search                                                                                                                                                             | follow_up_query |
      | find all the issues from my Jira reported in the last week, and create a dashboard. Categorize them as bug, feature etc and then create a small html website with the details. | you decide      |

  @DeepResearchPrompts
  Scenario Outline: Verify Deep Agent's research prompts
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should download the generated summary
    And I should fetch the search results

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                          | follow_up_query                                                                                                                                                          |
      | Search for latest information about Elon Musk and generate a PDF summary.                                                                                                                                                                                                   | Elon Musk's life or career in the PDf                                                                                                                                    |
      | How does media coverage influence public opinion during election campaigns?                                                                                                                                                                                                 | Your call with limited functionality.                                                                                                                                    |
      | write detailed PDF report on India Pakistan conflicts after 2000                                                                                                                                                                                                            | Your call with limited functionality.                                                                                                                                    |
      | Find reservations at an upscale indian dinner restaurant in San Francisco.                                                                                                                                                                                                  | Book a table for 5 this Sunday at 1:00 PM for lunch at any Italian restaurant near Connaught Place, Delhi — no special preferences. Create a pdf of the restaurant list. |
      | Do a in-depth research around EV battery manufacturers globally, and provide a competitive study around them.\nCite source of information for all the information you use.\nThe report should have one section to rate the manufacturers across various relevant parameters | include  major and medium scale ones \n lithium ion                                                                                                                      |
      | Create a detailed 3-day itinerary for a trip to Bali, please include the names of tours, restaurant and beaches that I should go to. \n My budget is \\$10000.                                                                                                              | Luxury mid-range budget relaxation for next month                                                                                                                        |

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
      | Build a fully functional game of sudoku. Keep it simple and functional.             | Your call with limited functionality.                                             |

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
      | prompt_user_search                                                                                                                                                                              | follow_up_query                                                                                                                                            |
      | Build an AI app that takes basic user info, lets them select body type & goals via simple illustrations, and generates daily workout plans with exercise visuals, sets, reps, and instructions. | Assist me in building a personalized AI assistant designed to perform web searches and utilize various query tools effectively , and create a chatbot link |

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

  @AppLLMDataSeeding
  Scenario Outline: Verify AppLLM, Data Seeding
    Given I click the check out from the welcome window
    When I search the long prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page images are loaded and not broken
    Then Verify all the page links and buttons are working
    Then Verify the data is correctly seeded into the database

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | follow_up_query                                                                     |
      | Build a two-sided marketplace website with clear differentiation between buyer and seller user experiences.General Features: A homepage or landing page where users can select whether they are a buyer or a seller. Implement user roles (Buyer and Seller) that lead to different UI flows. Use responsive design to ensure compatibility across mobile and desktop. Buyer Experience: After selecting the Buyer role, users should be redirected to the Buyer Dashboard.Features: A product discovery interface (cards/grid layout) where users can browse available listings. Filtering and search capabilities (e.g., category, price range, popularity). View detailed product pages with descriptions, images, and seller info. Ability to save/bookmark favorite products Seller Experience: After selecting the Seller role, users should be redirected to the Seller Dashboard.Features: Interface to create and manage listings. Each listing should include: Product name Description Price Upload images Inventory count Ability to edit or remove existing listings. View stats about their listings Add auth and login for users Buyers should be able to message to sellers and sellers should be able to respond on the app for a given listing | 1/ all of these 2/ no payment processing 3/ quicklist 4/ global 5/ inbuild database |

  @AppLLMAuthRBAC
  Scenario Outline: Verify AppLLM, Auth, RBAC
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page links and buttons are working
    Then I complete the sign-up process and submit a leave application

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | follow_up_query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
      | You are building a minimal HR web app (a mini version of Workday) focused on just two core features: (1) Employee Directory and (2) Leave Request System. Build a basic full-stack web app with: Employee Directory Allow add, view, edit, and delete operations for employees. Fields: name, title, department, email. Display results in a searchable and sortable table. Leave Request System Employees can submit time-off requests with date and reason. Admins can approve or reject requests. Display leave status: pending, approved, or rejected. Role-Based Access Control Define two roles: Admin and Employee. Only Admins can make changes to employee directory and approve/reject leave. Employess can not edit the employee directory and also can not approve or reject leaves. Employees can only view the directory and submit leave requests. | 1/ There will be one admin login. Create one admin login credentials. , Other users can sign up on their own and they will always be employees. On sign up page with fix field (full name, email, password, confirm password). 2/ no initial data 3/ you decide 4/ currently only one admin account, dont need to promote users to admin status 5/ Provide the admin role login credentials when you are done building. on request leave page fix fields (start date, end date, leave type and reason) no dropdown all are input fields. all fields have placeholder same as field name |

  @AppllmDR
  Scenario Outline: Verify AppLLM, DR
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page links and buttons are working
    Then verify that the website contains some useful words

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | follow_up_query |
      | Create a fanclub website about taylor swift, make sure to add a page for each album, write a short summary of album and a back story and then list down all the songs in that album. List the albums in reverse chronological order The website should also have a gallary for her pictures - add 10 pictures which are good. There should be a page that list downs latest news and clicking on the news should take the user to the news artical Add one page to list down all the major concerts she did so far. | you decide      |

  @AppLLMImagesDB
  Scenario Outline: Verify AppLLM, Imges, DB
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page images are loaded and not broken
    Then Verify the data base created for website

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | follow_up_query                     |
      | Build a fun “Hot or Not: Hollywood Edition” game. \nThe game should show random celebrity photos (Hollywood actors, musicians, influencers) one at a time to the user. \n The number of celebrities should be 20. \nFor each celebrity, the user can swipe left/right or tap a Hot or Not button to rate them. After a rating, the next celebrity appears automatically. \nTrack stats: show the percentage of people who voted “Hot” for each celebrity after the user votes.\n Include a leaderboard or trending list showing the top-rated celebrities overall. \nKeep the UI stylish, modern, and fast — optimized for mobile devices.\n Make the UI really look nice, enticing people to play the game. | Create a database to use real data. |

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
    And the compute points should not exceed 150k
    And I should see the generated video
    And I should verify that the video duration is more than 12 seconds

    Examples:
      | prompt_user_search                                                                                                                                                                                    | follow_up_query |
      | create a video on the top 5 most expensive cars with the audio where a man talks about the given car. the video should be 15 seconds long. Add a relevant background music and subtitles to the video | your call       |

  @AIChatCustomBot
  Scenario Outline: Verify custom AI chatbot generation
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
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

  @LLMAPIS1
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

  @LLMAPIS2
  Scenario Outline: Verify resume analysis functionality
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" to generate a website
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then I complete the sign-up process create new role and upload the resume

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                   | follow_up_query                                                                                                                                                                                                  |
      | You are building a minimal recruitment web app. Create an AI recruitment assistant for a company that is powered by LLM. User should have sign up and login flow. User can create a new role, add a job description. For each role - User can upload a resume in pdf format and the LLM should give a score to the resume depending on if the uploaded resume is a good candidate for the given role. For every application - the LLM should write 2 pros and 2 cons | Include sign-up with fixed fields (full name, email, password, confirm password). Users can create roles (name, experience, skills, location). All the text field must have placeholder name same as field name. |

  @AppLLMlongPrompt
  Scenario Outline: Verify website creation for long prompt
    Given I click the check out from the welcome window
    When I search the long prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then Verify all the page images are loaded and not broken
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | follow_up_query                                                    |
      | SweetBite Bakery (USA) – 5-Page Product Showcase Website (No Cart / No Ordering)\nCreate a 5-page responsive product showcase website for a small-town US-based bakery named "SweetBite Bakery", located in Bend, Oregon.\nThe purpose of this site is to present baked goods visually, highlight the team, publish blog tips, and encourage in-store visits — no online ordering, checkout, or cart features.\nGlobal Site Requirements\nApply the following to every page:\nUnique background color for each page\nDifferent Google font for each page\nHeader:\nLogo ("SweetBite Bakery")\nNavigation links: Home, Menu, About, Blog, Contact\nFooter:\nAddress: 203 NW Baker Ave, Bend, OR 97701\nPhone: (541) 555-8234\nEmail: hello@sweetbitebakery.com\nSocial icons: Instagram, Facebook, Yelp\nSticky sidebar (left or right) on at least 2 pages\nBack-to-top button\nHover interactions on cards and buttons\nResponsive layout for mobile, tablet, and desktop\nSearch bar and filter sections where applicable\nForms must have:\nPlaceholder text\nField validations\nConfirmation or error messages\nSEO-friendly structure:\nProper heading levels (h1, h2…)\nSemantic tags\nAlt text for all images\nPage Details\n1. Home Page\nBackground Color: #FFF8F1 (Vanilla Cream)\nFont: Poppins\nSections:\nHero Banner:\nBackground photo: bakery storefront in Oregon\nText overlay: “Small Batch, Big Smiles.”\nButton: “Explore Our Menu” → links to Menu page\nWelcome Note: A paragraph from the founder about baking since 2005\nShowcase Grid:\n3 featured items: Sourdough Brioche, Red Velvet Slice, Pumpkin Muffins\nEach card: photo, item name, 1-line description, seasonal tag\nButton: “See Details” → links to Menu page\nTestimonial Slider:\n3 customer quotes, auto-rotate\nRight Sidebar:\nInstagram 3-post preview\nQuick links to: Menu, Blog, Visit Us\nFooter:\nContact info, open hours, subscribe to newsletter\n2. Menu Page\nBackground Color: #FFF9DB (Pale Lemon)\nFont: Inter\nSections:\nSearch & Filter Toolbar:\nSearch bar with placeholder: “Search our treats...”\nFilters: Breads, Cakes, Cookies, Vegan, Gluten-Free\nProduct Grid (3-column):\nEach product:\nHigh-res image\nName: “Oatmeal Chocolate Chip”\nShort description (40–60 chars)\nTag(s): “Dairy-Free”, “Best Seller”\nButton: “View Item” → opens modal with more info\nLeft Sidebar:\nFilters by type\n“Staff Favorites” mini-feature section\nBreadcrumbs: Home > Menu\n3. About Page\nBackground Color: #EAF6FF (Powder Blue)\nFont: Merriweather\nSections:\nOur Story:\nOrigin story of SweetBite Bakery (est. 2005)\nFull-width image of founders baking\nMeet the Team:\nCards for each team member (photo, role, fun fact)\n“Baked with love by real people” tagline\nRight Sidebar:\nAwards & features (“Best Bakery in Bend – 2023”)\nGoogle Reviews badge\nYouTube Embed:\nVideo tour of the bakery kitchen (~1min)\n4. Blog Page\nBackground Color: #F8E8FF (Lavender Frost)\nFont: Lora\nSections:\nTop Bar:\nSearch bar: “Search baking tips...”\nFilters: Recipes, Kitchen Tips, Behind the Scenes, Seasonal\nBlog Grid (2-column on desktop):\nCard layout:\nThumbnail, title, 2-line preview, tags\n“Read More” button → opens full blog page or modal\nSidebar Widgets:\nPopular posts\nCategory list\nNewsletter form (name & email with validations)\nButton: “Subscribe Now”\nBreadcrumbs: Home > Blog\n5. Contact Page\nBackground Color: #FFEDED (Rose Quartz)\nFont: Nunito\nSections:\nContact Form:\nInputs: Name, Email, Subject (dropdown), Message\nValidation:\nEmail must be valid format\nName required\nMessage must be 20+ characters\nConfirmation: “Thank you! We’ll get back within 1 business day.”\nFAQ Accordion:\n“Do you make gluten-free cakes?”\n“Do you accept large orders?”\nGoogle Map Embed:\nPin location at bakery’s address\n“Get Directions” button (links to Google Maps)\nLeft Sidebar:\nOpen hours\nClick-to-call phone number\nLink to Facebook & Yelp reviews | prefer realistic stock photos of baked goods. Remaining your call. |

  @AppLLMlongPrompt
  Scenario Outline: Verify website creation for long prompt
    Given I click the check out from the welcome window
    When I search the long prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the website
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | follow_up_query                                                 |
      | You are a professional fitness trainer AI. Create customized workout programs based on the user’s inputs: age, height, weight, gender, body type (ectomorph, mesomorph, endomorph), fitness goals (fat loss, muscle gain, performance, toning, etc.), activity level (sedentary, light, moderate, very active), and training experience (beginner, intermediate, advanced). Output a full weekly workout plan (3–6 days/week) with progressive overload. Include sets, reps, rest time, and difficulty scaling. Ensure exercises are chosen for optimal muscle symmetry, joint safety, and aesthetic goals. Include illustration links or visual instructions for each exercise (use royalty-free or license-free illustration sources). Avoid generic plans—make them feel like they were written by a top-tier strength & conditioning coach.” :brain: Sample Data Flow & Inputs: Field Example Value Height 5’9” Weight 170 lbs Age 28 Gender Male Body Type Mesomorph Goals Build lean muscle and lose belly fat Activity Level Moderately Active Training Experience Intermediate :man-lifting-weights: Output Format Example: Day 1: Upper Body Strength 1A. Barbell Bench Press – 4 sets x 6 reps (90 sec rest) Illustration: [link or embedded image] 1B. Pull-Ups – 4 sets x max reps 2. Seated Dumbbell Shoulder Press – 3 sets x 10 reps 3. Triceps Rope Pushdown – 3 sets x 12 reps 4. Hanging Leg Raises – 3 sets x 15 reps :jigsaw: Features to Add: Progress tracking and adaptive programming. "Rate workout difficulty" at the end of sessions for AI tuning. Auto-switch exercises if injury or equipment restriction is noted. Goal-specific “training blocks” (hypertrophy, strength, HIIT cycles). Include warm-up and cooldown per day. | 1. web app 2. form based 3. like all these features 4. database |

  @DaemonsBrowserUse
  Scenario Outline: Verify Daemons Browser Use
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the deep agent browser created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                          | follow_up_query                                                                          |
      | send me dinner reservations to a fancy restaurant in new york every thursday at 6 pm and send it over email | city - new York, time 6 pm, table for 2, udaysingh@abacus.ai , fine dining, starting now |

  @DaemonsDR
  Scenario Outline: Verify Daemons DR
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should download the generated summary
    Then I click on the test task
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                                                                                                                      | follow_up_query                                             |
      | I am an influencer who posts about entertainment, pop culture, fashion etc. Help me with grabbing the trending topics on social media. Everyday at night provide me a list of 5 ideas that can go viral | 1. 10pm 2. instagram, tiktok and youtube 3. save it to file |

  @DaemonsMCP
  Scenario Outline: Verify Daemons MCP
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    Then I click on the test task
    And I verify that the Twitter MCP has been created
    And the compute points should not exceed 150k
    Then I confirm that the task has been successfully created

    Examples:
      | prompt_user_search                                                                                  | follow_up_query                          |
      | Write a  witty and well thought through pun around AI and tech and post it one tweet every 3 hours. | run it for next 24 hours rest you decide |

  @BrowserUse
  Scenario Outline: Verify browser task execution
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    Then I should see the search results for the default sample task

    Examples:
      | prompt_user_search                                                                | follow_up_query              |
      | Find me a cheapest flight ticket from Bangalore to San Francisco in december 2025 | 1 ticket, dates are flexible |

  @Chatbot1
  Scenario Outline: Verify chatbot creation with personalized AI
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then I verify the website has a chatbot "<prompt_for_chatbot>"
    Then I click on chatbot link and search for the prompt "<prompt_for_chatbot>"

    Examples:
      | prompt_user_search                                                                                                     | follow_up_query | prompt_for_chatbot                                    |
      | create a chatbot that is a NYC restaurant guide (manhattan, hot affordable spots) and make a website with this chatbot | you decide      | Are there any vegetarian-friendly spots in Manhattan? |

  @Chatbot2
  Scenario Outline: Verify chatbot creation with personalized AI
    Given I click the check out from the welcome window
    When I search the chat bot prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then I verify the website has a chatbot "<prompt_for_chatbot>"
    Then I click on chatbot link and search for the prompt "<prompt_for_chatbot>"

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                           | follow_up_query | prompt_for_chatbot                                            |
      | Create a chatbot which is very knowledgeable on classic cars from the 90s. Then create a website where users can post listings to buy and sell their 90s classic cars. You should embed the chatbot we created into the website so users can ask questions and get information about the cars from this era. | you decide      | Which is better for performance, a 1990s Corvette or Mustang? |

  @AIWorkFlow1
  Scenario Outline: Verify chatbot creation with personalized AI
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" for AI workflow
    And the compute points should not exceed 150k
    And I click on the Use AI Workflow and upload the CSV file
    And I serach the prompt "<another_prompt>"

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | another_prompt                                                                                                                                                                                                                                                                                             |
      | Create an AI Workflow | Build an AI agent that accepts a CSV file as input. Each row has Name, Email, and Company Name. For every row:\n\n1. Research the given company online to understand what it does and its industry challenges.\n2. Read about our product \\"DeepAgent\\" from the following pages: https://abacus.ai/help/howTo/chatllm/deepagent_how_to\n3. Draft a nicely formatted personalized email to the person (use their name and company context) explaining how DeepAgent can help their business. Use a professional, helpful tone.\n4. Send the email through my Gmail account\n\nAfter sending, generate an updated CSV with the Name, Email, Company, Generated Email Text, and Status (Sent/Failed).\n\nThe agent should:\n\nRetry failed sends up to 2 times\n\nOutput a downloadable CSV file | Read the latest email received in my gmail account from no-reply@abacus.ai in the last 5 minutes. Please check if it is tailored to the Walmart company and a promotional email about DeepAgent. Give output in this format only. No other TEXT strictly. YES Time of the received email - <Date and Time> |

  @AIWorkFlow2
  Scenario Outline: Verify chatbot creation with personalized AI
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>" for AI workflow
    And the compute points should not exceed 150k
    And I click on the Use AI Workflow start the ai work flow and validate the csv file

    Examples:
      | prompt_user_search    | follow_up_query                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | another_prompt                                                                                                                                                                                                                                                                                             |
      | Create an AI Workflow | Objective\nBuild an AI Agent that scrapes Google Search results daily using predefined queries related to Product Manager jobs in the US. The agent should extract job title, company, location, and link from the visible Google Search result cards and email a daily CSV of 15–25 listings to <provide your email address> at 9:00 AM ET\nWorkflow\nStep 1: Define Daily Search Queries\nUse Google to search each of the following job queries:\nProduct Manager jobs site:google.com\nAssociate Product Manager jobs United States\nSenior Product Manager remote jobs US\nGroup Product Manager openings USA\nProduct jobs in startups USA\nProduct Manager jobs AI SaaS site:google.com\nEach search simulates a user looking for jobs. The agent should:\nPerform the searches\nParse the job listings visible in the Google Jobs rich result block\nIf no rich block, parse standard Google result snippets\nStep 2: Scrape Job Listings from Results\nFor each result:\nExtract:\nJob Title (from headline or snippet)\nCompany Name (if mentioned)\nLocation (Remote / US City / State)\nGoogle Search Result Link (final outbound link)\nSource Site (LinkedIn, Indeed, etc. if visible in snippet)\nDe-duplicate any repeated jobs\nStep 3: Format Output\nCreate a csv file: google_pm_jobs_<YYYY-MM-DD>.csv with the following columns:\nJob Title, Company Name, Location, Source Site, Job Link\nStep 4: Provide the output file in downloadable format and also Email the File\nTo: <provide your email address>\nSubject: 📌 Daily Google-Sourced PM Jobs - <Date>\nAttachment: google_pm_jobs_<date>.csv | Read the latest email received in my gmail account from no-reply@abacus.ai in the last 5 minutes. Please check if it is tailored to the Walmart company and a promotional email about DeepAgent. Give output in this format only. No other TEXT strictly. YES Time of the received email - <Date and Time> |
