import { BadRequestException, Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { PrismaService } from '@core/prisma/services/prisma.service';
import { CreateUserDto } from '@user/dtos/create/create-user.dto';
import { User, UserFields } from '@user/types/user.type';
import { SessionTypes } from '@core/enums/sessionTypes.enum';

@Injectable()
export class UserCreateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async createUser(body: CreateUserDto) {
    try {
      return (await this.prismaService.user.create({
        select: UserFields,
        data: {
          name: body.name,
          lastName: body.lastName,
          image: '/img/avatars/generic-user.jpg',
          ...(body.sedeId && { sede: { connect: { id: body.sedeId } } }),
          session: {
            create: {
              email: body.email,
              password: hashSync(body.password, 10),
              rol: { connect: { id: body.rolId } },
              status: { connect: { id: 1 } },
              type: { connect: { id: SessionTypes.ADMINISTRADOR } },
            },
          },
        },
      })) as unknown as User;
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target[0] === 'email') {
        throw new BadRequestException(
          'El correo que intentas registrar ya existe',
        );
      }

      console.log(error);

      throw new BadRequestException(error);
    }
  }
}
