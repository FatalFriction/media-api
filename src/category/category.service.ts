import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from '../category/Dto/CreateCategory.dto';
import { UpdateCategoryDto } from '../category/Dto/UpdateCategory.dto';
import { Category } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/types/paginationResultType';
import { getPaginationMeta } from 'src/utils/pagination';

type SafeCategory = Pick<Category, 'id' | 'name' >;

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll({ page = 1, limit = 10 }: PaginationQueryDto): Promise<PaginationResult<SafeCategory>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
    this.prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: { contents: true },
    }),
      this.prisma.category.count(),
    ]);
    return {
      data,
      meta: getPaginationMeta(total, page, limit),
    };
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