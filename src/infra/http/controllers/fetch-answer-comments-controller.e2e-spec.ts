import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AnswerFactory } from 'test/factories/make-answer';
import { AnswerCommentFactory } from 'test/factories/make-answer-comment';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';

import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Fetch answer comments (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory, AnswerCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);

    await app.init();
  });

  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const { id: questionId } = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: 'Question 01',
      slug: Slug.create('question-01'),
    });

    const { id: answerId } = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId,
      content: 'Nova resposta',
    });

    await Promise.all([
      answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId,
        content: 'Comment 01',
      }),
      answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId,
        content: 'Comment 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({ authorName: user.name, content: 'Comment 01' }),
        expect.objectContaining({ authorName: user.name, content: 'Comment 02' }),
      ]),
    });
  });
});
