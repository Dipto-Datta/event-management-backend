# Event Management System - Backend API

This is the backend API for the Event Management System built with **Node.js**, **Express**, **MongoDB**, and secured via **JWT** authentication. It also supports **event subscription**, **event update tracking**, and **Docker** deployment.

---

## Features

- User Registration & Login (JWT)
- Create, Update, Delete Events
- Subscribe / Unsubscribe to Events
- Track event changes via notifications
- Role-based Access Control (admin/user)
- MongoDB with Mongoose ODM
- Docker-ready setup

---

## Installation

### 1. Clone the Repository


```bash
git clone https://github.com/your-username/event-manager-backend.git
cd event-manager-backend
```
### 2. Setup the env

- an .env-example file given on the directory, create an .env with the content of that example file (Don't forget to generate an JWT_secret)

### 3. Running the server(local run)

- npm install
- npm run dev

### 3. Docker Usage

- docker-compose up --build



