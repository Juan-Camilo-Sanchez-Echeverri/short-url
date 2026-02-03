import { Injectable, NotFoundException } from '@nestjs/common';

import { ICrudService } from '@common/interfaces';

import { CreateUrlDto, UpdateUrlDto, FilterUrlsDto } from './dto';

import { generateShortId } from './helpers/generate-short-id.helper';

import { UrlsRepository } from './repositories/urls.repository';

import { UrlDocument } from './schemas/url.schema';

@Injectable()
export class UrlsService implements ICrudService<UrlDocument> {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async create(createUrlDto: CreateUrlDto): Promise<UrlDocument> {
    const shortId = generateShortId();

    return await this.urlsRepository.create({
      redirectUrl: createUrlDto.url,
      shortId,
    });
  }

  async findPaginate(filter: FilterUrlsDto) {
    return await this.urlsRepository.findPaginate(filter, {
      sort: { createdAt: -1 },
    });
  }

  async findOneById(id: string): Promise<UrlDocument> {
    const url = await this.urlsRepository.findOneById(id);

    if (!url) throw new NotFoundException();

    return url;
  }

  async update(id: string, updateUrlDto: UpdateUrlDto) {
    const updatedUrl = await this.urlsRepository.findByIdAndUpdate(
      id,
      updateUrlDto,
    );

    if (!updatedUrl) throw new NotFoundException();

    return updatedUrl;
  }

  async remove(id: string) {
    const deletedUrl = await this.urlsRepository.findByIdAndDelete(id);

    if (!deletedUrl) throw new NotFoundException();

    return deletedUrl;
  }

  async findOriginalUrl(shortId: string): Promise<UrlDocument> {
    const url = await this.urlsRepository.findOne({ shortId });

    if (!url) throw new NotFoundException('URL not found');

    return url;
  }

  async addVisitHistory(shortId: string): Promise<void> {
    await this.urlsRepository.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: { visitHistory: { timestamp: new Date() } },
      },
    );
  }

  async getAnalytics(shortId: string) {
    const url = await this.findOriginalUrl(shortId);

    return {
      totalClicks: url.visitHistory.length,
      analytics: url.visitHistory,
    };
  }
}
