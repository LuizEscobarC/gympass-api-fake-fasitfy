
export class UsersAlreadyExistsError extends Error {
  constructor() {
    super('Invalid Credentials')
  }
}