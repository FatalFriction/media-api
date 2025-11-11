import { forwardRef, Module } from '@nestjs/common';
import { ContentsController } from './content.controller';
import { ContentsService } from './content.service';
import { PrismaService } from '../database/prisma.service';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [forwardRef(() => MediaModule)],
  controllers: [ContentsController],
  providers: [ContentsService, PrismaService],
  exports: [ContentsService],
})
export class ContentsModule {}