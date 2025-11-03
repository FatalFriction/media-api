// contents.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ContentsService } from './content.service';

@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Get()
  findAll() {
    return this.contentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentsService.findOne(+id);
  }

  @Post()
  create(@Body() data: { title: string; slug: string; body: string; userId: number; categoryId?: number }) {
    return this.contentsService.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<{ title: string; slug: string; body: string; userId: number; categoryId?: number }>) {
    return this.contentsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentsService.remove(+id);
  }
}