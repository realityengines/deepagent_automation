# @regression
# Feature: Deep Agent Search and Task Execution

#   Background:
#     Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
#     Then I should be logged in successfully
#     And I select the default LLM "RouteLLM"
#     When I click the deep Agent option

#   @AppllmDR
#   Scenario Outline: Verify AppLLM, DR
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the created website
#     Then Verify all the page links and buttons are working

#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | follow_up_query |
#       | Create a fanclub website about taylor swift, make sure to add a page for each album, write a short summary of album and a back story and then list down all the songs in that album. List the albums in reverse chronological order The website should also have a gallary for her pictures - add 10 pictures which are good. There should be a page that list downs latest news and clicking on the news should take the user to the news artical Add one page to list down all the major concerts she did so far. | you decide      |

#   @AppLLMImagesDB
#   Scenario Outline: Verify AppLLM, Images, DB
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the created website
#     Then I should verify that the database has been created

#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | follow_up_query |
#       | Build a fun “Hot or Not: Hollywood Edition” game. The game should show random celebrity photos (Hollywood actors, musicians, influencers) one at a time to the user. The number of celebrities should be 20. For each celebrity, the user can swipe left/right or tap a Hot or Not button to rate them. After a rating, the next celebrity appears automatically. Track stats: show the percentage of people who voted “Hot” for each celebrity after the user votes. Include a leaderboard or trending list showing the top-rated celebrities overall. Keep the UI stylish, modern, and fast — optimized for mobile devices. Make the UI really look nice, enticing people to play the game. | you decide      |

#   @AppLLMauthcontactusform
#   Scenario Outline: Verify AppLLM, auth contact us form
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the created website
#     Then Verify all the page links are are 200

#     Examples:
#       | prompt_user_search                                                                                                                             | follow_up_query                                                                                             |
#       | create a website for women in product community, make the website content rich, it should have 6 pages, add a login and signup flow for users. | For the Join Us page, add a form with fields: First Name, Last Name, Email, Password, and Confirm Password. |

#   @AppLLMAuthRBAC
#   Scenario Outline: Verify AppLLM, Auth, RBAC
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the created website
#     Then Verify all the page links are are 200

#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | follow_up_query                                                                                                                                                                                                                                                                                                                         |
#       | You are building a minimal HR web app (a mini version of Workday) focused on just two core features: (1) Employee Directory and (2) Leave Request System. Build a basic full-stack web app with: Employee Directory Allow add, view, edit, and delete operations for employees. Fields: name, title, department, email. Display results in a searchable and sortable table. Leave Request System Employees can submit time-off requests with date and reason. Admins can approve or reject requests. Display leave status: pending, approved, or rejected. Role-Based Access Control Define two roles: Admin and Employee. Only Admins can make changes to employee directory and approve/reject leave. Employess can not edit the employee directory and also can not approve or reject leaves. Employees can only view the directory and submit leave requests. | 1/ There will be one admin login. Create one admin login credentials. , Other users can sign up on their own and they will always be employees. 2/ no initial data 3/ you decide 4/ currently only one admin account, dont need to promote users to admin status 5/ Provide the admin role login credentials when you are done building |

#   @AppLLMDataSeeding
#   Scenario Outline: Verify AppLLM, Data Seeding
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the created website
#     Then Verify all the page links and buttons are working

#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | follow_up_query                                                                     |
#       | Build a two-sided marketplace website with clear differentiation between buyer and seller user experiences. General Features: A homepage or landing page where users can select whether they are a buyer or a seller. Implement user roles (Buyer and Seller) that lead to different UI flows. Use responsive design to ensure compatibility across mobile and desktop. Buyer Experience: After selecting the "Buyer" role, users should be redirected to the Buyer Dashboard. Features: A product discovery interface (cards/grid layout) where users can browse available listings. Filtering and search capabilities (e.g., category, price range, popularity). View detailed product pages with descriptions, images, and seller info. Ability to save/bookmark favorite products. Seller Experience: After selecting the "Seller" role, users should be redirected to the Seller Dashboard. Features: Interface to create and manage listings. Each listing should include: Product name Description Price Upload images Inventory count Ability to edit or remove existing listings. View stats about their listings Add auth and login for users Buyers should be able to message to sellers and sellers should be able to respond on the app for a given listing | 1/ all of these 2/ no payment processing 3/ quicklist 4/ global 5/ inbuild database |

