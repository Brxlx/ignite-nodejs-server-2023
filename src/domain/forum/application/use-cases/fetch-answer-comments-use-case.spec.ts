import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments-use-case';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
// system under test
let sut: FetchAnswerCommentsUseCase;

describe('Fetch answer comments from answer', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });
  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    inMemoryStudentsRepository.items.set(student.id, student);

    const answer1 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    });

    await inMemoryAnswerCommentsRepository.create(answer1);
    const answer2 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    });

    await inMemoryAnswerCommentsRepository.create(answer2);
    const answer3 = makeAnswerComment({
      authorId: student.id,
      answerId: new UniqueEntityID('answer-1'),
    });

    await inMemoryAnswerCommentsRepository.create(answer3);

    const result = await sut.execute({ answerId: 'answer-1', page: 1 });

    expect(result.value?.comments).toHaveLength(3);
  });

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    inMemoryStudentsRepository.items.set(student.id, student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          authorId: student.id,
          answerId: new UniqueEntityID('answer-1'),
        })
      );
    }

    const result = await sut.execute({ answerId: 'answer-1', page: 2 });

    expect(result.value?.comments).toHaveLength(2);
  });
});
