import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { UsersInvalidCredentialsError } from './errors/users-already-exists-error'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email, 
    password
  }: AuthenticateUseCaseRequest ): Promise<AuthenticateUseCaseResponse> { 
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new UsersInvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new UsersInvalidCredentialsError()
    }

    return {
      user
    }
  }
}