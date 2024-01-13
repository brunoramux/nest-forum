import { Either, left, right } from '@/core/either'
import { NotificationRespository } from '../repositories/notification-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Notification } from '../../enterprise/entities/notification'

export interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
> // Either<L, R> onde L sao os possiveis erros e R e o retorno de sucesso{

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationRespository) {}

  async execute({
    notificationId,
    recipientId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError())
    }

    notification.read()
    await this.notificationRepository.save(notification)

    return right({ notification })
  }
}
