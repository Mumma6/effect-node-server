import { Context, Layer, pipe } from "effect"
import { Effect, Option } from "effect"
import { InsertUserType, UpdateUserType } from "../models/user.model"
import { UserRepository } from "../repository/user.repository"

const make = Effect.gen(function* () {
  const repository = yield* UserRepository

  const getAllUsers = () => repository.getAllUsers()

  const getUserById = (id: string) =>
    pipe(
      repository.GetUserById(id),
      Effect.map(
        Option.match({
          onNone: () => "User not found",
          onSome: (user) => user,
        })
      )
    )

  const createUser = (body: InsertUserType) => repository.addUser(body)

  const updateUser = (body: UpdateUserType) => repository.updateUser(body)

  const deleteUser = (id: string) =>
    Effect.gen(function* () {
      const user = yield* repository.GetUserById(id)

      if (Option.isNone(user)) {
        return `User with ID: ${id} not found`
      } else {
        yield* repository.deleteUser(user.value.id.toString())
        return `User with ID: ${id} deleted successfully`
      }
    })

  return {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  } as const
})

export class UserService extends Context.Tag("UserService")<UserService, Effect.Effect.Success<typeof make>>() {
  static readonly Live = Layer.effect(this, make).pipe(Layer.provide(UserRepository.Live))
}
