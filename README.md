# Clace App

This project is a full-stack application featuring a Vue 3 frontend built with Vite and a backend powered by Bun and Elysia.js. It demonstrates a modern approach to building web applications with a focus on performance and developer experience.

## Classroom Calendar Dashboard System for Students

This application serves as a dashboard for students to manage and view their classroom calendar.

## Technologies Used

*   **Frontend:** Vue 3, Vite, TypeScript
*   **Backend:** Bun, Elysia.js, TypeScript

## Prerequisites

Ensure you have [Bun](https://bun.sh/) installed on your system. Bun is used for package management and running the backend.

## Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Neil-urk12/clace.git
    cd clace
    ```

2.  **Install Dependencies:**
    Install all project dependencies using the Makefile:

    ```bash
    make install
    ```

## Project Structure

The project is organized into two main directories:

*   `frontend/`: Contains the Vue 3 application code.
*   `backend/`: Contains the Bun and Elysia.js server code.

Additional files like `Makefile` and the main `README.md` are located in the project root.

## Running the Application

You can start the frontend and backend development servers individually or together using the Makefile.

### 1. Start the Backend Server

Open a terminal and run the backend development command using the Makefile:

```bash
make dev-backend
```

This will start the Elysia.js server, typically running on `http://localhost:3000` (check terminal output for confirmation). The server will automatically restart on code changes.

### 2. Start the Frontend Development Server

Open another terminal and run the frontend development command using the Makefile:

```bash
make dev-frontend
```

Alternatively, you can run both simultaneously with:

```bash
make dev
```

This will start the Vue 3 development server using Vite, typically accessible at `http://localhost:5173` (check terminal output for the exact URL). The frontend will hot-reload on code changes.

## Building for Production

### 1. Build the Frontend

Navigate to the `frontend` directory and run the build command:

```bash
cd frontend
bun run build
```

This command compiles and bundles the frontend assets into a `dist` directory within the `frontend` folder, ready for deployment.

### 2. Backend Production

The backend can be run directly using Bun. For production environments, you might use a process manager like PM2 or Docker to keep the application running and manage resources.

To run the backend in production mode:

```bash
cd backend
bun src/index.ts
```
## Deployment Notes
