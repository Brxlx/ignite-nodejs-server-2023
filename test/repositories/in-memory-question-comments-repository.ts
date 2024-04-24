import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  // public items: Question[] = [];
  public items = new Map<UniqueEntityID, QuestionComment>();

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
