import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const { type, data } = metadata;

    if (data !== 'id') return value;

    if (type === 'param') {
      if (!isValidObjectId(value)) {
        throw new BadRequestException(`${value} is not a parameter valid`);
      }
      return value;
    }

    return value;
  }
}
