import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUserCase } from './register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

describe('Register User Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUserCase = new RegisterUserCase({
      async findByEmail(email: string) {
        return null
      },
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date()
        }
      }
    })

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
})