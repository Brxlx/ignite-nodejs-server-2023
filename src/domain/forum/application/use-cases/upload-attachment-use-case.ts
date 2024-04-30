import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/types/either';

import { Attachment } from '../../enterprise/entities/attachment';
import { AttachmentsRepository } from '../repositories/attachments-repository';
import { Uploader } from '../storage/uploader';
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type.error';

interface UploadAttachmentRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAttachmentResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader
  ) {}

  public async execute({
    fileName,
    fileType,
    body,
  }: UploadAttachmentRequest): Promise<UploadAttachmentResponse> {
    if (!/^(image\/(jpeg|jpg|png))$|^application\/pdf$/.test(fileType))
      return left(new InvalidAttachmentTypeError(fileType));

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
