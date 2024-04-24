import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Question | null> {
    throw new Error('Method not implemented.');
  }
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.');
  }
  findMostRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }
  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
}