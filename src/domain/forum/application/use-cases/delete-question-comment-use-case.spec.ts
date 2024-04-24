import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { DeleteQuestionOnCommentUseCase } from './delete-question-comment-use-case';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
// system under test
let sut: DeleteQuestionOnCommentUseCase;

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository();

    sut = new DeleteQuestionOnCommentUseCase(inMemoryQuestionCommentsRepository);
  });
  it('should be able to comment on question', async () => {
    const newQuestionComment = makeQuestionComment({});

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    await sut.execute({
      authorId: newQuestionComment.authorId.toString(),
      questionCommentId: newQuestionComment.id.toString(),
    });

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete another user question comment', async () => {
    const newQuestionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    });

    await inMemoryQuestionCommentsRepository.create(newQuestionComment);

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: newQuestionComment.id.toString(),
    });
    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
