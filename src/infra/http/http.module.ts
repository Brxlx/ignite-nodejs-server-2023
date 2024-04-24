import { Module } from '@nestjs/common';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';

import { DatabaseModule } from '../database/database.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    {
      // Another way to inject useCases dependencies with free bonding out of framework solutuion(@Injectable())
      provide: CreateQuestionUseCase,
      useFactory: (questionsRepository: QuestionsRepository) => {
        return new CreateQuestionUseCase(questionsRepository);
      },
      inject: [QuestionsRepository],
    },
  ],
  exports: [],
})
export class HttpModule {}
