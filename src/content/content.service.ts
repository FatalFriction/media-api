import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.content.findMany({ orderBy: { id: "asc" } ,include: { user: true, media: true, category: true } }); }
  create(data: { title: string; slug: string; body: string; userId: number; categoryId?: number }) {
    return this.prisma.content.create({ data });
  }
  findOne(id: number) { return this.prisma.content.findUnique({where: { id }});}
  update(id: number, data: any) { return this.prisma.content.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.content.delete({ where: { id } }); }
}