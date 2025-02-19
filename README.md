# Postgres/Express Movies JSON API - Node.JS

This is a simple Node.js project using Express, PostgreSQL, and other related technologies. The project includes a RESTful API for managing movies, with CRUD operations.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)

## Installation

To get started with this project, clone the repository and install the required dependencies:

```bash
git clone <repository_url>
cd js-practice-1
npm install
```

## Usage

### Running Locally

To start the server locally, run the following command:

```bash
npm run start:local
```

The server will be running on `http://localhost:1234` by default.

### Running with Database

To start the server with PostgreSQL, use the following command:

```bash
npm run start:db
```

Make sure your PostgreSQL instance is running and configured properly.

### Development Mode

For development, you can use `nodemon` to automatically restart the server upon changes:

- To run the local server in development mode:
  ```bash
  npm run dev:local
  ```

- To run the database server in development mode:
  ```bash
  npm run dev:db
  ```

## Scripts

- `start:local`: Starts the local server.
- `start:db`: Starts the server with the PostgreSQL database.
- `dev:local`: Starts the local server in development mode with `nodemon`.
- `dev:db`: Starts the PostgreSQL server in development mode with `nodemon`.

## Dependencies

This project uses the following dependencies:

- `express`: Web framework for Node.js.
- `cors`: Middleware to enable CORS (Cross-Origin Resource Sharing).
- `dotenv`: Loads environment variables from a `.env` file.
- `pg`: PostgreSQL client for Node.js.
- `uuid`: Generates unique identifiers.
- `zod`: Schema validation library.
- `nodemon`: Automatically restarts the server during development.

## Environment Variables

You can configure the following environment variables in a `.env` file:

- `POSTGRES_USER`: The PostgreSQL database user.
- `POSTGRES_PASSWORD`: The PostgreSQL database password.
- `POSTGRES_HOST`: The host of the PostgreSQL database.
- `POSTGRES_PORT`: The port of the PostgreSQL database.
- `POSTGRES_DB`: The name of the PostgreSQL database.


