import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AllRoles, Roles } from '@common/decorators';

import { Status } from '@common/enums';

import { AddCreatedByPipe } from '@common/pipes';

import { CreateUserDto, FilterUsersDto, UpdateUserDto } from './dto';

import { OwnUserGuard } from './guards/own-user.guard';

import { FilterUserPipe } from './pipes';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN')
  async create(
    @Body(AddCreatedByPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  async findAll(@Query(FilterUserPipe) params: FilterUsersDto) {
    return this.usersService.findPaginate(params);
  }

  @Get(':id')
  @AllRoles()
  @UseGuards(OwnUserGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @AllRoles()
  @UseGuards(OwnUserGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userUpdated = await this.usersService.update(id, updateUserDto);

    return userUpdated;
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.update(id, { status: Status.DELETED });
  }
}
