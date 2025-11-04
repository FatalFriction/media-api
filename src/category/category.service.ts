import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()

export class CategoryService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.category.findMany({orderBy: { id: "asc" }}); }
  findOne(id: number) { return this.prisma.category.findUnique({ where: { id } }); }
  create(data: any) { return this.prisma.category.create({ data }); }
  update(id: number, data: any) { return this.prisma.category.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.category.delete({ where: { id } }); }
}