import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationRepository

let sendNotification: SendNotificationUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )
  })

  it('It should be able to send notification', async () => {
    const notification = await sendNotification.execute({
      recipientId: '1',
      content: 'Nova notificacao',
      title: 'Novo Titulo',
    })

    expect(notification.isRight()).toBe(true)
  })
})
