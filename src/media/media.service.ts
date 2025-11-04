import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.media.findMany({orderBy: { id: "asc" }}); }
  create(data: { url: string; type: string; contentId?: number }) {
    return this.prisma.media.create({ data });
  }
  findOne(id: number) { return this.prisma.media.findUnique({ where: { id } }); }
  update(id: number, data: any) { return this.prisma.media.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.media.delete({ where: { id } }); }
}