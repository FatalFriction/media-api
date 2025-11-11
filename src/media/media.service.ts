import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UploadMediaDto } from 'src/media/Dto/UploadMedia.dto';
import { UpdateMediaDto } from 'src/media/Dto/UpdateMedia.dto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Media } from '@prisma/client';
import { PaginationResult } from 'src/common/types/paginationResultType';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getPaginationMeta } from 'src/utils/pagination';

type SafeMedia = Pick<Media, 'id' | 'url' | 'type' | 'contentId' |'createdAt'>;

@Injectable()
export class MediaService implements OnModuleInit {
  private r2: S3Client;
  private readonly bucketName = process.env.R2_BUCKET_NAME || 'porto-bucket';
  private readonly publicUrl = process.env.R2_PUBLIC_URL; // contoh: https://pub-xxxxxx.r2.dev

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Inisialisasi R2 Client sekali saat app start
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY || !process.env.R2_SECRET_KEY) {
      throw new Error('R2 credentials tidak lengkap! Cek .env');
    }

    this.r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });
  }

  // 1. LIHAT SEMUA MEDIA
  async findAll({ currentPage = 1, pageSize = 10 }: PaginationQueryDto): Promise<PaginationResult<SafeMedia>> {
    const skip = (currentPage - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.media.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { content: true },
      }),
      this.prisma.media.count(),
    ]);

    return {
      data,
      meta: getPaginationMeta(total, currentPage, pageSize),
    };
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

  // 3. UPLOAD KE R2 + SIMPAN URL KE DB
  async upload(file: Express.Multer.File, dto: UploadMediaDto) {
    if (!file) {
      throw new InternalServerErrorException('File wajib diupload');
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const key = `media/${filename}`;

    try {
      // Upload ke R2
      await this.r2.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: 'public-read', // otomatis public kalau bucket public
        }),
      );
    } catch (error) {
      console.error('R2 Upload Error:', error);
      throw new InternalServerErrorException('Gagal upload ke Cloudflare R2');
    }

    const url = `${this.publicUrl}/${key}`;

    return this.prisma.media.create({
      data: {
        url,
        type: dto.type,
        contentId: dto.contentId ? Number(dto.contentId) : null,
      },
      include: { content: true },
    });
  }

  // 4. UPDATE MEDIA (hanya metadata)
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

  // 5. HAPUS DARI R2 + DB
  async remove(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media dengan ID ${id} tidak ditemukan`);
    }

    // Hapus dari R2
    if (media.url) {
      const key = media.url.replace(`${this.publicUrl}/`, '');
      try {
        await this.r2.send(
          new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }),
        );
      } catch (error) {
        console.warn(`Gagal hapus dari R2: ${key}`, error);
        // Tetap lanjut hapus dari DB
      }
    }

    await this.prisma.media.delete({ where: { id } });

    return {
      message: `Media dengan ID ${id} berhasil dihapus dari R2 & database`,
      deletedUrl: media.url,
    };
  }
}