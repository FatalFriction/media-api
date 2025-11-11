import { PrismaService } from '../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { ContentEntity } from './Entities/Content.entities';
import { UserEntity } from 'src/users/Entities/Users.entities';
import { CategoryEntity } from 'src/category/Entities/Category.entities';
import { MediaEntity } from 'src/media/Entities/Media.entities';
import { Content } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResult } from 'src/common/types/paginationResultType';
import { getPaginationMeta } from 'src/utils/pagination';

type SafeContent = Pick<
  Content,
  | 'id'
  | 'title'
  | 'body'
  | 'slug'
  | 'categoryId'
  | 'userId'
  | 'updatedAt'
  | 'createdAt'
>;

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationQueryDto): Promise<PaginationResult<ContentEntity>> {
    const skip = (page - 1) * limit;

    const [contents, total] = await Promise.all([
      this.prisma.content.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
          category: true,
          media: true,
        },
      }),
      this.prisma.content.count(),
    ]);

    const data = contents.map(
      (c) =>
        new ContentEntity({
          ...c,
          user: new UserEntity(c.user),
          category: c.category ? new CategoryEntity(c.category) : null,
          media: c.media.map((m) => new MediaEntity(m)),
        }),
    );

    return {
      data,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  create(data: {
    title: string;
    slug: string;
    body: string;
    userId: number;
    categoryId?: number;
  }) {
    return this.prisma.content.create({ data });
  }

  findOne(id: number) {
    return this.prisma.content.findUnique({ where: { id } });
  }
  update(id: number, data: any) {
    return this.prisma.content.update({ where: { id }, data });
  }
  remove(id: number) {
    return this.prisma.content.delete({ where: { id } });
  }
}
