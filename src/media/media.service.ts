// src/media/media.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UploadMediaDto } from 'src/media/Dto/UploadMedia.dto';
import { UpdateMediaDto } from 'src/media/Dto/UpdateMedia.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {
    // Buat folder uploads kalau belum ada
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  // 1. LIHAT SEMUA MEDIA
  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      include: { content: true },
    });
  }

  // 2. LIHAT SATU MEDIA
  async findOne(id: number) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: { content: true },
    });

    if (!media) {
      throw new NotFoundException(`Media dengan ID ${id} tidak ditemukan`);
    }

    return media;
  }

  // 3. UPLOAD FILE (INI YANG DIPAKAI!)
  async upload(file: Express.Multer.File, dto: UploadMediaDto) {
    if (!file) {
      throw new InternalServerErrorException('File wajib diupload');
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(this.uploadPath, filename);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Gagal menyimpan file ke server');
    }

    const url = `/uploads/${filename}`;

    return this.prisma.media.create({
      data: {
        url,
        type: dto.type,
        contentId: dto.contentId ? Number(dto.contentId) : null,
      },
      include: { content: true },
    });
  }

  // 4. UPDATE MEDIA
  async update(id: number, dto: UpdateMediaDto) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media dengan ID ${id} tidak ditemukan`);
    }

    return this.prisma.media.update({
      where: { id },
      data: dto,
      include: { content: true },
    });
  }

  // 5. HAPUS MEDIA DARI DISK
  async remove(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media dengan ID ${id} tidak ditemukan`);
    }

    // Hapus file dari folder uploads
    if (media.url) {
      const filePath = path.join(process.cwd(), media.url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.warn(`Gagal hapus file: ${filePath}`);
          // Tidak throw error, biar tetap bisa hapus dari DB
        }
      }
    }

    await this.prisma.media.delete({ where: { id } });

    return {
      message: `Media dengan ID ${id} berhasil dihapus`,
      deletedFile: media.url,
    };
  }
}