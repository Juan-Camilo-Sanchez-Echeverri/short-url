import { IsEnum, IsOptional } from 'class-validator';

import { UserRole } from '@common/enums';
import { FilterDto } from '@common/dto';

import { UserDocument } from '../schemas/user.schema';

export class FilterUsersDto extends FilterDto<UserDocument> {
  /**
   * The user role
   */
  @IsOptional()
  @IsEnum(UserRole)
  readonly role?: UserRole;
}
