# Task Management App

## Overview

The **Task Management App** is a simple yet powerful tool for users to efficiently manage their tasks. It is built with **Next.js** using **Server Actions** for backend functionality and **MongoDB** for data persistence. Users can create, view, edit, delete, and mark tasks as complete/incomplete. The app provides a user-friendly interface with basic task details, such as title, description, and due date.

The app is deployed on **Vercel**, and you can access the live application through the link below:

[Live Application](https://task-management-yardstick.vercel.app/)

## Features

- **Create Tasks**: Add tasks with essential details like title, description, and due date.
- **View Tasks**: View all tasks with their details and completion status.
- **Edit Tasks**: Modify task details, including title, description, and due date.
- **Delete Tasks**: Remove tasks when they are no longer needed.
- **Mark Tasks as Complete/Incomplete**: Track the completion status of tasks.
- **Error Handling**: Meaningful error messages displayed for failed operations.
- **Loading States**: Loading indicators to improve user experience during data fetching.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (latest version)
  - A React framework for building fast and scalable web applications.
  - Uses React Server Components and API Routes for seamless integration.
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - Handles CRUD operations using server-side logic and API routes in Next.js.
- **Database**: [MongoDB](https://www.mongodb.com/)
  - NoSQL database used to store task data.
  - Data is stored and accessed via **MongoDB Atlas** for cloud hosting.
- **Deployment**: [Vercel](https://vercel.com/)
  - Continuous deployment platform that integrates seamlessly with Next.js.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/en/) (LTS version recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account for cloud-based MongoDB setup (or a local MongoDB instance).

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app
