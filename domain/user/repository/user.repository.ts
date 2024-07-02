import { Schema } from "@effect/schema"
import { PgClient } from "@effect/sql-pg"
import { Context, Effect, Layer } from "effect"
import { SqlResolver, SqlSchema } from "@effect/sql"

import { InsertUserSchema, UpdateUserSchema, User } from "../models/user.model"

const make = Effect.gen(function* () {
  const sql = yield* PgClient.PgClient

  const AddUser = yield* SqlResolver.ordered("InsertUser", {
    Request: InsertUserSchema,
    Result: User,
    execute: (requests) => sql`INSERT INTO users ${sql.insert(requests)} RETURNING *`,
  }).pipe(Effect.withSpan("AddUserResolver"))

  const DeleteUser = yield* SqlResolver.findById("DeleteUser", {
    Id: Schema.String,
    Result: Schema.Struct({ id: Schema.Number }),
    ResultId: (result) => result.id.toString(),
    execute: (ids) => sql`DELETE FROM users WHERE id IN ${sql.in(ids)} RETURNING id`,
  }).pipe(Effect.withSpan("DeleteUserResolver"))

  const UpdateUser = yield* SqlResolver.ordered("UpdateUser", {
    Request: UpdateUserSchema,
    Result: User,
    execute: (requests) => sql`
      UPDATE users 
      SET name = ${requests[0].name}, email = ${requests[0].email}, updated_at = NOW()
      WHERE id = ${requests[0].id}
      RETURNING *
    `,
  }).pipe(Effect.withSpan("UpdateUserResolver"))

  const GetUserById = yield* SqlResolver.findById("GetUserById", {
    Id: Schema.String,
    Result: User,
    ResultId: (result) => result.id.toString(),
    execute: (ids) => sql`SELECT * FROM users WHERE id IN ${sql.in(ids)}`,
  }).pipe(Effect.withSpan("GetUserByIdResolver"))

  const GetAllUsers = SqlSchema.findAll({
    Request: Schema.Void,
    Result: User,
    execute: () =>
      Effect.gen(function* () {
        return yield* sql`SELECT * FROM users`
      }).pipe(Effect.withSpan("getAllUsersResolver")),
  })

  return {
    addUser: AddUser.execute,
    GetUserById: GetUserById.execute,
    getAllUsers: GetAllUsers,
    updateUser: UpdateUser.execute,
    deleteUser: DeleteUser.execute,
  } as const
})

export class UserRepository extends Context.Tag("UserRepository")<UserRepository, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make)
}
