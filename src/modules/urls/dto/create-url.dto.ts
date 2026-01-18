import { IsUrl } from 'class-validator';

import { IsNotBlank } from '@common/decorators';

export class CreateUrlDto {
  @IsNotBlank()
  @IsUrl()
  url: string;
}
