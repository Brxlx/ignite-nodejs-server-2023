import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionSchema
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
