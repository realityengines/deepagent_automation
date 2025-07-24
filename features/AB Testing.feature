@ABTesting
Feature: Deep Agent Functionality Test
    As a logged-in user
    I want to access and view my dashboard and the Deep Agent search and overview
    So that I can explore available search prompts and understand the Deep Agent's capabilities

  Background:
    Given the user enters username "testuser1744775890841@internalreai.com" and password "Testuser@123"
    Then I should be logged in successfully
    And I select the default LLM "RouteLLM"
    When I click the deep Agent option

  @VerifyAllTheURL
  Scenario Outline: Verify all internal page URLs return HTTP 200 after website deployment
    Given I click the check out from the welcome window
    When I search the prompt "<prompt_user_search>" with follow-up query "<follow_up_query>"
    And I should see the status "Completed" for the task
    And the compute points should not exceed 150k
    And I should deploy the created website
    Then Verify all the page links are are 200

    Examples:
      | prompt_user_search                                                                                                                                                                                                                                                                                                                                                                                                                                                              | follow_up_query |
      | Create a multi-page travel gallery website with high-resolution images. Pages: Home, Explore Destinations (grid of images from DB), Destination Details (with image carousel), Login/Register, My Saved Trips, About. Use a visually rich layout: image cards, filters by region, and tags like “Beach,” “Mountains,” etc. Include lazy-loading for images and animations on scroll. Store image metadata in DB (caption, location, tags).                                      | Your Call       |
      | Build a personal health tracker website with a live dashboard. Pages: Login/Register, Dashboard, Add Activity, Track Nutrition, My Progress, Settings. The dashboard should fetch health stats (steps, calories, sleep) from the DB and display charts (bar, line) using a JS charting library. Include filters by week/month and toggles for dark/light mode. Allow uploading health logs via a form.                                                                          | Your Call       |
      | Design a clean, CTA-heavy website showcasing useful productivity tools. Pages: Home, Browse Tools (from DB), Tool Detail Page, Add Tool (form), Login/Register, Dashboard, My Bookmarks. Each tool card should have CTAs like: “Use Now,” “Save,” “Visit,” “Share.” Include sorting (popularity, rating) and tags like “AI,” “Time Management.” Allow users to submit tools and manage them in their dashboard.                                                                 | Your Call       |
      | Build a photography portfolio website with image galleries as the centerpiece. Pages: Home (hero image + featured galleries), Portfolio (DB-powered gallery by category), Login/Register, Upload Photo, My Gallery, Contact. Use full-width banners, grid-based galleries, and hover effects. Allow users to upload images and manage them via a dashboard. Support image tags, lightbox view, and smooth transitions.                                                          | Your Call       |
      | Create a curated collection site of the best startup landing pages. Pages: Home, All Landing Pages (card layout), Page Detail (with embedded view), Submit Page, Login/Register, Saved Pages. Each card should include CTAs like “Try Demo,” “View Source,” “Add to Favorites.” Use filters (industry, color palette, layout) and a trending tab. Pages are stored and fetched from a DB.                                                                                       | Your Call       |
      | Create an admin dashboard for managing online courses. Pages: Login, Dashboard (with charts from DB), Manage Courses, Manage Students, Add Course, View Feedback, Profile. The dashboard should show live stats (enrollments, completion rate, student count). Use tabs, tables, modals, charts, and CTA buttons like “Edit,” “Delete,” “Notify.” Support search, pagination, and data export as CSV.                                                                           | Your Call       |
      | Create a 6-page responsive website where users can browse, filter, and search local events (by category like music, food, art, etc.). Home page should show featured events with images. Add “Join Now” and “Share” CTA buttons on each event card. Include Login/Register pages, an Event Detail page (pulled from DB), and a User Dashboard where users can see their joined events and edit their profile. Store event data and user participation in the database.          | Your Call       |
      | Build a 5-page restaurant website with a homepage that includes a hero image slider, special dish cards with high-quality images, and a “Book Table” CTA button. Other pages include Menu (pulled from DB), Booking Form (with date/time slots), Login/Register, and Admin Dashboard to update menu items and view bookings. Add a footer with location, contact, and social icons. Use DB to store menu, bookings, and user info.                                              | Your Call       |
      | Design a 4-page portfolio site for a freelance designer. Homepage should display a carousel of completed work (image-heavy), Services page with CTA buttons like “Get a Quote”, About page with contact form, and a Quotes Dashboard (for logged-in users only) that lists their submitted quote requests from DB. Admin (designer) can mark quote status (e.g., New, In Discussion, Finalized). Add auth and store all quote requests in the DB.                               | Your Call       |
      | Create a 7-page directory site that lists recommended tools across categories like Productivity, Design, and Marketing. Include a filterable/searchable Tools List page with “Try Now” CTAs linking to external sites. Add user authentication, a Profile page with saved tools, and an Admin page to add/edit tool entries (title, URL, category, image, and status). Homepage should highlight trending tools with cover images. Data should be stored and fetched from a DB. | Your Call       |
