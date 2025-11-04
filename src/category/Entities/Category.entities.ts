import { ApiProperty } from '@nestjs/swagger';
import { ContentEntity } from '../../content/Entities/Content.entities';

export class CategoryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Technology' })
  name: string;

  @ApiProperty({ type: [ContentEntity] })
  contents: ContentEntity[];

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}