import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvents } from '@/core/events/domain-events';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository';
import { InMemoryStudentsRepository } from './in-memory-students-repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  // public items: Question[] = [];
  public items = new Map<UniqueEntityID, Question>();

  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private readonly attachmentsRepository: InMemoryAttachmentsRepository,
    private readonly studentsRepository: InMemoryStudentsRepository
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = Array.from(this.items.values()).find(item => item.id.toString() === id);

    if (!question) return null;

    return question;
  }

  async findMostRecent({ page }: PaginationParams): Promise<Question[]> {
    return Array.from(this.items.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);
  }

  async create(question: Question): Promise<void> {
    // this.items.push(question);
    this.items.set(question.id, question);
    await this.questionAttachmentsRepository.createMany(question.attachments.getItems());

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question): Promise<void> {
    // const questionIndex = Array.from(this.items.values()).findIndex(
    //   item => item.id === question.id
    // );

    this.items.set(question.id, question);
    await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems());
    await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems());

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = Array.from(this.items.values()).find(item => slug === item.slug.value);

    if (!question) return null;

    return question;
  }
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = Array.from(this.items.values()).find(item => slug === item.slug.value);

    if (!question) return null;

    const author = Array.from(this.studentsRepository.items.values()).find(
      student => student.id === question.authorId
    );

    if (!author) throw new Error(`Author with ID ${question.authorId.toString()} does not exists`);

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      questionAttachment => questionAttachment.questionId.equals(question.id)
    );

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.attachmentsRepository.items.find(attachment => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });
      if (!attachment)
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} does not exists`
        );

      return attachment;
    });

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }
  async delete(question: Question): Promise<void> {
    const questionExists = Array.from(this.items.values()).find(item => item.id === question.id);

    if (questionExists) {
      this.items.delete(questionExists.id);
      await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
    }
  }
}
