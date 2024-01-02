# Notes API

This is a simple Node.js and Express API for creating, reading, updating, and deleting notes. 

## Features

- **Create Note:** Create a new note with a title and content.
- **Read Note:** Retrieve a list of all notes or a specific note by ID.
- **Update Note:** Modify the title or content of an existing note.
- **Delete Note:** Remove a note from the database.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [npm](https://www.npmjs.com/) (Node Package Manager) installed

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Jonatandlr/todolistApi
    ```

2. Navigate to the project directory:

    ```bash
    cd todolistApi
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory with the following content:

    ```env
    DATABASE_URL=file:./dev.db
    ```

    Adjust in /prisma/scheme.prisma
   ```scheme.prisma
   datasource db {
   provider = "sqlite"
   url      = env("DATABASE_URL")
    }
   ```

### Usage

1. Start the server:

    ```bash
    npm run start
    ```
    or
    ```
    npm run server
    ```

2. The API will be accessible at `http://localhost:3000` (or the specified port).

## API Endpoints

* /RestApi/PruebasCategorias.Rest
* /RestApi/PruebasNotes.Rest
