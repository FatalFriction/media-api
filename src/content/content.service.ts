import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MediaService } from '../media/media.service'; // ⬅️ Import your MediaService
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
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => MediaService)) // ⬅️ Prevent circular dependency issues
    private readonly mediaService: MediaService,
  ) {}

  // 🧩 PAGINATED FETCH
  async findAll({
    currentPage = 1,
    pageSize = 10,
  }: PaginationQueryDto): Promise<PaginationResult<ContentEntity>> {
    const skip = (currentPage - 1) * pageSize;

    const [contents, total] = await Promise.all([
      this.prisma.content.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'asc' },
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
      meta: getPaginationMeta(total, currentPage, pageSize),
    };
  }

  // 🧩 CREATE CONTENT
  async create(data: {
    title: string;
    slug: string;
    body: string;
    userId: number;
    categoryId?: number;
  }) {
    return this.prisma.content.create({ data });
  }

  // 🧩 FIND ONE
  async findOne(id: number) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return content;
  }

  // 🧩 UPDATE CONTENT
  async update(id: number, data: any) {
    const content = await this.prisma.content.findUnique({ where: { id } });
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    return this.prisma.content.update({ where: { id }, data });
  }

  // 🧩 DELETE CONTENT + RELATED MEDIA IN R2
  async remove(id: number) {
    const content = await this.prisma.content.findUnique({
      where: { id },
      include: { media: true },
    });

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }

    // Delete all associated media files from R2 + DB
    for (const media of content.media) {
      try {
        await this.mediaService.remove(media.id);
      } catch (error) {
        console.warn(`Failed to delete media ${media.id} from R2`, error);
      }
    }

    await this.prisma.content.delete({ where: { id } });

    return {
      message: `Content ${id} and ${content.media.length} related media deleted successfully`,
    };
  }
}
