import { Injectable, PipeTransform } from '@nestjs/common';

import { FilterUsersDto } from '../dto';

@Injectable()
export class FilterUserPipe implements PipeTransform {
  transform(value: FilterUsersDto): FilterUsersDto {
    if (value.role) value.data.roles = { $in: [value.role] };

    return value;
  }
}
