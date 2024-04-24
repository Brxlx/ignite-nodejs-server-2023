import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find(item => item.id.toString() === id);

    if (!notification) return null;

    return notification;
  }

  public items: Notification[] = [];
  // public items = new Map<UniqueEntityID, Notification>();

  async create(notification: Notification): Promise<void> {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const notificationIndex = this.items.findIndex(item => item.id === notification.id);

    this.items[notificationIndex] = notification;
  }
}
