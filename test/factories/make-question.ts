import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question';
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
  return Question.create(
    {
      authorId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}): Promise<Question> {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
