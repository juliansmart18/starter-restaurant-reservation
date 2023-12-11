# Restaurant Reservation App Readme

## Description
This repository contains the source code for a Restaurant Reservation System, designed to help restaurant managers keep track of reservations, assign them to tables, and maintain organization. The app includes features such as creating and listing reservations, seating reservations at specific tables, freeing up occupied tables, changing reservation status, searching for reservations by phone number, and modifying existing reservations.

## Features

### 1. Create and List Reservations (US-01)
- Allows restaurant managers to create new reservations with required fields.
- Displays a dashboard listing all reservations for a specific date.
- Provides navigation buttons to view reservations on other dates.
- Implements validations and error handling for reservation creation.

### 2. Create Reservation on a Future, Working Date (US-02)
- Ensures reservations can only be created on days when the restaurant is open.
- Validates reservation date to prevent past or closed day reservations.
- Implements error messaging for violated constraints during reservation creation.

### 3. Create Reservation within Eligible Timeframe (US-03)
- Validates reservation time to be within business hours and up to 60 minutes before closing.
- Ensures future reservation date and time combinations are valid.
- Implements error messaging for violated constraints during reservation creation.

### 4. Seat Reservation (US-04)
- Allows managers to create tables with required fields like table name and capacity.
- Displays a dashboard with a list of reservations and tables.
- Provides a "Seat" button on each reservation for table assignment.
- Implements validations and error handling for table and reservation seating.

### 5. Finish an Occupied Table (US-05)
- Displays a "Finish" button on each occupied table in the dashboard.
- Prompts a confirmation dialog before freeing up an occupied table.
- Sends a DELETE request to free the table upon confirmation.

### 6. Reservation Status (US-06)
- Introduces reservation status (booked, seated, finished) on the dashboard.
- Displays a "Seat" button only when the reservation status is "booked."
- Allows changing reservation status through the dashboard.

### 7. Search for a Reservation by Phone Number (US-07)
- Adds a search page with a search box for phone numbers.
- Displays matched reservations on the search page, regardless of status.
- Implements search functionality using partial or complete phone numbers.

### 8. Change an Existing Reservation (US-08)
- Adds an "Edit" button to modify existing reservations.
- Allows canceling reservations with a confirmation dialog.
- Validates and updates reservation status on cancellation.
- Provides an "Edit" button linking to the reservation edit page.
- Implements validations and error handling for reservation modification.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- DBeaver or any PostgreSQL client
- npm (Node Package Manager)

### Installation
1. Fork and clone this repository.
2. Set up four new ElephantSQL database instances: development, test, preview, and production.
3. Connect DBeaver to your new database instances.
4. Copy the `.env.sample` files in both `./back-end` and `./front-end` to `.env`.
5. Update the `.env` files with the connection URLs to your ElephantSQL database instance.
6. Run `npm install` to install project dependencies.

### Running the App
- Run `npm run start:dev` to start the server in development mode.

### Running Tests
- Run specific tests using `npm run test:X`, where X is the user story number.
- Examples:
  - `npm run test:1` runs all tests for user story 1 (both frontend and backend).
  - `npm run test:3:backend` runs only the backend tests for user story 3.
  - `npm run test:3:frontend` runs only the frontend tests for user story 3.
- Run all tests with `npm test`.


---
