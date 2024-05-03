import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments-use-case';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author.presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private readonly fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema = 1,
    @Param('questionId') questionId: string
  ) {
    const result = await this.fetchQuestionCommentsUseCase.execute({ page, questionId });

    if (result.isLeft()) throw new BadRequestException();

    return { comments: result.value.comments.map(CommentWithAuthorPresenter.toHTTP) };
  }
}
