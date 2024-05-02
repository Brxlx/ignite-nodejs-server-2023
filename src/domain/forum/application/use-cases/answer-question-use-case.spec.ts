import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { AnswerQuestionUseCase } from './answer-question-use-case';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
// system under test
let sut: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      attachmentsIds: ['1', '2'],
      content: 'Nova Resposta',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value?.answer.id).toBeInstanceOf(UniqueEntityID);
    expect(Array.from(inMemoryAnswersRepository.items.values())[0].id).toEqual(
      result.value?.answer.id
    );
    expect(
      Array.from(inMemoryAnswersRepository.items.values())[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      Array.from(inMemoryAnswersRepository.items.values())[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);
  });

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      authorId: '1',
      questionId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    });
    expect(result.isRight()).toBeTruthy();
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
    expect(Array.from(inMemoryAnswerAttachmentsRepository.items.values())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('2'),
        }),
      ])
    );
  });
});
