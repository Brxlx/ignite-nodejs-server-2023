import { Injectable } from '@nestjs/common';

import { Either, right } from '@/core/types/either';

import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionCommentsRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsResponse = Either<
  null,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  public async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const comments = await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
      questionId,
      {
        page,
      }
    );

    return right({ comments });
  }
}
