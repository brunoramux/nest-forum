import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

export class InMemoryQuestionRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }
    return question
  }

  async findBySlugWithDetails(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }

    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    if (!author) {
      throw new Error('Author not found!')
    }

    const questionAttachments = this.questionAttachmentRepository.items.filter(
      (questionAttachment) => {
        return question.id.equals(questionAttachment.questionId)
      },
    )

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      if (!attachment) {
        throw new Error('Attachments not found!')
      }

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      attachments,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async create(question: Question) {
    this.items.push(question)
    this.questionAttachmentRepository.createMany(
      question.attachments.getItems(),
    )
    DomainEvents.dispatchEventsForAggregate(question.id)
    return question
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }
    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // ordena os itens do array
      /* se a comparação for menor que zero, a é posicionado antes de b
         se a comparação for maior que zero, a é posicionado depois de b
         se a comparação for igual a zero, a e b permanecem com as posições inalteradas */
      .slice((page - 1) * 20, page * 20) // cria paginacao

    return questions
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )
    DomainEvents.dispatchEventsForAggregate(question.id)

    this.items[questionIndex] = question

    this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems(),
    )

    this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    )

    this.items.splice(questionIndex, 1)

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
