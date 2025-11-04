// Category.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './Dto/CreateCategory.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CategoryEntity } from '../category/Entities/Category.entities';

@Controller('Category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({type: CategoryEntity})
  findAll() {
    return this.CategoryService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({type: CategoryEntity})
  findOne(@Param('id') id: string) {
    return this.CategoryService.findOne(+id);
  }

  @Post()
  @ApiCreatedResponse({ type: CategoryEntity })
  create(@Body() dto: CreateCategoryDto) {
    return this.CategoryService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({type: CategoryEntity})
  update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.CategoryService.update(+id, data);
  }

  @Delete(':id')
  @ApiOkResponse({type: CategoryEntity})
  remove(@Param('id') id: string) {
    return this.CategoryService.remove(+id);
  }
}