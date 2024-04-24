import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { BestAnswerQuestionUseCase } from './best-answer-use-case';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

// system under test
let sut: BestAnswerQuestionUseCase;

describe('Choose question best answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository);
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    );

    sut = new BestAnswerQuestionUseCase(inMemoryAnswersRepository, inMemoryQuestionsRepository);
  });
  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion({});
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswersRepository.create(newAnswer);

    // Prefered way
    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    expect(inMemoryQuestionsRepository.items.get(newQuestion.id)?.bestAnswerId).toEqual(
      newAnswer.id
    );
  });

  it('should not be able to another user question best answer', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });

    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswersRepository.create(newAnswer);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', answerId: 'answer-1' });
    // const a = await sut.execute({ answerId: 'answer-1' });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    const result = await sut.execute({ authorId: 'author-2', answerId: newAnswer.id.toString() });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to choose best answer from an invalid answer', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1'),
    });
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
        questionId: newQuestion.id,
      },
      new UniqueEntityID('answer-1')
    );

    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswersRepository.create(newAnswer);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', answerId: 'answer-1' });
    // const a = await sut.execute({ answerId: 'answer-1' });
    // Alternative way
    // const { answer } = await sut.execute({ slug: 'example-answer' });
    const result = await sut.execute({ authorId: 'author-1', answerId: 'answer-2' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
