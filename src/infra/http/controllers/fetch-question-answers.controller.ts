import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers-use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

import { AnswerPresenter } from '../presenters/answer.presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;
// TODO: refactor to bring authorId

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private readonly fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema = 1,
    @Param('questionId') questionId: string
  ) {
    const result = await this.fetchQuestionAnswersUseCase.execute({ page, questionId });

    if (result.isLeft()) throw new BadRequestException();

    return { answers: result.value.answers.map(AnswerPresenter.toHTTP) };
  }
}
