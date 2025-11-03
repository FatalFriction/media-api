// media.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Post()
  create(@Body() data: { url: string; type: string; contentId?: number }) {
    return this.mediaService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<{ url: string; type: string; contentId?: number }>) {
    return this.mediaService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}