import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { AnswersRepository } from '../repositories/answers-repository';

interface DeleteAnswerRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerResponse = Either<ResourceNotFoundError | NotAllowedError, null>;

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({ authorId, answerId }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    if (authorId !== answer.authorId.toString()) return left(new NotAllowedError());

    await this.answersRepository.delete(answer);

    return right(null);
  }
}
