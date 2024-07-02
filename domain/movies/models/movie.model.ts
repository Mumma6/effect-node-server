import { HttpClientResponse } from "@effect/platform"
import { Schema } from "@effect/schema"

export class Movie extends Schema.Class<Movie>("Movie")({
  id: Schema.Number,
  user_id: Schema.Number,
  title: Schema.String,
  year: Schema.String,
  genre: Schema.String,
  plot: Schema.String,
  imdb_id: Schema.String,
  created_at: Schema.DateFromSelf,
  updated_at: Schema.DateFromSelf,
}) {}

export const InsertMovieSchema = Schema.Struct({
  user_id: Schema.Number,
  title: Schema.String,
  year: Schema.String,
  genre: Schema.String,
  plot: Schema.String,
  imdb_id: Schema.String,
})

export type InsertMovieType = Schema.Schema.Type<typeof InsertMovieSchema>

export const CreateMovieSchema = Schema.Struct({
  user_id: Schema.Number,
  title: Schema.String,
})

export type CreateMovieType = Schema.Schema.Type<typeof CreateMovieSchema>

export const UpdateMovieSchema = Schema.Struct({
  id: Schema.Number,
  userId: Schema.Number,
  title: Schema.String,
  year: Schema.String,
  genre: Schema.String,
  plot: Schema.String,
  imdbID: Schema.String,
})

export type UpdateMovieType = Schema.Schema.Type<typeof UpdateMovieSchema>

// Schema to match the API response
export class ApiMovieSchema extends Schema.Class<ApiMovieSchema>("ApiMovieSchema")({
  Title: Schema.String,
  Year: Schema.String,
  Rated: Schema.optional(Schema.String),
  Released: Schema.optional(Schema.String),
  Runtime: Schema.optional(Schema.String),
  Genre: Schema.String,
  Director: Schema.optional(Schema.String),
  Writer: Schema.optional(Schema.String),
  Actors: Schema.optional(Schema.String),
  Plot: Schema.String,
  Language: Schema.optional(Schema.String),
  Country: Schema.optional(Schema.String),
  Awards: Schema.optional(Schema.String),
  Poster: Schema.optional(Schema.String),
  Ratings: Schema.optional(
    Schema.Array(
      Schema.Struct({
        Source: Schema.String,
        Value: Schema.String,
      })
    )
  ),
  Metascore: Schema.optional(Schema.String),
  imdbRating: Schema.optional(Schema.String),
  imdbVotes: Schema.optional(Schema.String),
  imdbID: Schema.String,
  Type: Schema.optional(Schema.String),
  DVD: Schema.optional(Schema.String),
  BoxOffice: Schema.optional(Schema.String),
  Production: Schema.optional(Schema.String),
  Website: Schema.optional(Schema.String),
  Response: Schema.optional(Schema.String),
}) {
  static decodeResponse = HttpClientResponse.schemaBodyJsonScoped(ApiMovieSchema)
}

export type ApiMovieType = Schema.Schema.Type<typeof ApiMovieSchema>
