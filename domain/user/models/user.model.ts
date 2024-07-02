import { Schema } from "@effect/schema"
import { Brand } from "effect"

export class User extends Schema.Class<User>("User")({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
  created_at: Schema.DateFromSelf,
  updated_at: Schema.DateFromSelf,
}) {}

export const InsertUserSchema = Schema.Struct(User.fields).pipe(Schema.omit("id", "created_at", "updated_at"))

export type InsertUserType = Schema.Schema.Type<typeof InsertUserSchema>

export const UpdateUserSchema = Schema.Struct(User.fields).pipe(Schema.omit("created_at", "updated_at"))

export type UpdateUserType = Schema.Schema.Type<typeof UpdateUserSchema>
