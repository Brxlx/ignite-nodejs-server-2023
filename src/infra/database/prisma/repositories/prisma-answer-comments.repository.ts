import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<AnswerComment | null> {
    throw new Error('Method not implemented.');
  }
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
    throw new Error('Method not implemented.');
  }
  create(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
