import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './Dto/CreateMedia.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MediaEntity } from '../media/Entities/Media.entities';

@Controller('media')
@ApiTags('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOkResponse({type: MediaEntity})
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: MediaEntity})
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Post()
  @ApiCreatedResponse({type: MediaEntity})
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({type: MediaEntity})
  update(@Param('id') id: string, @Body() data: Partial<{ url: string; type: string; contentId?: number }>) {
    return this.mediaService.update(+id, data);
  }

  @Delete(':id')
  @ApiOkResponse({type: MediaEntity})
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}