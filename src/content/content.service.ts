import { PrismaService } from "../database/prisma.service";
import { Injectable } from '@nestjs/common';
import { ContentEntity } from "./Entities/Content.entities";
import { UserEntity } from "src/users/Entities/Users.entities";
import { CategoryEntity } from "src/category/Entities/Category.entities";
import { MediaEntity } from "src/media/Entities/Media.entities";

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
  const contents = await this.prisma.content.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, role: true, createdAt: true } },
      category: true,
      media: true,
    },
  });

  return contents.map(c => new ContentEntity({
    ...c,
    user: new UserEntity(c.user),
    category: c.category ? new CategoryEntity(c.category) : null,
    media: c.media.map(m => new MediaEntity(m)),
  }));
  }

  create(data: { title: string; slug: string; body: string; userId: number; categoryId?: number }) {
    return this.prisma.content.create({ data });
  }
  findOne(id: number) { return this.prisma.content.findUnique({where: { id }});}
  update(id: number, data: any) { return this.prisma.content.update({ where: { id }, data }); }
  remove(id: number) { return this.prisma.content.delete({ where: { id } }); }
}