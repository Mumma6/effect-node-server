import { Schema } from "@effect/schema"
import { PgClient } from "@effect/sql-pg"
import { Context, Effect, Layer } from "effect"
import { SqlResolver, SqlSchema } from "@effect/sql"
import { InsertMovieSchema, Movie, UpdateMovieSchema } from "../models/movie.model"

const make = Effect.gen(function* () {
  const sql = yield* PgClient.PgClient

  const AddMovie = yield* SqlResolver.ordered("InsertMovie", {
    Request: InsertMovieSchema,
    Result: Movie,
    execute: (requests) => sql`INSERT INTO movies ${sql.insert(requests)} RETURNING *`,
  }).pipe(Effect.withSpan("AddMovieResolver"))

  const DeleteMovie = yield* SqlResolver.ordered("DeleteMovie", {
    Request: Schema.String,
    Result: Schema.Struct({ id: Schema.Number }),
    execute: (requests) => sql`DELETE FROM movies WHERE id = ${requests[0]} RETURNING id`,
  }).pipe(Effect.withSpan("DeleteMovieResolver"))

  const UpdateMovie = yield* SqlResolver.ordered("UpdateMovie", {
    Request: UpdateMovieSchema,
    Result: Movie,
    execute: (requests) => sql`
      UPDATE movies 
      SET title = ${requests[0].title}, year = ${requests[0].year}, genre = ${requests[0].genre}, plot = ${requests[0].plot}, imdbID = ${requests[0].imdbID}, updated_at = NOW()
      WHERE id = ${requests[0].id}
      RETURNING *
    `,
  }).pipe(Effect.withSpan("UpdateMovieResolver"))

  const GetMovieById = yield* SqlResolver.findById("GetMovieById", {
    Id: Schema.String,
    Result: Movie,
    ResultId: (result) => result.id.toString(),
    execute: (ids) => sql`SELECT * FROM movies WHERE id IN ${sql.in(ids)}`,
  }).pipe(Effect.withSpan("GetMovieByIdResolver"))

  const GetAllMovies = SqlSchema.findAll({
    Request: Schema.Void,
    Result: Movie,
    execute: () =>
      Effect.gen(function* () {
        return yield* sql`SELECT * FROM movies`
      }).pipe(Effect.withSpan("getAllMoviesResolver")),
  })

  const GetMovieByUserId = SqlSchema.findAll({
    Request: Schema.String,
    Result: Movie,
    execute: (request) =>
      Effect.gen(function* () {
        return yield* sql`SELECT * FROM movies WHERE user_id = ${request}`
      }).pipe(Effect.withSpan("getMovieByUserIdResolver")),
  })

  return {
    addMovie: AddMovie.execute,
    GetMovieById: GetMovieById.execute,
    getAllMovies: GetAllMovies,
    updateMovie: UpdateMovie.execute,
    deleteMovie: DeleteMovie.execute,
    getMovieByUserId: GetMovieByUserId,
  } as const
})

export class MovieRepository extends Context.Tag("MovieRepository")<MovieRepository, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make)
}
