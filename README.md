# Complete API with Only Effect: A Movie Management API

This project is an API built with the Effect library. It manages users and their associated movies, integrating with an external movie database (OMDb) to fetch additional movie details. This app showcases how you can build a backend API using only Effect and integrate it with a database and external APIs.

## Features

- User Management (CRUD operations)
- Movie Management (CRUD operations)
- Fetch movie details from OMDb API
- Relational database management using PostgreSQL
- Error handling using Effect's powerful error handling capabilities
- Modular and scalable architecture
- Custom middleware
- Effect Tracing

## Technologies Used

- Effect
- Effect schema
- Effect SQL
- Effect opentelemetry
- Effect platform
- PostgreSQL
- OMDb API

## Design

### Domain Layer

The domain layer is divided into `user` and `movie` domains, each containing the following sub-layers:

- **Models**: Define the data structures and schemas.
- **Repositories**: Handle data access and database operations.
- **Infrastructure**: Handle external API calls (movie only).
- **Services**: Implement business logic and orchestrate calls to repositories and external APIs (for the movie domain).

### Routes Layer

The routes layer defines the HTTP routes for the API. Each domain has its own set of routes:

- **User Routes**: Handles user-related operations (create, read, update, delete).
- **Movie Routes**: Handles movie-related operations (create, read, update, delete) and integrates with the OMDb API.

### Lib Layer

The lib layer contains configuration and setup for the database:

- **Database**: Contains configuration and initialization logic for connecting to PostgreSQL using the Effect library.

### Entry Point

- **index.ts**: The main entry point of the application. It initializes the application by setting up routes and starting the server.

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/Mumma6/effect-node-server.git
   cd effect-node-server
   ```

2. **install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

Create a .env file in the root directory with the following content:

```sh
    OMDB_KEY=your_omdb_api_key
    DATABASE=effect
    HOST=localhost
    USERNAME=postgres
    PORT=5432
    PASSWORD=your_db_password
```

Make sure you get a free apikey from: https://www.omdbapi.com/apikey.aspx

3. **Run the application:**

```sh
 npm dev
```

## API Endpoints

Use Postman to test the API endpoints

### User Routes

Create User

- Endpoint: POST /users/create
- Description: Creates a new user.

Get All Users

- Endpoint: GET /users/all
- Description: Retrieves all users.

Get User by ID

- Endpoint: GET /users/:id
- Description: Retrieves a user by their ID.

Update User

- Endpoint: PATCH /users/update
- Description: Updates a user's details.

Delete User

- Endpoint: DELETE /users/:id
- Description: Deletes a user by their ID.

### Movie Routes

Create Movie

- Endpoint: POST /movies/create
- Description: Creates a new user.

Get All movies

- Endpoint: GET /movies/all
- Description: Retrieves all movies.

Get Movie by ID

- Endpoint: GET /movies/:id
- Description: Retrieves a movie by their ID.

Get Movies for user

- Endpoint: GET /movies/user/:userid
- Description: Retrieves all movies for a user.

Update Movie

- Endpoint: PATCH /movies/update
- Description: Updates a movies's details.

Delete Movie

- Endpoint: DELETE /movies/:id
- Description: Deletes a movie by ID.

Error Handling

This project uses Effect's robust error handling to provide informative and consistent error responses. The following error types are handled:

- ParseError: Indicates issues with request data parsing.
- SqlError: Indicates issues with database operations.
- RequestError: Indicates issues with request handling.
- HttpBodyError: Indicates issues with processing the request body.

## Project Structure

├── domain
│ ├── user
│ │ ├── models
│ │ │ └── user.model.ts
│ │ ├── repositories
│ │ │ └── user.repository.ts
│ │ ├── services
│ │ | └── user.service.ts
│ ├── movie
│ │ ├── models
│ │ │ └── movie.model.ts
│ │ ├── repositories
│ │ │ └── movie.repository.ts
│ │ ├── services
│ │ │ └── movie.service.ts
│ │ ├── infrastructure
│ │ | └── movie.infrastructure.ts
├── routes
│ ├── users
│ │ └── users.routes.ts
│ ├── movies
│ | └── movies.routes.ts
│ └── routes.ts
├── lib
│ └── database.ts
└── index.ts

# Conclusion

This project demonstrates how to build a scalable and modular API with Effect. It integrates seamlessly with PostgreSQL for data persistence and OMDb for fetching movie details, showcasing robust error handling and clean architecture principles.

Feel free to contribute, open issues, and provide feedback!
