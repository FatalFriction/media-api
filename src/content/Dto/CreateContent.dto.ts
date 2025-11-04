import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  // Required: userId (from JWT or service)
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;
}