import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { FakeUploader } from 'test/storage/fake-uploader';

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type.error';
import { UploadAttachmentUseCase } from './upload-attachment-use-case';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;

// system under test
let sut: UploadAttachmentUseCase;

describe('Upload attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();

    sut = new UploadAttachmentUseCase(inMemoryAttachmentsRepository, fakeUploader);
  });
  it('should be able to upload and crete an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
      // student: inMemoryAttachmentsRepository.items.get(result.value?.student?.id),
    });
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      })
    );
  });

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
