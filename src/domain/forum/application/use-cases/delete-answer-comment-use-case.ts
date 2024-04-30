import { Injectable } from '@nestjs/common';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';

interface DeleteAnswerOnCommentRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerOnCommentResponse = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class DeleteAnswerOnCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  public async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerOnCommentRequest): Promise<DeleteAnswerOnCommentResponse> {
    const answerComment = await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) return left(new ResourceNotFoundError());

    if (answerComment.authorId.toString() !== authorId) return left(new NotAllowedError());

    await this.answerCommentsRepository.delete(answerComment);

    return right(null);
  }
}
