import { HttpRouter, HttpServerRequest, HttpServerResponse } from "@effect/platform"
import { Effect, Layer, pipe } from "effect"

import { Schema } from "@effect/schema"
import { InsertUserSchema, UpdateUserSchema } from "../../domain/user/models/user.model"
import { UserService } from "../../domain/user/service/user.service"

export class UsersRouter extends HttpRouter.Tag("UsersRouter")<UsersRouter>() {}

const Params = Schema.Struct({
  id: Schema.String,
})

enum Routes {
  All = "/all",
  Id = "/:id",
  Create = "/create",
  Update = "/update",
}

const GetUsers = UsersRouter.use((router) =>
  pipe(
    UserService,
    Effect.flatMap((service) =>
      router.get(
        Routes.All,
        Effect.gen(function* () {
          const users = yield* service.getAllUsers()
          return yield* HttpServerResponse.json(users)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for fetching all users", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while fetching all users", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while fetching all users", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("GetAllUsersRoute")
        )
      )
    )
  )
)

const GetUserById = UsersRouter.use((router) =>
  pipe(
    UserService,
    Effect.flatMap((service) =>
      router.get(
        Routes.Id,
        Effect.gen(function* () {
          const { id } = yield* HttpRouter.schemaPathParams(Params)
          const user = yield* service.getUserById(id)
          return yield* HttpServerResponse.json(user)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for fetching user by ID", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while fetching user by ID", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while fetching user by ID", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("GetUserByIdRoute")
        )
      )
    )
  )
)

const DeleteUserById = UsersRouter.use((router) =>
  pipe(
    UserService,
    Effect.flatMap((service) =>
      router.del(
        Routes.Id,
        Effect.gen(function* () {
          const { id } = yield* HttpRouter.schemaPathParams(Params)
          const message = yield* service.deleteUser(id)
          return yield* HttpServerResponse.json({ message })
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for deleting user by ID", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while deleting user by ID", details: error.message }, { status: 500 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json(
                { message: "Error processing request body while deleting user by ID", details: error.reason },
                { status: 400 }
              ),
          }),
          Effect.withSpan("DeleteUserByIdRoute")
        )
      )
    )
  )
)

const CreateUser = UsersRouter.use((router) =>
  pipe(
    UserService,
    Effect.flatMap((service) =>
      router.post(
        Routes.Create,
        Effect.gen(function* () {
          const body = yield* HttpServerRequest.schemaBodyJson(InsertUserSchema)
          const newUser = yield* service.createUser(body)
          return yield* HttpServerResponse.json(newUser)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for creating user", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while creating user", details: error.message }, { status: 500 }),
            RequestError: (error) =>
              HttpServerResponse.json({ message: "Request error while creating user", details: error.message }, { status: 400 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json({ message: "Error processing request body while creating user", details: error.reason }, { status: 400 }),
          }),
          Effect.withSpan("CreateUserRoute")
        )
      )
    )
  )
)

const UpdateUser = UsersRouter.use((router) =>
  pipe(
    UserService,
    Effect.flatMap((service) =>
      router.patch(
        Routes.Update,
        Effect.gen(function* () {
          const body = yield* HttpServerRequest.schemaBodyJson(UpdateUserSchema)
          const updatedUser = yield* service.updateUser(body)
          return yield* HttpServerResponse.json(updatedUser)
        }).pipe(
          Effect.catchTags({
            ParseError: (error) =>
              HttpServerResponse.json({ message: "Invalid request data for updating user", details: error.message }, { status: 400 }),
            SqlError: (error) =>
              HttpServerResponse.json({ message: "Database error while updating user", details: error.message }, { status: 500 }),
            RequestError: (error) =>
              HttpServerResponse.json({ message: "Request error while updating user", details: error.message }, { status: 400 }),
            HttpBodyError: (error) =>
              HttpServerResponse.json({ message: "Error processing request body while updating user", details: error.reason }, { status: 400 }),
          }),
          Effect.withSpan("UpdateUserRoute")
        )
      )
    )
  )
)

export const UserRoutes = Layer.mergeAll(GetUsers, CreateUser, UpdateUser, GetUserById, DeleteUserById).pipe(
  Layer.provideMerge(UsersRouter.Live)
)
