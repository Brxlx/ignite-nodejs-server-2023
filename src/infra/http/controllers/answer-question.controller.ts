import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common';
import { z } from 'zod';

import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const answerQuestionSchema = z.object({
  content: z.string(),
});

export type AnswerQuestionSchema = z.infer<typeof answerQuestionSchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(answerQuestionSchema)) body: AnswerQuestionSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      content,
      authorId: userId,
      questionId,
      attachmentsIds: [],
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
