import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY } from '../../../domain/user/user.repository';
import type { IUserRepository } from '../../../domain/user/user.repository';
import { PASSWORD_HASHER } from '../../../domain/user/password-hasher.port';
import type { IPasswordHasher } from '../../../domain/user/password-hasher.port';
import { ConflictDomainException } from '../../../domain/exceptions';
import { BaseCommandResult } from '../../common/base-command-result';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, BaseCommandResult>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async execute(command: CreateUserCommand): Promise<BaseCommandResult> {
    const existingByUsername = await this.userRepo.findByUsername(command.username);
    if (existingByUsername) {
      throw new ConflictDomainException('Username already exists');
    }
    const existingByEmail = await this.userRepo.findByEmail(command.email);
    if (existingByEmail) {
      throw new ConflictDomainException('Email already exists');
    }

    const hashed = await this.hasher.hash(command.password);

    const user = await this.userRepo.create({
      username: command.username,
      email: command.email,
      password: hashed,
      role: command.role,
      firstName: command.firstName,
      lastName: command.lastName,
      gender: command.gender ?? null,
      mustChangePassword: true,
      createdBy: command.createdBy,
      departmentId: command.departmentId ?? null,
      positionId: command.positionId ?? null,
    });

    return { id: user.id };
  }
}
