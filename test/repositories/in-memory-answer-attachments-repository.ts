import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  // public items: AnswerAttachment[] = [];
  public items = new Map<UniqueEntityID, AnswerAttachment>();

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return Array.from(this.items.values()).filter(item => item.answerId.toString() === answerId);
  }

  async create(answerAttachment: AnswerAttachment, id?: UniqueEntityID): Promise<void> {
    // this.items.push(answer);
    this.items.set(id ?? answerAttachment.id, answerAttachment);
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = Array.from(this.items.values()).filter(
      item => item.answerId.toString() === answerId
    );

    answerAttachments.forEach(answerAttachment => {
      if (answerAttachment.answerId.toString() === answerId) {
        this.items.delete(answerAttachment.id);
      }
    });
  }
}
