import { PartialType } from '@nestjs/mapped-types';
import { UploadMediaDto } from './UploadMedia.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaDto extends PartialType(UploadMediaDto) {
  @ApiProperty({
    description: 'URL baru (jika ingin ganti)',
    example: '/uploads/new-foto.jpg',
    required: false,
  })
  url?: string;
}