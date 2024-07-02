import { PgClient } from "@effect/sql-pg"
import { Config, Context, Effect, Layer, Redacted } from "effect"

const make = Effect.gen(function* () {
  const sql = yield* PgClient.PgClient

  // Suppress NOTICE messages
  yield* sql`SET client_min_messages TO WARNING;`

  // Create users table if it does not exist
  yield* sql`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );`

  // Create movies table if it does not exist
  yield* sql`CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(4),
    genre VARCHAR(255),
    plot TEXT,
    imdb_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );`
})

export class DatabaseInitialisation extends Context.Tag("DatabaseInitialisation")<DatabaseInitialisation, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make)
}

export const SqlLive = PgClient.layer({
  database: Config.succeed("effect"),
  host: Config.succeed("localhost"),
  username: Config.succeed("postgres"),
  port: Config.succeed(5432),
  password: Config.succeed(Redacted.make("123")),
})
