import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { PaginateModel } from 'mongoose';

import { EntityRepository } from '@common/database';

import { Url, UrlDocument } from '../schemas/url.schema';

@Injectable()
export class UrlsRepository extends EntityRepository<UrlDocument> {
  constructor(
    @InjectModel(Url.name)
    protected readonly urlModel: PaginateModel<UrlDocument>,
  ) {
    super(urlModel);
  }
}
