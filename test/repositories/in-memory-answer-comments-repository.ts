import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  // public items: Answer[] = [];
  public items = new Map<UniqueEntityID, AnswerComment>();

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = Array.from(this.items.values()).find(item => item.id.toString() === id);

    if (!answerComment) return null;

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    return Array.from(this.items.values())
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);
  }

  async create(answer: AnswerComment): Promise<void> {
    // this.items.push(answer);
    this.items.set(answer.id, answer);
  }

  async delete(questionComment: AnswerComment): Promise<void> {
    const answerCommentExists = Array.from(this.items.values()).find(
      item => item.id === questionComment.id
    );

    if (answerCommentExists) {
      this.items.delete(answerCommentExists.id);
    }
  }
}
