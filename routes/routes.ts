import { HttpRouter } from "@effect/platform"
import { Effect, Layer } from "effect"
import { UserRoutes, UsersRouter } from "./users/users.routes"
import { MoviesRouter, MovieRoutes } from "./movies/movies.routes"

export const AppRouter = HttpRouter.Default.use((router) =>
  Effect.gen(function* () {
    yield* router.mount("/users", yield* UsersRouter.router)
    yield* router.mount("/movies", yield* MoviesRouter.router)
  })
).pipe(Layer.provide(UserRoutes), Layer.provide(MovieRoutes))
