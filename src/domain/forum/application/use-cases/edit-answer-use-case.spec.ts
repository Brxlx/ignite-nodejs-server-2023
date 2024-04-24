import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerAttachment } from 'test/factories/makeAnswerAttachment';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { EditAnswerUseCase } from './edit-answer-use-case';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
// system under test
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository);
  });
  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1')
    );
    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.set(
      new UniqueEntityID('attachment-1'),
      makeAnswerAttachment(
        {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('1'),
        },
        new UniqueEntityID('attachment-1')
      )
    );
    inMemoryAnswerAttachmentsRepository.items.set(
      new UniqueEntityID('attachment-2'),
      makeAnswerAttachment(
        {
          answerId: newAnswer.id,
          attachmentId: new UniqueEntityID('2'),
        },
        new UniqueEntityID('attachment-2')
      )
    );
    // Prefered way
    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      content: 'Novo conteúdo',
      answerId: newAnswer.id.toValue(),
      attachmentsIds: ['1', '3'],
    });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    expect(inMemoryAnswersRepository.items.get(newAnswer.id)).toMatchObject({
      content: 'Novo conteúdo',
    });
    expect(
      Array.from(inMemoryAnswersRepository.items.values())[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      Array.from(inMemoryAnswersRepository.items.values())[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ]);
  });

  it('should not be able to edit a answer from another author', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1')
    );
    await inMemoryAnswersRepository.create(newAnswer);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', answerId: 'answer-1' });
    // const a = await sut.execute({ answerId: 'answer-1' });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    const result = await sut.execute({
      authorId: 'author-2',
      content: 'Novo conteúdo',
      answerId: newAnswer.id.toValue(),
      attachmentsIds: ['1', '3'],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to edit an invalid answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1')
    );
    await inMemoryAnswersRepository.create(newAnswer);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', answerId: 'answer-1' });
    // const a = await sut.execute({ answerId: 'answer-1' });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    const result = await sut.execute({
      authorId: newAnswer.authorId.toString(),
      content: 'Novo conteúdo',
      answerId: 'answer-2',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
