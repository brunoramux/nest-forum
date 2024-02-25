import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationRespository {
  abstract findById(id: string): Promise<Notification | null>
  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
