// contents.module.ts
import { Module } from '@nestjs/common';
import { ContentsController } from './content.controller';
import { ContentsService } from './content.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ContentsController],
  providers: [ContentsService, PrismaService],
  exports: [ContentsService],
})
export class ContentsModule {}