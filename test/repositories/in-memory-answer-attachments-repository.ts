import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = [];
  // public items = new Map<UniqueEntityID, AnswerAttachment>();

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    return this.items.filter(item => item.answerId.toString() === answerId);
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
    // attachments.map(attachment => {
    //   this.items.set(attachment.id, attachment);
    // });
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
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

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter(item => item.answerId.toString() !== answerId);

    this.items = answerAttachments;
    // answerAttachments.forEach(answerAttachment => {
    //   if (answerAttachment.answerId.toString() === answerId) {
    //     this.items.delete(answerAttachment.id);
    //   }
    // });
  }
}
