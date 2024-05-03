import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  // public items: Question[] = [];
  public items = new Map<UniqueEntityID, QuestionComment>();

  constructor(private readonly studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = Array.from(this.items.values()).find(item => item.id.toString() === id);

    if (!questionComment) return null;

    return questionComment;
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<QuestionComment[]> {
    return Array.from(this.items.values())
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ): Promise<CommentWithAuthor[]> {
    return Array.from(this.items.values())
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = Array.from(this.studentsRepository.items.values()).find(student => {
          return student.id.equals(comment.authorId);
        });

        if (!author)
          throw new Error(`Author with ID ${comment.authorId.toString()} does not exist`);

        return CommentWithAuthor.create({
          authorId: comment.authorId,
          author: author.name,
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        });
      });
  }

  async create(questionComment: QuestionComment): Promise<void> {
    // this.items.push(question);
    this.items.set(questionComment.id, questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentExists = Array.from(this.items.values()).find(
      item => item.id === questionComment.id
    );

    if (questionCommentExists) {
      this.items.delete(questionCommentExists.id);
    }
  }
}
