import { Type, Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  currentPage: number = 1;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
