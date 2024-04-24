import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.');
  }
  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
