import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

import { IsNotBlank, IsPassword } from '@common/decorators';

import { UserRole } from '@common/enums';
import { BaseDto } from '@common/dto';

import { UserDocumentType } from '../enums/user-document-type.enum';

export class CreateUserDto extends BaseDto {
  /**
   * The first name of the user
   */
  @IsNotBlank()
  readonly firstName: string;

  /**
   * The last name of the user
   */
  @IsNotBlank()
  readonly lastName: string;

  /**
   * The password of the user
   */
  @IsPassword()
  password: string;

  /**
   * The email of the user
   */
  @IsEmail()
  readonly email: string;

  /**
   * The phone of the user
   */
  @IsNotBlank()
  readonly phone: string;

  /**
   * The document number of the user
   */
  @IsNotBlank()
  readonly document: string;

  /**
   * The document type of the user
   */
  @IsNotEmpty()
  @IsEnum(UserDocumentType)
  readonly documentType: UserDocumentType;

  /**
   * The role of the user
   */
  @IsArray()
  @IsNotEmpty()
  @ArrayUnique()
  @IsEnum(UserRole, { each: true })
  readonly roles: UserRole[];
}
