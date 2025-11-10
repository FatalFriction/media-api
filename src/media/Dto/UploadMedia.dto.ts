import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadMediaDto {
  @ApiProperty({
    description: 'Tipe media: image / video',
    example: 'image',
    enum: ['image', 'video'],
  })
  @IsString({ message: 'Tipe harus berupa teks' })
  @IsNotEmpty({ message: 'Tipe wajib diisi' })
  type: string;

  @ApiProperty({
    description: 'ID konten yang terkait (opsional)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'contentId harus angka' })
  @Type(() => Number)
  contentId?: number;
}