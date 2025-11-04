import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({ example: 'image' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  contentId?: number;
}