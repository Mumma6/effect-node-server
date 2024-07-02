import { Context, Layer, pipe } from "effect"
import { Effect, Option } from "effect"
import { CreateMovieType, UpdateMovieType } from "../models/movie.model"
import { MovieRepository } from "../repository/movie.repository"
import { MovieInfrastructure } from "../infrastructure/movie.infrastructure"
const make = Effect.gen(function* () {
  const repository = yield* MovieRepository
  const infrastructure = yield* MovieInfrastructure

  const getAllMovies = () => repository.getAllMovies()

  const getMovieById = (id: string) =>
    pipe(
      repository.GetMovieById(id),
      Effect.map(
        Option.match({
          onNone: () => "Movie not found",
          onSome: (movie) => movie,
        })
      )
    )

  const createMovie = (body: CreateMovieType) =>
    Effect.gen(function* () {
      const movieInformation = yield* infrastructure.getMovieInformation(body.title)

      const payload = {
        ...body,
        imdb_id: movieInformation.imdbID,
        plot: movieInformation.Plot,
        year: movieInformation.Year,
        genre: movieInformation.Genre,
      }

      return yield* repository.addMovie(payload)
    })

  const updateMovie = (body: UpdateMovieType) => repository.updateMovie(body)

  const deleteMovie = (id: string) =>
    Effect.gen(function* () {
      const movie = yield* repository.GetMovieById(id)

      if (Option.isNone(movie)) {
        return `movie with ID: ${id} not found`
      } else {
        yield* repository.deleteMovie(movie.value.id.toString())
        return `Movie with ID: ${id} deleted successfully`
      }
    })

  const getMoviesByUserId = (user_id: string) => repository.getMovieByUserId(user_id)

  return {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMoviesByUserId,
  } as const
})

export class MovieService extends Context.Tag("MovieService")<MovieService, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make).pipe(Layer.provide(MovieRepository.Live), Layer.provide(MovieInfrastructure.Live))
}
