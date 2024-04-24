import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions-use-case';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

import { QuestionPresenter } from '../presenters/question.presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly fetchRecentQuestionsUseCase: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema = 1) {
    const result = await this.fetchRecentQuestionsUseCase.execute({ page });
    if (result.isLeft()) throw new Error();

    return { questions: result.value.questions.map(QuestionPresenter.toHTTP) };
  }
}
