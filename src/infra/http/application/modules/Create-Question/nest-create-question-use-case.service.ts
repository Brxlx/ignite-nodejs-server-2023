import { Injectable } from '@nestjs/common';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';

@Injectable()
export class NestCreateQuestionUseCase extends CreateQuestionUseCase {
  constructor(questionsRepository: QuestionsRepository) {
    super(questionsRepository);
  }
}
