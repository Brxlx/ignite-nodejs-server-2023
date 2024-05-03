import { makeQuestionComment } from 'test/factories/make-question-comment';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { FetchQuestionCommentsUseCase } from './fetch-question-comments-use-case';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
// system under test
let sut: FetchQuestionCommentsUseCase;

describe('Fetch question comments from question', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });
  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    inMemoryStudentsRepository.items.set(student.id, student);

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });
    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });
    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });

    await inMemoryQuestionCommentsRepository.create(comment1);
    await inMemoryQuestionCommentsRepository.create(comment2);
    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({ questionId: 'question-1', page: 1 });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: student.name,
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: student.name,
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: student.name,
          commentId: comment3.id,
        }),
      ])
    );
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });
    inMemoryStudentsRepository.items.set(student.id, student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityID('question-1'),
        })
      );
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 });

    expect(result.value?.comments).toHaveLength(2);
  });
});
