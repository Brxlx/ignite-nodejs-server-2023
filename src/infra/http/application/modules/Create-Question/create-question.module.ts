import { Module } from '@nestjs/common';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { DatabaseModule } from '@/infra/database/database.module';

import { CreateQuestionController } from './create-question.controller';
import { NestCreateQuestionUseCase } from './nest-create-question-use-case.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateQuestionController],
  providers: [{ provide: CreateQuestionUseCase, useClass: NestCreateQuestionUseCase }],
})
export class CreateQuestionModule {}
