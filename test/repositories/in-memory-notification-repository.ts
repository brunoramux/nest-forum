import { NotificationRespository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationRespository {
  public items: Notification[] = []

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }
    return notification
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    )

    this.items[notificationIndex] = notification

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)

    return notification
  }
}
