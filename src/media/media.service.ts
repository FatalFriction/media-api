import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMediaDto } from '../media/Dto/CreateMedia.dto';
import { UpdateMediaDto } from '../media/Dto/UpdateMedia.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { id: 'asc' },
      include: { content: true },
    });
  }

  async findOne(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: { content: true },
    });
    if (!media) throw new NotFoundException(`Media with ID ${id} not found`);
    return media;
  }

  async create(dto: CreateMediaDto) {
    return this.prisma.media.create({
      data: dto,
      include: { content: true },
    });
  }

  async update(id: number, dto: UpdateMediaDto) {
    return this.prisma.media.update({
      where: { id },
      data: dto,
      include: { content: true },
    });
  }

  async remove(id: number) {
    await this.prisma.media.delete({ where: { id } });
    return { message: `Media with ID ${id} deleted` };
  }
}