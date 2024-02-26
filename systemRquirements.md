# Oscar Winners' Pool 2024 - System Requirements

## Introduction

The Oscar Winners' Pool 2024 is a web application designed to facilitate a prediction game for the Academy Awards winners. This document outlines the system requirements for the successful operation of the website.

## System Overview

The system consists of the following components:

- Frontend: The user interface accessible via web browsers.
- Backend: The server-side logic and database management.
- Database: Storage for user data, predictions, and other relevant information.

## System Requirements

### 1. Frontend Requirements

- **Web Browsers:** The website should be compatible with modern web browsers such as Chrome, Firefox, Safari, and Edge.
- **Responsive Design:** The frontend should be responsive and accessible on various devices, including desktops, tablets, and smartphones.

### 2. Backend Requirements

- **Server:** A server capable of running the backend logic and handling user requests.
- **Programming Language:** The backend should be implemented using a suitable programming language (e.g., Node.js, Python, Ruby).
- **Framework:** Use a web framework to streamline development and enhance security (e.g., Express, Django, Ruby on Rails).

### 3. Database Requirements

- **Database System:** Choose a relational database system (e.g., MySQL, PostgreSQL) for storing user data and predictions.
- **Schema:** Define a clear database schema to organize and manage data efficiently.
- **Data Security:** Implement measures to ensure the security of user data, including encryption and secure connections.

### 4. User Authentication

- **User Registration:** Allow users to create accounts with unique usernames and passwords.
  - It will be neccessary an unique invite token to create a new user.
    - Some tokens are used to create admin users.
- **Authentication:** Implement a secure authentication mechanism to verify user identity.
- **Password Security:** Enforce password policies for user accounts.

### 5. Prediction Functionality

- **Selection of Categories:** Allow users to make predictions in the following Oscar categories:
    - Actor in a Leading Role;
    - Actor in a Supporting Role;
    - Actress in a Leading Role;
    - Actress in a Supporting Role;
    - Animated Feature Film;
    - Cinematography;
    - Costume Design;
    - Directing;
    - Film Editing;
    - International Feature Film;
    - Makeup and Hairstyling;
    - Music (Original Score);
    - Music (Original Song);
    - Best Picture;
    - Production Design;
    - Sound;
    - Visual Effects;
    - Writing (Adapted Screenplay);
    - Writing (Original Screenplay).
- **Submission:** Users should be able to submit and update their predictions before a specified deadline.
- **Scoring:** Implement a scoring system to evaluate and rank users based on the value of each category predicted.
  - The value of each category is defined by admin users.

### 6. Results Display

- **Updates:** The winners are registered by admin users.
- **Results Page:** Provide a results page showing winners in each category.
- **Leaderboard:** Show a leaderboard ranking users based on their predictions.

### 7. Pages
- **Login:** Log into the system.
  - `username`
  - `password`
- **Create User:** Create a new user.
  - `username`
  - `password`
  - `confirm password`
  - `invite token`
- **Home:** General informations and nav bar with buttons to the pages listed below.
- **Make Predictions:** Create predictions to all the categories.
  - Users can make preditions more than once;
  - There's no need to make predictions to all categories;
  - A button register the predictions made.
- **Winners:** See the winners of The Oscars.
  - Admin users can register the winners in this page;
  - If no winners were registered, a message will be displayed.
- **Leaderboard:** Lederboard with users names and points.
  - If no winners were registered, a message will be displayed.
- **User:** Users can see, change or delete their account.
  - There will be also a button to logout.

## Conclusion

This document outlines the basic system requirements for the Oscar Winners' Pool 2024 web application. It serves as a foundation for development and can be expanded as needed throughout the project lifecycle.
