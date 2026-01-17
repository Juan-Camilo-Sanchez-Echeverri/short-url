import { UnprocessableEntityException } from '@nestjs/common';

import type { QueryFilter } from 'mongoose';

import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { PaginationDto } from './pagination.dto';

// ? el generico es el documento que se va a filtrar
export class FilterDto<T> extends PaginationDto {
  @IsOptional()
  @Transform(({ value }: { value: QueryFilter<T> }) => {
    for (const key in value) {
      if (value[key] === 'undefined' || value[key] === '') {
        throw new UnprocessableEntityException(
          `The value for filter parameter '${key}' is not valid.`,
        );
      }
    }
    return value;
  })
  data: QueryFilter<T> = {};
}
