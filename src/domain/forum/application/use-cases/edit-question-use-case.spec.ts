import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { EditQuestionUseCase } from './edit-question-use-case';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
// system under test
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository
    );
  });
  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    );
    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('attachment-1')
      )
    );
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('2'),
        },
        new UniqueEntityID('attachment-2')
      )
    );

    // Prefered way
    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: newQuestion.authorId.toString(),
      title: 'Pergunta teste',
      content: 'Novo conteúdo',
      attachmentsIds: ['1', '3'],
    });
    // Alternative way
    // const { question } = await sut.execute({ slug: 'example-question' });
    expect(inMemoryQuestionsRepository.items.get(newQuestion.id)).toMatchObject({
      title: 'Pergunta teste',
      content: 'Novo conteúdo',
    });
    expect(
      Array.from(inMemoryQuestionsRepository.items.values())[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      Array.from(inMemoryQuestionsRepository.items.values())[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a question from another author', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', questionId: 'question-1' });
    // const a = await sut.execute({ questionId: 'question-1' });
    // Alternative way
    // const { question } = await sut.execute({ slug: 'example-question' });
    const result = await sut.execute({
      authorId: 'author-2',
      title: 'Pergunta teste',
      content: 'Novo conteúdo',
      questionId: newQuestion.id.toValue(),
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an invalid question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    );
    await inMemoryQuestionsRepository.create(newQuestion);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', questionId: 'question-1' });
    // const a = await sut.execute({ questionId: 'question-1' });
    // Alternative way
    // const { question } = await sut.execute({ slug: 'example-question' });
    const result = await sut.execute({
      authorId: newQuestion.authorId.toString(),
      title: 'Pergunta teste',
      content: 'Novo conteúdo',
      questionId: 'question-2',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1')
    );
    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('attachment-1')
      )
    );
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment(
        {
          questionId: newQuestion.id,
          attachmentId: new UniqueEntityID('2'),
        },
        new UniqueEntityID('attachment-2')
      )
    );

    // Prefered way
    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: newQuestion.authorId.toString(),
      title: 'Pergunta teste',
      content: 'Novo conteúdo',
      attachmentsIds: ['1', '3'],
    });
    // Alternative way
    // const { question } = await sut.execute({ slug: 'example-question' });
    expect(result.isRight()).toBeTruthy();
    // expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(Array.from(inMemoryQuestionAttachmentsRepository.items.values())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('3'),
        }),
      ])
    );
  });
});
