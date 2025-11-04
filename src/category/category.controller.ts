// Category.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './Dto/CreateCategory.dto';

@Controller('Category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.CategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CategoryService.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.CategoryService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.CategoryService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CategoryService.remove(+id);
  }
}