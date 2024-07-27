import { Module } from '@nestjs/common';

import { UserService } from '@user/services/user.service';
import { UserGetRepository } from '@user/repositories/user-get.repository';
import { UserController } from '@user/controllers/user.controller';
import { UserUpdateRepository } from '@user/repositories/user-update.repository';
import { UserCreateRepository } from '@user/repositories/user-create.repository';

@Module({
  providers: [
    UserService,
    UserGetRepository,
    UserUpdateRepository,
    UserCreateRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
