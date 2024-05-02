import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { StudentFactory } from 'test/factories/make-student';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Edit question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let questionFactory: QuestionFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory, QuestionFactory, QuestionAttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

    await app.init();
  });

  test('[PUT] /questions/:id', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment({});
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const { id: questionId } = await questionFactory.makePrismaQuestion({ authorId: user.id });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Nova pergunta',
        content: 'lorem ipsum sei la o que mais e tal.',
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const questionOnDB = await prisma.question.findFirst({ where: { title: 'Nova pergunta' } });

    expect(questionOnDB).toBeTruthy();
    expect(questionOnDB?.authorId).toEqual(user.id.toString());

    const attachmentsOnBD = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDB?.id,
      },
    });

    expect(attachmentsOnBD).toHaveLength(2);
    expect(attachmentsOnBD).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ])
    );
  });
});
