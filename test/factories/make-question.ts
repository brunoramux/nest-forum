import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

// funçao criada para auxilio da execucao dos testes
export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
) {
  // Partial faz com que as propriedades, caso as QuestionProps, sejam opcionais. Podemos escolher passa-las ou nao
  const question = Question.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      slug: Slug.createFromText('Example Title'),
      ...override, // as informacoes que forem passadas via parametro para a funcao makeQuestion serao usadas por cima das informacoes acima.
    },
    id,
  )

  return question
}
