import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'

@Injectable()
export class PrismaQuestionRepository implements QuestionRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findBySlugWithDetails(slug: string): Promise<QuestionDetails | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      include: {
        author: true,
        attachments: true,
      },
    })
    if (!question) {
      return null
    }
    return PrismaQuestionDetailsMapper.toDomain(question)
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })
    if (!question) {
      return null
    }
    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })
    if (!question) {
      return null
    }
    return PrismaQuestionMapper.toDomain(question)
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map((question) => {
      return PrismaQuestionMapper.toDomain(question) // devolvo para o caso de uso Question de dominio
    })
  }

  async create(question: Question): Promise<Question> {
    const data = PrismaQuestionMapper.toPrisma(question)

    const questionCreated = await this.prisma.question.create({
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    return PrismaQuestionMapper.toDomain(questionCreated)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({
      where: {
        id: data.id,
      },
      data,
    })

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }
}
