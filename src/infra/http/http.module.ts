import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student-use-case';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug-use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student-use-case';

import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionModule } from './application/modules/Create-Question/create-question.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAccountController } from './controllers/create-account.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, CreateQuestionModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    // {
    //   // Another way to inject useCases dependencies with free bonding out of framework solutuion(@Injectable())
    //   provide: CreateQuestionUseCase,
    //   useFactory: (questionsRepository: QuestionsRepository) => {
    //     return new CreateQuestionUseCase(questionsRepository);
    //   },
    //   inject: [QuestionsRepository],
    // },
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
  exports: [],
})
export class HttpModule {}
