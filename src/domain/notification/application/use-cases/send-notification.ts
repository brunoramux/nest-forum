import { Either, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationRespository } from '../repositories/notification-repository'

export interface SendNotificationUseCaseRequestProps {
  recipientId: string
  title: string
  content: string
}
export type SendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class SendNotificationUseCase {
  constructor(private notificantionRepository: NotificationRespository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequestProps): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificantionRepository.create(notification)

    return right({
      notification,
    })
  }
}
