# Contributing to GearGuard

## Getting Started

1.  **Environment Setup**:
    *   Ensure you have Node.js installed.
    *   Create a `.env` file in the root directory with the following variables:
        ```
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_jwt_secret
        ```

2.  **Installation**:
    *   Run `npm install` to install dependencies.

3.  **Running the App**:
    *   Run `npm run dev` to start the development server at `http://localhost:3000`.

## Database

*   The project uses MongoDB with Mongoose.
*   Models are defined in `src/lib/models.ts`.
*   Database connection logic is in `src/lib/mongodb.ts`.
*   Data access layers are in `src/lib/db.ts`.
*   **Seeding**: The database will automatically seed with initial data if it is empty upon the first server start.

## Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: Reusable UI components.
*   `src/lib`: Utility functions, database logic, and authentication.
*   `src/types`: TypeScript interfaces.

## Making Changes

1.  Create a new branch for your feature.
2.  Make your changes.
3.  Ensure code passes linting.
4.  Submit a Pull Request.
