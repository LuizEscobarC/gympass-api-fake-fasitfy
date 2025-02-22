import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUserCase } from './register'
import { InMemoryUsersRepository } from 
  '@/repositories/in-memory-database/in-memory-users-repository'
import { UsersAlreadyExistsError } from './errors/users-already-exists-error'

describe('Register User Case', () => {

  it('should register a new user', async () => {
    const registerUserCase = new RegisterUserCase(new InMemoryUsersRepository)

    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456'
    })

    expect(user.id).toBeDefined()
  })

  it('should hash user password upon registration', async () => {
    const registerUserCase = new RegisterUserCase(new InMemoryUsersRepository)

    const { user } = await registerUserCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456'
    })

    const isPasswordHashed = await compare(
      '123456', 
      user.password_hash
    )

    expect(isPasswordHashed).toBe(true)
  })

  it('should not allow two users with the same email', async () => {
    const registerUserCase = new RegisterUserCase(new InMemoryUsersRepository)

    await registerUserCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456'
    })

    expect(() => registerUserCase.execute({
      name: 'John Doe',
      email: 'johnDoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(UsersAlreadyExistsError)

  })
})