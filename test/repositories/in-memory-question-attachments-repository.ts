import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  // public items: QuestionAttachment[] = [];
  public items = new Map<UniqueEntityID, QuestionAttachment>();

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return Array.from(this.items.values()).filter(
      item => item.questionId.toString() === questionId
    );
  }

  async create(questionAttachment: QuestionAttachment, id?: UniqueEntityID): Promise<void> {
    // this.items.push(answer);
    this.items.set(id ?? questionAttachment.id, questionAttachment);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = Array.from(this.items.values()).filter(
      item => item.questionId.toString() === questionId
    );

    questionAttachments.forEach(questionAttachment => {
      if (questionAttachment.questionId.toString() === questionId) {
        this.items.delete(questionAttachment.id);
      }
    });
  }
}
