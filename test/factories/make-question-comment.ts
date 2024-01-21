import { faker } from '@faker-js/faker'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'

// funçao criada para auxilio da execucao dos testes
export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId,
) {
  // Partial faz com que as propriedades, caso as QuestionProps, sejam opcionais. Podemos escolher passa-las ou nao
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      content: faker.lorem.text(),
      questionId: new UniqueEntityId(),
      ...override, // as informacoes que forem passadas via parametro para a funcao makeQuestion serao usadas por cima das informacoes acima.
    },
    id,
  )

  return questionComment
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data)

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    })

    return questionComment
  }
}
