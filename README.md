Real-Time Polling System

Project Overview

This project implements a real-time polling system using Kafka, Zookeeper, Node.js, PostgreSQL, and WebSockets. The system allows users to create polls, submit votes, and view real-time updates on poll results and a global leaderboard. The system is designed to handle high concurrency and fault tolerance using Kafka.

Submission Guidelines

README File: This file contains the setup instructions for Kafka, Zookeeper, the backend, and WebSocket configuration, along with clear instructions for running and testing the real-time poll updates and leaderboard feature.

Table of Contents

Installation
Setup Kafka, Zookeeper, and Backend
Docker Setup
API Endpoints
    Vote Submission
    Get Votes
    Create Poll
    Leaderboard
Testing
    Testing with Postman


Installation
To get started, you will need the following installed:

1. Node.js (Version 18.x or later)
2. Docker (For setting up Kafka, Zookeeper, and PostgreSQL)
3. PostgreSQL (For database management)
4. Kafka and Zookeeper (For message queuing and distributed system setup)

Clone the repository and install the dependencies:


git clone https://github.com/yuvrajsingh2428/real-time-polling-system.git
cd real-time-polling-system
npm install

Setup Kafka, Zookeeper, and Backend

1. Kafka and Zookeeper Setup

You can set up Kafka and Zookeeper either manually or with Docker.

For manual setup, please follow the Kafka documentation for detailed instructions.

Alternatively, use the provided docker-compose.yml file to set up Kafka, Zookeeper, and PostgreSQL:

1. Make sure Docker is installed and running.
2. Run the following command to start the services:

docker-compose up

This will start the services for Kafka, Zookeeper, and PostgreSQL, and they will be accessible on the following ports:

Zookeeper: 2181
Kafka: 9092
PostgreSQL: 5432

2. Backend Setup

The backend is built using Node.js and Express. It connects to the Kafka service for real-time updates and PostgreSQL for storing poll data.

The server will run on localhost:4000.
WebSocket connections are used for real-time updates.
The server code is located in the src directory.

To start the backend server, run:

npm start

This will start the server on port 4000.

Docker Setup

The project includes a docker-compose.yml file for setting up all required services in one go.

1. Kafka: Confluent Kafka Docker image.
2. Zookeeper: Confluent Zookeeper Docker image.
3. PostgreSQL: Official PostgreSQL Docker image.
4. Backend: The Node.js backend service.

Run the following command to bring up all services:

docker-compose up --build

This will build and start all the services. Once everything is up, the backend will be accessible on localhost:4000.

API Endpoints

1. Vote Submission

URL: POST http://localhost:4000/api/vote

Request Body:

{
  "pollId": 6,
  "option": "c"
}

Description: Submits a vote for a specific poll option.

2. Get Votes for a Poll

URL: GET http://localhost:4000/api/votes/:pollId

Example: GET http://localhost:4000/api/votes/1

Description: Fetches the votes for a specific poll.

3. Create a Poll

URL: POST http://localhost:4000/api/polls

Request Body:

{
  "question": "Do you like JavaScript?",
  "pollOption": {
    "options": ["Yes", "No"]
  }
}
Description: Creates a new poll with options.

4. Leaderboard
URL: GET http://localhost:4000/api/leaderboard
Description: Fetches the global leaderboard based on poll 
participation.

Testing

You can test the API endpoints using Postman.

Testing with Postman
1. Create Poll:

POST http://localhost:4000/api/polls
Request Body:

{
  "question": "Do you like JavaScript?",
  "pollOption": {
    "options": ["Yes", "No"]
  }
}
This will create a new poll with two options: "Yes" and "No".

2. Submit Vote:

POST http://localhost:4000/api/vote

Request Body:

{
  "pollId": 6,
  "option": "c"
}

This will submit a vote for poll ID 6 with the option c.

Get Votes for a Poll:

GET http://localhost:4000/api/votes/1
Fetches the votes for poll ID 1.

Leaderboard:

GET http://localhost:4000/api/leaderboard
Fetches the global leaderboard.

Additional Considerations

Error Handling: Proper error handling is implemented for scenarios where the specified poll does not exist. If the poll ID is not found or invalid, the API will return a 404 error with a relevant message.

API Response Format: All API responses follow a consistent format. For example, the poll creation API returns a success or failure message with additional details, like the poll ID and the options.

Conclusion
This project demonstrates how to create a real-time polling system with Kafka, Zookeeper, PostgreSQL, and WebSocket integration. The system handles high concurrency, provides real-time updates, and supports a global leaderboard for all poll participants.

Please feel free to reach out if you have any questions regarding setup or usage!

