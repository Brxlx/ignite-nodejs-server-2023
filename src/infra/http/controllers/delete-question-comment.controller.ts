import { BadRequestException, Controller, Delete, HttpCode, Param } from '@nestjs/common';

import { DeleteQuestionOnCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment-use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private readonly deleteQuestionComment: DeleteQuestionOnCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') questionCommentId: string) {
    const userId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      authorId: userId,
      questionCommentId,
    });

    if (result.isLeft()) throw new BadRequestException();
  }
}
