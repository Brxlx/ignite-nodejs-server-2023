import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

const createQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(createQuestionSchema)) body: CreateQuestionSchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: this.convertToSlug(title),
      },
    });

    return 'ok';
  }

  private convertToSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
      .replace(/\s+/g, '-');
  }
}
