import { forwardRef, Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaService } from '../database/prisma.service';
import { ContentsModule } from 'src/content/content.module';

@Module({
  imports: [forwardRef(() => ContentsModule)],
  controllers: [MediaController],
  providers: [MediaService, PrismaService],
  exports: [MediaService],
})
export class MediaModule {}