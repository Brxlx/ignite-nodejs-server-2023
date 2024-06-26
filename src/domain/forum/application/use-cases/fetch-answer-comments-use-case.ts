import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/types/either';

import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface FetchAnswerCommentsRequest {
  answerId: string;
  page: number;
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  public async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
      page,
    });

    return right({ comments });
  }
}
