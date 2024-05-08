import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
  return Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id
  );
}

@Injectable()
export class NotificationFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
