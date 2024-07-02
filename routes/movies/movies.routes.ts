import { HttpRouter, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect, Layer, pipe } from "effect"
import { Schema } from "@effect/schema"
import { CreateMovieSchema, UpdateMovieSchema } from "../../domain/movies/models/movie.model"
import { MovieService } from "../../domain/movies/service/movie.service"

export class MoviesRouter extends HttpRouter.Tag("MoviesRouter")<MoviesRouter>() {}

const Params = Schema.Struct({
  id: Schema.String,
})

enum Routes {
  All = "/all",
  Id = "/:id",
  Create = "/create",
  Update = "/update",
  UserId = "/user/:id",
}

const GetMovies = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.get(
        Routes.All,
        Effect.gen(function* () {
          const movies = yield* service.getAllMovies()
          return yield* HttpServerResponse.json(movies)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for fetching all movies", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while fetching all movies", details: error.message }, { status: 500 }),

            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while fetching all movies", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("GetAllMoviesRoute")
        )
      )
    )
  )
)

const GetMovieById = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.get(
        Routes.Id,
        Effect.gen(function* () {
          const { id } = yield* HttpRouter.schemaPathParams(Params)
          const movie = yield* service.getMovieById(id)
          return yield* HttpServerResponse.json(movie)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for fetching movie by ID", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while fetching movie by ID", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while fetching movie by ID", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("GetMovieByIdRoute")
        )
      )
    )
  )
)

const GetMoviesForUserId = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.get(
        Routes.UserId,
        Effect.gen(function* () {
          const { id } = yield* HttpRouter.schemaPathParams(Params)
          const movies = yield* service.getMoviesByUserId(id)
          return yield* HttpServerResponse.json(movies)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json(
                { message: "Invalid request data for fetching movies for userId", details: error.message },
                { status: 400 }
              ),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while fetching movies for userId", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while fetching movies for userId", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("GetMoviesForUserIdRoute")
        )
      )
    )
  )
)

const DeleteMovieById = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.del(
        Routes.Id,
        Effect.gen(function* () {
          const { id } = yield* HttpRouter.schemaPathParams(Params)
          const message = yield* service.deleteMovie(id)
          return yield* HttpServerResponse.json({ message })
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for deleting movie by ID", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while deleting movie by ID", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while deleting movie by ID", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("DeleteMovieByIdRoute")
        )
      )
    )
  )
)

const CreateMovie = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.post(
        Routes.Create,
        Effect.gen(function* () {
          const body = yield* HttpServerRequest.schemaBodyJson(CreateMovieSchema)
          const newMovie = yield* service.createMovie(body)
          return yield* HttpServerResponse.json(newMovie)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for creating movie", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while creating movie", details: error.message }, { status: 500 }),
            RequestError: (error) =>
              HttpServerResponse.json({ message: "Request error while creating movie", details: error.message }, { status: 400 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json({ message: "Error processing request body while creating movie", details: error.reason }, { status: 400 }),
          }),
          Effect.withSpan("CreateMovieRoute")
        )
      )
    )
  )
)

const UpdateMovie = MoviesRouter.use((router) =>
  pipe(
    MovieService,
    Effect.flatMap((service) =>
      router.patch(
        Routes.Update,
        Effect.gen(function* () {
          const body = yield* HttpServerRequest.schemaBodyJson(UpdateMovieSchema)
          const updatedMovie = yield* service.updateMovie(body)
          return yield* HttpServerResponse.json(updatedMovie)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for updating movie", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while updating movie", details: error.message }, { status: 500 }),
            RequestError: (error) =>
              HttpServerResponse.json({ message: "Request error while updating movie", details: error.message }, { status: 400 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json({ message: "Error processing request body while updating movie", details: error.reason }, { status: 400 }),
          }),
          Effect.withSpan("UpdateMovieRoute")
        )
      )
    )
  )
)

export const MovieRoutes = Layer.mergeAll(GetMovies, CreateMovie, UpdateMovie, GetMovieById, GetMoviesForUserId, DeleteMovieById).pipe(
  Layer.provideMerge(MoviesRouter.Live)
)
