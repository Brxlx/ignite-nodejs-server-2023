import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EnvModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
