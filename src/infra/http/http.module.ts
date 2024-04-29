import { Module } from '@nestjs/common';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student-use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question-use-case';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug-use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student-use-case';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { AnswerQuestionController } from './controllers/answer-question.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
    DeleteQuestionController,
    AnswerQuestionController,
    EditAnswerController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    {
      // Another way to inject useCases dependencies with free bonding out of framework solutuion(@Injectable())
      provide: CreateQuestionUseCase,
      useFactory: (questionsRepository: QuestionsRepository) => {
        return new CreateQuestionUseCase(questionsRepository);
      },
      inject: [QuestionsRepository],
    },
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
    EditAnswerUseCase,
  ],
  exports: [],
})
export class HttpModule {}
