import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { Question } from '../../enterprise/entities/question';
import { AnswersRepository } from '../repositories/answers-repository';
import { QuestionsRepository } from '../repositories/questions-repository';

interface BestAnswerQuestionRequest {
  answerId: string;
  authorId: string;
}
type BestAnswerQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class BestAnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
  ) {}

  public async execute({
    answerId,
    authorId,
  }: BestAnswerQuestionRequest): Promise<BestAnswerQuestionResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) return left(new ResourceNotFoundError());

    const question = await this.questionsRepository.findById(answer.questionId.toString());

    if (!question) return left(new ResourceNotFoundError());

    if (authorId !== question.authorId.toString()) return left(new NotAllowedError());

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}