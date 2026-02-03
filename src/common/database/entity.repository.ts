import {
  AggregateOptions,
  QueryFilter,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  Document,
} from 'mongoose';

import { FilterDto } from '../dto';

export abstract class EntityRepository<T extends Document> {
  protected readonly readOptions: QueryOptions<T> = {
    readPreference: 'secondaryPreferred',
  };

  constructor(protected readonly entityModel: PaginateModel<T>) {}

  async findOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel
      .findOne(filter, projection, { ...this.readOptions, ...options })
      .exec();
  }

  async findOneById(
    id: string,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return await this.entityModel
      .findById(id, projection, { ...this.readOptions, ...options })
      .exec();
  }

  async find(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<T[]> {
    return await this.entityModel
      .find(filter, projection, { ...this.readOptions, ...options })
      .exec();
  }

  async findPaginate(
    filter: FilterDto<T>,
    options?: PaginateOptions,
  ): Promise<PaginateResult<T>> {
    const { data, limit, page } = filter;
    return await this.entityModel.paginate(data, {
      limit,
      page,
      ...options,
      options: { ...this.readOptions },
    });
  }

  async create(createDto: Partial<T>): Promise<T> {
    return await this.entityModel.create(createDto);
  }

  async findOneAndUpdate(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return await this.entityModel
      .findOneAndUpdate(filter, update, options)
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions<T> = { new: true },
  ): Promise<T | null> {
    return await this.entityModel.findByIdAndUpdate(id, update, options).exec();
  }

  async findOneAndDelete(filter: QueryFilter<T>): Promise<T | null> {
    return await this.entityModel.findOneAndDelete(filter).exec();
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    return await this.entityModel.findByIdAndDelete(id).exec();
  }

  async deleteMany(filter: QueryFilter<T>): Promise<boolean> {
    const result = await this.entityModel.deleteMany(filter);
    return result.deletedCount >= 1;
  }

  async aggregate<R>(
    pipeline: PipelineStage[],
    options?: AggregateOptions,
  ): Promise<R[]> {
    return await this.entityModel
      .aggregate<R>(pipeline, {
        ...options,
        readPreference: 'secondaryPreferred',
      })
      .exec();
  }

  async count(filter: QueryFilter<T>): Promise<number> {
    return this.entityModel.countDocuments(filter);
  }
}
