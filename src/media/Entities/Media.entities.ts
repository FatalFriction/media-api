import { ApiProperty } from '@nestjs/swagger';
import { ContentEntity } from '../../content/Entities/Content.entities';

export class MediaEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'https://example.com/img.jpg' })
  url: string;

  @ApiProperty({ example: 'image' })
  type: string;

  @ApiProperty({ type: () => ContentEntity, nullable: true })
  content: ContentEntity | null;

  @ApiProperty({ example: '2025-11-03T10:00:00Z' })
  createdAt: Date;

  constructor(partial: Partial<MediaEntity>) {
    Object.assign(this, partial);
  }
}