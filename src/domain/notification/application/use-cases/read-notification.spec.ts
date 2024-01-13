import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryNotificationRepository: InMemoryNotificationRepository

let readNotification: ReadNotificationUseCase

describe('Read a Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    readNotification = new ReadNotificationUseCase(
      inMemoryNotificationRepository,
    )
  })

  it('It should be able to read a notification', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityId('1'),
      },
      new UniqueEntityId('notification-1'),
    )

    await inMemoryNotificationRepository.create(notification)

    const result = await readNotification.execute({
      recipientId: '1',
      notificationId: 'notification-1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('It should not be able to read a notification from another recipient', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityId('1'),
      },
      new UniqueEntityId('notification-1'),
    )

    await inMemoryNotificationRepository.create(notification)

    const result = await readNotification.execute({
      recipientId: '2',
      notificationId: 'notification-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
