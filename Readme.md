## Project developed by
Rama Mubaied
Software Engineering student

## Overview
The Custom Reporting System for Project Management is a web application designed to meet the unique requirements of project management. It streamlines project management processes and offers an array of features that cater to user registration, project setup, team member dashboards, and more. The system was developed using Node.js and Express.js, ensuring a scalable, secure, and user-friendly solution.

## App Functions
### Team Member Interface
- Team Member login.
- Default pass tiger, but users can change their passwords as many times as they want from the user dashboard after getting an email from the manager and logging in
- User dashboard with various functions:
  - Edit user personal information in the settings such as (City, Gender, Country, Address)
  - Chang Profile Picture
  -Team members can access their profile page to view upcoming report with due dates and times, mark it as completed when it is done.
  - Sending a response for manager's feedback.
  -Check the Check-list on the assigned tasks.


### Admin Interface
- Admin login.
- Admin dashboard with capabilities to:
  - Add users via CSV file or by clicking on Add a new member.
  - Select the role of the added users (team member/admin) role(1/2).
  - Set up projects and reporting frequencies, customize report 
  - Obtain a notifications of completed tasks
  - Project managers can allocate team members to specific projects.
  - Project Overview and Tracking
  - Sending a Feedback
  - Edit user personal information in the settings such as (City, Gender, Country, Address)
  - Chang Profile Picture

## Security
- Passwords for both admin and users are hashed for enhanced security.
- Authorization mechanisms are implemented for both users and admins.

## Technologies Used
- Node.js for server-side functionality.
- Bootstrap for front-end design.


## Installtions and setup

1. Install Node js https://nodejs.org/en/download/.

2. **Node Module Setup**:
   - Navigate to the project folder in the terminal (e.g., `/PMS`).
   - Install necessary Node modules by running:
     - `npm install`.

3. **Database Setup**:
   - In the project folder, navigate to `/sql/projectm.sql`.
   - Log in to the database with `mysql -uroot -p` (or `sudo mysql -uroot -p` for Linux) using the root password.
   - Create the database and a new user by running `source setup.sql`.
   - Create tables in the database with `projectm.sql`.

4. **Running the App**:
   - In the project folder, run the following command: `node index.js`.
   - Access the app at [http://localhost:3000]
   
To access the Admin dashboard, use the following credentials:
- Username: admin@admin.com
- Password: admin

## About
This project was developed as part of a Software Engineering course at BTH University in 2023, aimed at fulfilling customer requirements.
