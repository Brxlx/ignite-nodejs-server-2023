import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';
import { waitFor } from 'test/utils/wait-for';

import { DomainEvents } from '@/core/events/domain-events';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('On question best answer chosen (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when question best asnswer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const { id: questionId } = await questionFactory.makePrismaQuestion({ authorId: user.id });

    const { id: answerId } = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId,
    });

    await request(app.getHttpServer())
      .patch(`/answers/${answerId.toString()}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDB = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDB).not.toBeNull();
    });
  });
});
