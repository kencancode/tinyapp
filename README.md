# TinyApp Project

Introduced on the second week in the web development bootcamp, this 4-day project was my first full-stack web application with the emphasis on the server side. 
 
TinyApp allows users to shorten long URLs much like TinyURL.com or bit.ly.

I had the opportunity to:
- Build the server handling multiple HTTP requests using Express.js, a web framework frequently-used in the community;
- Render multi-page websites using EJS as the view engine;
- Explore the power of cookies for session storage;
- Discover the concept of User Authentication by using bcrypt in this project.


# Features
- Users can create a new account or login
- When logged in, users will see "Hi <first_name>" while navigating through different pages, thanks to cookies
- After logging in, users can paste a long URL, which will be stored together with a short URL uniquely and automatically created in the backend
- The URLs are privately visible only to users who create them, when they are loggedin 
- Users can edit their URLS later
