import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { EnvModule } from './env/env.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [EnvModule, AuthModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