#   @AppLLMDataAnalysis
#   Scenario Outline: Verify AppLLM Data Analysis
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
  
#     Examples:
#       | prompt_user_search                                                                                                                                                             | follow_up_query |
#       | find all the issues from my Jira reported in the last week, and create a dashboard. Categorize them as bug, feature etc and then create a small html website with the details. | you decide      |

#   @AppLLMlongPrompt
#   Scenario Outline: Verify Appllm long prompt
#     Given I click the check out from the welcome window
#     When I search the long prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should deploy the website
   
#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | follow_up_query                                                    |
#       | SweetBite Bakery (USA) – 5-Page Product Showcase Website (No Cart / No Ordering)\nCreate a 5-page responsive product showcase website for a small-town US-based bakery named "SweetBite Bakery", located in Bend, Oregon.\nThe purpose of this site is to present baked goods visually, highlight the team, publish blog tips, and encourage in-store visits — no online ordering, checkout, or cart features.\nGlobal Site Requirements\nApply the following to every page:\nUnique background color for each page\nDifferent Google font for each page\nHeader:\nLogo ("SweetBite Bakery")\nNavigation links: Home, Menu, About, Blog, Contact\nFooter:\nAddress: 203 NW Baker Ave, Bend, OR 97701\nPhone: (541) 555-8234\nEmail: hello@sweetbitebakery.com\nSocial icons: Instagram, Facebook, Yelp\nSticky sidebar (left or right) on at least 2 pages\nBack-to-top button\nHover interactions on cards and buttons\nResponsive layout for mobile, tablet, and desktop\nSearch bar and filter sections where applicable\nForms must have:\nPlaceholder text\nField validations\nConfirmation or error messages\nSEO-friendly structure:\nProper heading levels (h1, h2…)\nSemantic tags\nAlt text for all images\nPage Details\n1. Home Page\nBackground Color: #FFF8F1 (Vanilla Cream)\nFont: Poppins\nSections:\nHero Banner:\nBackground photo: bakery storefront in Oregon\nText overlay: “Small Batch, Big Smiles.”\nButton: “Explore Our Menu” → links to Menu page\nWelcome Note: A paragraph from the founder about baking since 2005\nShowcase Grid:\n3 featured items: Sourdough Brioche, Red Velvet Slice, Pumpkin Muffins\nEach card: photo, item name, 1-line description, seasonal tag\nButton: “See Details” → links to Menu page\nTestimonial Slider:\n3 customer quotes, auto-rotate\nRight Sidebar:\nInstagram 3-post preview\nQuick links to: Menu, Blog, Visit Us\nFooter:\nContact info, open hours, subscribe to newsletter\n2. Menu Page\nBackground Color: #FFF9DB (Pale Lemon)\nFont: Inter\nSections:\nSearch & Filter Toolbar:\nSearch bar with placeholder: “Search our treats...”\nFilters: Breads, Cakes, Cookies, Vegan, Gluten-Free\nProduct Grid (3-column):\nEach product:\nHigh-res image\nName: “Oatmeal Chocolate Chip”\nShort description (40–60 chars)\nTag(s): “Dairy-Free”, “Best Seller”\nButton: “View Item” → opens modal with more info\nLeft Sidebar:\nFilters by type\n“Staff Favorites” mini-feature section\nBreadcrumbs: Home > Menu\n3. About Page\nBackground Color: #EAF6FF (Powder Blue)\nFont: Merriweather\nSections:\nOur Story:\nOrigin story of SweetBite Bakery (est. 2005)\nFull-width image of founders baking\nMeet the Team:\nCards for each team member (photo, role, fun fact)\n“Baked with love by real people” tagline\nRight Sidebar:\nAwards & features (“Best Bakery in Bend – 2023”)\nGoogle Reviews badge\nYouTube Embed:\nVideo tour of the bakery kitchen (~1min)\n4. Blog Page\nBackground Color: #F8E8FF (Lavender Frost)\nFont: Lora\nSections:\nTop Bar:\nSearch bar: “Search baking tips...”\nFilters: Recipes, Kitchen Tips, Behind the Scenes, Seasonal\nBlog Grid (2-column on desktop):\nCard layout:\nThumbnail, title, 2-line preview, tags\n“Read More” button → opens full blog page or modal\nSidebar Widgets:\nPopular posts\nCategory list\nNewsletter form (name & email with validations)\nButton: “Subscribe Now”\nBreadcrumbs: Home > Blog\n5. Contact Page\nBackground Color: #FFEDED (Rose Quartz)\nFont: Nunito\nSections:\nContact Form:\nInputs: Name, Email, Subject (dropdown), Message\nValidation:\nEmail must be valid format\nName required\nMessage must be 20+ characters\nConfirmation: “Thank you! We’ll get back within 1 business day.”\nFAQ Accordion:\n“Do you make gluten-free cakes?”\n“Do you accept large orders?”\nGoogle Map Embed:\nPin location at bakery’s address\n“Get Directions” button (links to Google Maps)\nLeft Sidebar:\nOpen hours\nClick-to-call phone number\nLink to Facebook & Yelp reviews | prefer realistic stock photos of baked goods. Remaining your call. |

