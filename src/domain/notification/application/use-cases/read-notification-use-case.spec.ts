import { makeNotification } from 'test/factories/make-notification';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { ReadNotificationUseCase } from './read-notification-use-case';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
// system under test
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });
  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date));
  });

  it('should not be able to delete a notification from another user', async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('notification-1')
    );
    await inMemoryNotificationsRepository.create(newNotification);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', notificationId: 'notification-1' });
    // const a = await sut.execute({ notificationId: 'notification-1' });
    // Alternative way
    // const { notification } = await sut.execute({ slug: 'example-notification' });
    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: newNotification.id.toString(),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete an invalid notification', async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('notification-1')
    );
    await inMemoryNotificationsRepository.create(newNotification);
    // Prefered way
    // await sut.execute({ authorId: 'author-2', notificationId: 'notification-1' });
    // const a = await sut.execute({ notificationId: 'notification-1' });
    // Alternative way
    // const { notification } = await sut.execute({ slug: 'example-notification' });
    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: 'notification-2',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
