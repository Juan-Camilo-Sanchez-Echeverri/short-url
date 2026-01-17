import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUrlDto, FilterUrlsDto, UpdateUrlDto } from './dto';

import { UrlsService } from './urls.service';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    const newUrl = await this.urlsService.create(createUrlDto);

    return { id: newUrl.shortId };
  }

  @Get()
  async findAll(@Query() params: FilterUrlsDto) {
    return await this.urlsService.findPaginate(params);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.urlsService.findOneById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    return await this.urlsService.update(id, updateUrlDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.urlsService.remove(id);
  }
}
