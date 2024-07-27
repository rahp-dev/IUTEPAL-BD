import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from '@user/dtos/create/create-user.dto';
import { AllUsersQueryDto } from '@user/dtos/read/all-users.dto';
import { UpdateUserPasswordDto } from '@user/dtos/update/update-user-password';
import { UpdateUserDto } from '@user/dtos/update/update-user.dto';
import { UserService } from '@user/services/user.service';

@ApiBearerAuth()
@ApiTags('Usuarios')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getAllUsers(@Query() queryParams: AllUsersQueryDto) {
    return this.userService.getAllUsers(queryParams);
  }

  @Get('metadata')
  public async getAllUsersMetaData() {
    return this.userService.getAllUsersMetaData();
  }

  @Get('roles')
  public async getRoles() {
    return this.userService.getRoles();
  }

  @Get('statuses')
  public async getStatuses() {
    return this.userService.getStatuses();
  }

  @Get('roles')
  public async getUserRoles() {
    return '';
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getOneUserOrThrowBadRequest(id);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, body);
  }

  @Patch(':id/password')
  public async updateUserPasswordById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPasswordById(id, body);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public async createuser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Delete(':id')
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
