import { Injectable } from '@nestjs/common';

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface GetQuestionBySlugRequest {
  slug: string;
}

type GetQuestionBySlugResponse = Either<ResourceNotFoundError, { question: Question }>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  public async execute({ slug }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) return left(new ResourceNotFoundError());

    return right({ question });
  }
}
