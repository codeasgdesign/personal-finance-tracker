# Personal Finance Tracker

Welcome to the Personal Finance Tracker project! This application allows users to track their financial transactions, manage categories, and generate financial summaries.

## Overview

Managing personal finances can be challenging, but with the Personal Finance Tracker, users can easily keep track of their income and expenses. The application provides a user-friendly interface for adding transactions, organizing them into categories, and generating summaries to gain insights into spending habits.

## Features

- **User Authentication**: Users can register and log in to their accounts to access the application.
- **Transaction Management**: Add, update, and delete financial transactions with ease.
- **Category Management**: Organize transactions by assigning them to different categories.
- **Financial Summaries**: Generate summaries to visualize income, expenses, and category insights over time.

## Setup Instructions

1. Clone the repository to your local machine.
2. Install Node.js and npm if not already installed.
3. Navigate to the project directory in your terminal.
4. Run `npm install` to install dependencies.
5. Set up a MongoDB database and provide the connection URI in the `.env` file.
6. Run `npm run dev` to start the server.

## Endpoints

- **Authentication**:
  - `POST /api/users/register`: Register a new user.
  - `POST /api/users/login`: Log in an existing user.

- **Transactions**:
  - `POST /api/transactions`: Create a new transaction.
  - `GET /api/transactions`: Retrieve all transactions.
  - `PUT /api/transactions/:id`: Update a transaction.
  - `DELETE /api/transactions/:id`: Delete a transaction.

- **Categories**:
  - `POST /api/categories`: Create a new category.
  - `GET /api/categories`: Retrieve all categories.
  - `PUT /api/categories/:id`: Update a category.
  - `DELETE /api/categories/:id`: Delete a category.

- **Financial Summaries**:
  - `POST /api/summary`: Generate financial summary.
  - `GET /api/monthly-expense-trends`: Get monthly expense trends.

## Request/Response Examples

Please refer to the [API Documentation](https://documenter.getpostman.com/view/7257728/2sA2xb7GDn) for detailed request/response examples and usage instructions.

## Error Codes

- **400 Bad Request**: The request was invalid or missing required parameters.
- **401 Unauthorized**: The request lacks valid authentication credentials.
- **404 Not Found**: The requested resource was not found.
- **500 Internal Server Error**: An unexpected error occurred on the server.

## Technologies Used

- Node.js
- MongoDB
- Fastify
- Mongoose
- JWT for authentication
- JEST for testing

## DB design
![Personal Finance Tracker](/images/DB%20.png)


## Contributors

- [Ashish Guleria](https://github.com/codeashish) - Lead Developer

