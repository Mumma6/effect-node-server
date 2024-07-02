import { HttpMiddleware, HttpRouter, HttpServer, HttpServerResponse } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { createServer } from "http"
import { DatabaseInitialisation, SqlLive } from "./lib/database"
import { AppRouter } from "./routes/routes"

import { UserService } from "./domain/user/service/user.service"
import { MovieService } from "./domain/movies/service/movie.service"
import { TracingConsole } from "./lib/tracing"

// Example of a middleware
const myLogger = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    console.log("LOGGED")
    return yield* app
  })
)
const ServerLive = NodeHttpServer.layer(createServer, { port: 5000, host: "localhost" })

const HttpLive = HttpRouter.Default.unwrap(HttpServer.serve(myLogger)).pipe(
  Layer.provide(AppRouter),
  Layer.provide(ServerLive),
  Layer.provide(UserService.Live),
  Layer.provide(MovieService.Live),
  Layer.provide(DatabaseInitialisation.Live),
  Layer.provide(SqlLive)
  // Layer.provide(TracingConsole)
)

NodeRuntime.runMain(Layer.launch(HttpLive))
