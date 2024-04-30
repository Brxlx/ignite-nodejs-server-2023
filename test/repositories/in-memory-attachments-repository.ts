import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = [];
  // public items = new Map<UniqueEntityID, Student>();

  async create(attachment: Attachment): Promise<void> {
    // this.items.push(student);
    this.items.push(attachment);
  }
}
