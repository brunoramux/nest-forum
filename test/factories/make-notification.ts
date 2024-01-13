import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'

// funçao criada para auxilio da execucao dos testes
export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
) {
  // Partial faz com que as propriedades, caso as QuestionProps, sejam opcionais. Podemos escolher passa-las ou nao
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override, // as informacoes que forem passadas via parametro para a funcao makeQuestion serao usadas por cima das informacoes acima.
    },
    id,
  )

  return notification
}
