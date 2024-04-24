import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  // public items: Answer[] = [];
  public items = new Map<UniqueEntityID, Answer>();

  constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async findById(id: string): Promise<Answer | null> {
    const answer = Array.from(this.items.values()).find(item => item.id.toString() === id);

    if (!answer) return null;

    return answer;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
    return Array.from(this.items.values())
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);
  }

  async create(answer: Answer): Promise<void> {
    // this.items.push(answer);
    this.items.set(answer.id, answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer): Promise<void> {
    // const answerIndex = Array.from(this.items.values()).findIndex(
    //   item => item.id === answer.id
    // );

    this.items.set(answer.id, answer);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerExists = Array.from(this.items.values()).find(item => item.id === answer.id);

    if (answerExists) {
      this.items.delete(answerExists.id);
      this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
    }
  }
}
