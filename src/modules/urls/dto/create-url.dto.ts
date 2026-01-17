import { IsNotBlank } from '@common/decorators';

export class CreateUrlDto {
  @IsNotBlank()
  url: string;
}
