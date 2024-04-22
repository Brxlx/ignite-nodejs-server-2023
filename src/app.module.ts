import { Module } from '@nestjs/common';

import { CreateAccountController } from './controllers/create-account.controller';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EnvModule],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
