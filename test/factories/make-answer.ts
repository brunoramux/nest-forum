import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

// funçao criada para auxilio da execucao dos testes

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityId,
) {
  // Partial faz com que as propriedades, caso as QuestionProps, sejam opcionais. Podemos escolher passa-las ou nao
  const answer = Answer.create(
    {
      questionId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override, // as informacoes que forem passadas via parametro para a funcao makeQuestion serao usadas por cima das informacoes acima.
    },
    id,
  )

  return answer
}