#   @DeepResearch
#   Scenario Outline: Verify Deep Research
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should download the generated summary
#     Then I should see the search results for the default sample task

#     Examples:
#       | prompt_user_search                                                                                                                                             | follow_up_query                                   |
#       | Create a detailed 3-day itinerary for a trip to Bali, please include the names of tours, restaurant and beaches that I should go to. \n My budget is \\$10000. | Luxury mid-range budget relaxation for next month |

#   @DeepResearchPrompts
#   Scenario Outline: Verify Deep Research prompt
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     And I should download the generated summary
#     And I should fetch the search results

#     Examples:
#       | prompt_user_search                                                                                                                                                                                                                                                          | follow_up_query                                     |
#       | Do a in-depth research around EV battery manufacturers globally, and provide a competitive study around them.\nCite source of information for all the information you use.\nThe report should have one section to rate the manufacturers across various relevant parameters | include  major and medium scale ones \n lithium ion |

#   @DaemonsBrowserUse
#   Scenario Outline: Verify Daemons Browser Use
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     Then I click on the test task
#     And I verify that the deep agent browser created
#     And the compute points should not exceed 150k
#     Then I confirm that the task has been successfully created

#     Examples:
#       | prompt_user_search                                                                                          | follow_up_query                                                                          |
#       | send me dinner reservations to a fancy restaurant in new york every thursday at 6 pm and send it over email | city - new York, time 6 pm, table for 2, udaysingh@abacus.ai , fine dining, starting now |

#   @DaemonsDR
#   Scenario Outline: Verify Daemons DR
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should download the generated summary
#     Then I click on the test task
#     And the compute points should not exceed 150k
#     Then I confirm that the task has been successfully created

#     Examples:
#       | prompt_user_search                                                                                                                                                                                      | follow_up_query                                             |
#       | I am an influencer who posts about entertainment, pop culture, fashion etc. Help me with grabbing the trending topics on social media. Everyday at night provide me a list of 5 ideas that can go viral | 1. 10pm 2. instagram, tiktok and youtube 3. save it to file |

#   @DaemonsMCP
#   Scenario Outline: Verify Daemons MCP
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     Then I click on the test task
#     And I verify that the Twitter MCP has been created
#     And the compute points should not exceed 150k
#     Then I confirm that the task has been successfully created

#     Examples:
#       | prompt_user_search                                                                                  | follow_up_query                          |
#       | Write a  witty and well thought through pun around AI and tech and post it one tweet every 3 hours. | run it for next 24 hours rest you decide |

#   @BrowserUse
#   Scenario Outline: Verify browser task execution
#     Given I click the check out from the welcome window
#     When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And I should see the status "Completed" for the task
#     And the compute points should not exceed 150k
#     Then I should see the search results for the default sample task

#     Examples:
#       | prompt_user_search                                                                | follow_up_query              |
#       | Find me a cheapest flight ticket from Bangalore to San Francisco in december 2025 | 1 ticket, dates are flexible |

#   @VideoGeneration
#   Scenario Outline: Verify video generation
#     Given I click the check out from the welcome window
#     When I search for the prompt for video generation "<prompt_user_search>" with follow-up query "<follow_up_query>"
#     And the compute points should not exceed 150k
#     And I should see the generated video

#     Examples:
#       | prompt_user_search                                                                                                                                                                                    | follow_up_query |
#       | create a video on the top 5 most expensive cars with the audio where a man talks about the given car. the video should be 15 seconds long. Add a relevant background music and subtitles to the video | your call       |
