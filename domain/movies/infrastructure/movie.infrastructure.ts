import { Config, Context, Effect, Layer, pipe } from "effect"
import { HttpClientRequest, HttpClient } from "@effect/platform"
import { ApiMovieSchema } from "../models/movie.model"

const basePath = "http://www.omdbapi.com/"

const make = Effect.gen(function* () {
  const key = yield* Config.string("OMDB_KEY")
  const getMovieInformation = (name: string) =>
    pipe(
      HttpClientRequest.get(`${basePath}?t=${name}&apikey=${key}`),
      HttpClient.fetch,
      ApiMovieSchema.decodeResponse,
      Effect.retry({ times: 3 }),
      Effect.withSpan("GetMovieInformation")
    )

  return {
    getMovieInformation,
  } as const
})

export class MovieInfrastructure extends Context.Tag("MovieInfrastructure")<MovieInfrastructure, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make)
}
