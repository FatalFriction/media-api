// contents.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContentsService } from './content.service';
import { CreateContentDto } from './Dto/CreateContent.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ContentEntity } from '../content/Entities/Content.entities';

@Controller('contents')
@ApiTags('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  @ApiOkResponse({type: ContentEntity})
  findAll() {
    return this.contentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: ContentEntity})
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(+id);
  }

  @Post()
  @ApiCreatedResponse({ type: ContentEntity })
  create(@Body() dto: CreateContentDto) {
    return this.contentsService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({type: ContentEntity})
  update(@Param('id') id: string, @Body() data: Partial<{ title: string; slug: string; body: string; userId: number; categoryId?: number }>) {
    return this.contentsService.update(+id, data);
  }

  @Delete(':id')
  @ApiOkResponse({type: ContentEntity})
  remove(@Param('id') id: string) {
    return this.contentsService.remove(+id);
  }
}