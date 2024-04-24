import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { waitFor } from 'test/utils/wait-for';

import { SendNotificationUseCase } from './send-notification-use-case';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
// system under test
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova notificação',
      content: 'Conteúdo da notificação',
    });

    await waitFor(() => expect(result.isRight()).toBeTruthy());
    await waitFor(() =>
      expect(inMemoryNotificationsRepository.items[0]).toEqual(result.value?.notification)
    );
  });
});
