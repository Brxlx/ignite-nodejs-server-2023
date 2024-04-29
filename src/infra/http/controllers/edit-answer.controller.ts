import { BadRequestException, Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const editAnswerSchema = z.object({
  content: z.string(),
});

export type EditAnswerSchema = z.infer<typeof editAnswerSchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerId: string,
    @Body(new ZodValidationPipe(editAnswerSchema)) body: EditAnswerSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      answerId,
      attachmentsIds: [],
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
