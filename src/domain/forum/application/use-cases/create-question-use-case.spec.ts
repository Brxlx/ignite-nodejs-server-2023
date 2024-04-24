import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { CreateQuestionUseCase } from './create-question-use-case';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
// system under test
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteúdo da pergunta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBeTruthy();
    expect(Array.from(inMemoryQuestionsRepository.items.values())[0]).toEqual(
      result.value?.question
    );
    expect(
      Array.from(inMemoryQuestionsRepository.items.values())[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      Array.from(inMemoryQuestionsRepository.items.values())[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ]);

    // inMemoryQuestionsRepository.items.delete(question.id);
  });
});