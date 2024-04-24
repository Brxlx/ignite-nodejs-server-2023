import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/types/either';

import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface FetchRecentQuestionsRequest {
  page: number;
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  public async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.findMostRecent({ page });

    return right({ questions });
  }
}
