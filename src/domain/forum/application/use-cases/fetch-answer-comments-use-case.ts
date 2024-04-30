import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/types/either';

import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  public async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page,
    });

    return right({ answerComments });
  }
}
