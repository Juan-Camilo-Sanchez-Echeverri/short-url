import { PartialType } from '@nestjs/mapped-types';

import { IsEnum, IsOptional } from 'class-validator';

import { Status } from '@common/enums';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * The status of the user
   */
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
