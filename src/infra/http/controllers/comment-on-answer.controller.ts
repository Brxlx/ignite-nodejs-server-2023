import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';

import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const commentOnAnswerSchema = z.object({
  content: z.string(),
});

export type CommentOnAnswerSchema = z.infer<typeof commentOnAnswerSchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
    @Body(new ZodValidationPipe(commentOnAnswerSchema)) body: CommentOnAnswerSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      authorId: userId,
      answerId,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
