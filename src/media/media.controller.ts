import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMediaDto } from 'src/media/Dto/UploadMedia.dto';
import { UpdateMediaDto } from 'src/media/Dto/UpdateMedia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { MediaEntity } from '../media/Entities/Media.entities';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('media')
@ApiTags('media')
@UseGuards(JwtAuthGuard)  // semua route butuh token
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // 1. LIHAT SEMUA MEDIA
  @Get()
  @ApiOkResponse({ type: [MediaEntity] })
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.mediaService.findAll(pagination);
  }

  // 2. LIHAT SATU MEDIA
  @Get(':id')
  @ApiOkResponse({ type: MediaEntity })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  // 3. UPLOAD FILE (INI YANG DIPAKAI!)
  @Post('upload')
  @ApiOperation({ summary: 'Upload gambar/video (hanya ini yang dipakai)' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: MediaEntity })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', example: 'image' },
        contentId: { type: 'number', nullable: true },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.upload(file, dto);
  }

  // 4. UPDATE MEDIA (url atau contentId)
  @Patch(':id')
@ApiOkResponse({ type: MediaEntity })
update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
  return this.mediaService.update(+id, dto);
}

  // 5. HAPUS MEDIA
  @Delete(':id')
  @ApiOkResponse({ type: MediaEntity })
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}