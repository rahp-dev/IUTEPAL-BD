import { Injectable } from '@nestjs/common';
import { hashSync } from 'bcrypt';

import { SessionStatus } from '@core/enums/sessionStatus.enum';
import { PrismaService } from '@core/prisma/services/prisma.service';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { User, UserFields } from '@user/types/user.type';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';

@Injectable()
export class UserUpdateRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async updateUser(id: number, body: UpdateUserDto) {
    return (await this.prismaService.user.update({
      where: { id },
      select: UserFields,
      data: {
        ...(body.name && { name: body.name }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.sedeId && { sede: { connect: { id: body.sedeId } } }),
        session: {
          update: {
            ...(body.email && { email: body.email }),
            ...(body.rolId && { rolId: body.rolId }),
          },
        },
      },
    })) as unknown as User;
  }

  public async updateUserPasswordById(id: number, body: UpdateUserPasswordDto) {
    await this.prismaService.user.update({
      where: { id },
      select: { id: true },
      data: { session: { update: { password: hashSync(body.password, 10) } } },
    });

    return true;
  }

  public async deleteUser(id: number) {
    await this.prismaService.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        session: {
          update: {
            statusId: SessionStatus.DESHABILITADO,
          },
        },
      },
    });

    return true;
  }
}
