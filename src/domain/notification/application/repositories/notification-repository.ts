import { Notification } from '../../enterprise/entities/notification'

export interface NotificationRespository {
  findById(id: string): Promise<Notification | null>
  create(notification: Notification): Promise<Notification>
  save(notification: Notification): Promise<Notification>
}
