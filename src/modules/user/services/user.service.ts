import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

import { QueryParams } from '@core/types/query-params.type';
import { AllUsersQueryDto } from '@user/dtos/read/all-users.dto';
import { UserGetRepository } from '@user/repositories/user-get.repository';
import { User, UserFields } from '@user/types/user.type';
import { serializeMany, serializeOne } from '@user/serializers/user.serializer';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { UserUpdateRepository } from '@user/repositories/user-update.repository';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';
import { UserCreateRepository } from '@user/repositories/user-create.repository';
import { CreateUserDto } from '@user/dtos/create/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userGetRepository: UserGetRepository,
    private readonly userUpdateRepository: UserUpdateRepository,
    private readonly userCreateReposiory: UserCreateRepository,
    private readonly configService: ConfigService,
  ) {}

  public async getAllUsers(queryParams: AllUsersQueryDto) {
    const findOptions: Prisma.userFindManyArgs =
      this.buildAllUsersFilters(queryParams);

    const users = await this.userGetRepository.findAllUsers(
      findOptions,
      queryParams as unknown as QueryParams,
      queryParams.paginated,
    );

    if (!queryParams.paginated) {
      return serializeMany(users as unknown as User[], this.configService);
    }

    return users;
  }

  private buildAllUsersFilters(
    queryParams: AllUsersQueryDto,
  ): Prisma.userFindManyArgs {
    return {
      select: UserFields,
      where: {
        ...(queryParams.sedeId !== undefined && {
          sede: { id: { equals: queryParams.sedeId } },
        }),

        session: {
          ...(queryParams.statusId && {
            status: { id: { equals: queryParams.statusId } },
          }),
          ...(queryParams.rolId && {
            rol: { id: { equals: queryParams.rolId } },
          }),
        },

        ...(queryParams.search && {
          OR: [
            {
              name: { contains: queryParams.search, mode: 'insensitive' },
            },
            {
              lastName: { contains: queryParams.search, mode: 'insensitive' },
            },
            {
              session: {
                email: { contains: queryParams.search, mode: 'insensitive' },
              },
            },
          ],
        }),
      },
    };
  }

  public async getRoles() {
    return this.userGetRepository.findAllRoles();
  }

  public async getStatuses() {
    return this.userGetRepository.findAllStatuses();
  }

  public async getAllUsersMetaData() {
    return this.userGetRepository.getAllUsersMetaData();
  }

  public async getOneUserOrThrowBadRequest(id: number) {
    const user = await this.userGetRepository.findOneUser(
      {
        select: UserFields,
        where: { id },
      },
      new BadRequestException('No existe el usuario'),
    );

    return serializeOne(user, this.configService);
  }

  public async updateUserById(id: number, body: UpdateUserDto) {
    await this.getOneUserOrThrowBadRequest(id);

    const updatedUser = await this.userUpdateRepository.updateUser(id, body);

    return serializeOne(updatedUser, this.configService);
  }

  public async updateUserPasswordById(id: number, body: UpdateUserPasswordDto) {
    await this.getOneUserOrThrowBadRequest(id);

    await this.userUpdateRepository.updateUserPasswordById(id, body);

    return { message: 'Contraseña actualizada' };
  }

  public async createUser(body: CreateUserDto) {
    const newUser = await this.userCreateReposiory.createUser(body);

    return serializeOne(newUser, this.configService);
  }

  public async deleteUser(id: number) {
    await this.getOneUserOrThrowBadRequest(id);

    await this.userUpdateRepository.deleteUser(id);

    return { message: 'Usuario Eliminado' };
  }
}
