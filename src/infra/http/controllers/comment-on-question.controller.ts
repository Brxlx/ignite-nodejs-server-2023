import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const commentOnQuestionSchema = z.object({
  content: z.string(),
});

export type CommentOnQuestionSchema = z.infer<typeof commentOnQuestionSchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(commentOnQuestionSchema)) body: CommentOnQuestionSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      authorId: userId,
      questionId,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
