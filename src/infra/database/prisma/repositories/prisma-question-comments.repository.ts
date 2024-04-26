import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = await this.prisma.comment.findUnique({ where: { id } });
    if (!questionComment) return null;

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }
  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    const questions = await this.prisma.comment.findMany({
      where: {
        id: questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return questions.map(PrismaQuestionCommentMapper.toDomain);
  }
  async create(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });
  }
  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toString(),
      },
    });
  }
}
