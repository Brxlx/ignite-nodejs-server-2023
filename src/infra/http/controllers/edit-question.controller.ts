import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const editQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

export type EditQuestionSchema = z.infer<typeof editQuestionSchema>;

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
    @Body(new ZodValidationPipe(editQuestionSchema)) body: EditQuestionSchema
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      questionId,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
