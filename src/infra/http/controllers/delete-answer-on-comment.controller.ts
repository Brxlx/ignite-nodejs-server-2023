import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';

import { DeleteAnswerOnCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/answers/comments/:id')
export class DeleteAnswerOnCommentController {
  constructor(private readonly deleteAnswerOnComment: DeleteAnswerOnCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') answerCommentId: string) {
    const userId = user.sub;

    const result = await this.deleteAnswerOnComment.execute({
      authorId: userId,
      answerCommentId,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
