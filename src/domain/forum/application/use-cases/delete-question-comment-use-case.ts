import { Injectable } from '@nestjs/common';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface DeleteQuestionOnCommentRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionOnCommentResponse = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteQuestionOnCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  public async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionOnCommentRequest): Promise<DeleteQuestionOnCommentResponse> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) return left(new ResourceNotFoundError());

    if (questionComment.authorId.toString() !== authorId) return left(new NotAllowedError());

    await this.questionCommentsRepository.delete(questionComment);

    return right(null);
  }
}
