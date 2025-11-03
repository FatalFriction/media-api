import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';
import { ContentsModule } from './content/content.module';
import { MediaController } from './media/media.controller';
import { CategoryModule } from './category/category.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [UsersModule, ContentsModule, MediaModule, CategoryModule, PrismaModule],
  controllers: [AppController, MediaController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
