import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Either, left, right } from '@/core/types/either';

import { Notification } from '../../enterprise/entities/notification';
import { NotificationsRepository } from '../repositories/notifications-repository';

interface ReadNotificationRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  public async execute({
    recipientId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if (!notification) return left(new ResourceNotFoundError());

    if (recipientId !== notification.recipientId.toString()) return left(new NotAllowedError());

    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
