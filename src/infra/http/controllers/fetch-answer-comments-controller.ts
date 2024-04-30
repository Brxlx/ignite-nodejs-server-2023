import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments-use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

import { CommentPresenter } from '../presenters/comment.presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private readonly fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema = 1,
    @Param('answerId') answerId: string
  ) {
    const result = await this.fetchAnswerCommentsUseCase.execute({ page, answerId });

    if (result.isLeft()) throw new BadRequestException();

    return { comments: result.value.answerComments.map(CommentPresenter.toHTTP) };
  }
}
