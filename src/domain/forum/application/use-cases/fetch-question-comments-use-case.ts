import { Either, right } from '@/core/types/either';

import { QuestionComment } from '../../enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';

interface FetchQuestionCommentsRequest {
  questionId: string;
  page: number;
}

type FetchQuestionCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  public async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      {
        page,
      }
    );

    return right({ questionComments });
  }
}
