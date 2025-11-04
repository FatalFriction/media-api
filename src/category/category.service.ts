// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from '../category/Dto/CreateCategory.dto';
import { UpdateCategoryDto } from '../category/Dto/UpdateCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: { contents: true },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { contents: true },
    });
    if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
      include: { contents: true },
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: { contents: true },
    });
  }

  async remove(id: number) {
    await this.prisma.category.delete({ where: { id } });
    return { message: `Category with ID ${id} deleted` };
  }
}