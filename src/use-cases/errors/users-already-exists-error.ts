
export class UsersInvalidCredentialsError extends Error {
  constructor() {
    super('User already exists')
  }
}