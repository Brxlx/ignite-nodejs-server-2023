import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];
  // public items = new Map<UniqueEntityID, QuestionAttachment>();

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return this.items.filter(item => item.questionId.toString() === questionId);
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
    // attachments.map(attachment => {
    //   this.items.set(attachment.id, attachment);
    // });
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    const questionAttachments = this.items.filter(item => {
      return !attachments.some(attachment => attachment.equals(item));
    });
    this.items = questionAttachments;

    // questionAttachments.forEach(questionAttachment => {
    //   if (questionAttachment.questionId.toString() === questionId) {
    //     this.items.delete(questionAttachment.id);
    //   }
    // });
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter(
      item => item.questionId.toString() !== questionId
    );

    this.items = questionAttachments;

    // questionAttachments.forEach(questionAttachment => {
    //   if (questionAttachment.questionId.toString() === questionId) {
    //     this.items.delete(questionAttachment.id);
    //   }
    // });
  }
}
