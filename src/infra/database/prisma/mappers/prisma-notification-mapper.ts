import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Notification as PrismaNotification, Prisma } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    // NotificationUncheckedCreateInput traz a tipagem com campos opcionais
    return {
      id: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      title: notification.title,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
