import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/Entities/Users.entities';
import { CategoryEntity } from '../../category/Entities/Category.entities';
import { MediaEntity } from '../../media/Entities/Media.entities';

export class ContentEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My First Post' })
  title: string;

  @ApiProperty({ example: 'my-first-post' })
  slug: string;

  @ApiProperty({ example: 'Full article body...' })
  body: string;

  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ApiProperty({ type: () => CategoryEntity, nullable: true })
  category: CategoryEntity | null;

  @ApiProperty({ type: [MediaEntity] })
  media: MediaEntity[];

  @ApiProperty({ example: '2025-11-03T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-11-04T12:00:00Z' })
  updatedAt: Date;

  constructor(partial: Partial<ContentEntity>) {
    Object.assign(this, partial);
  }
}